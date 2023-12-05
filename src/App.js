import React, { useState , useEffect , useRef } from 'react';
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { data, defaultQuestions } from './data.js'
import 'react-toastify/dist/ReactToastify.css';

import { setCounter } from './actions/counterActions.js'
import { addChat, setChattings } from './actions/chattingsActions.js'
import { addMessage, setMessages } from './actions/messagesActions.js'
import { setLiveChat } from './actions/liveChatActions.js'
import { setMessage } from './actions/commonActions.js'

import { API_KEY, API_URL } from "./constants.js"

import send from './assets/send.png'

import menu from './assets/menu.png';
import editSolid from './assets/edit-solid.svg'
import xmark from './assets/xmark.svg'

import Modal from './components/Modal/Modal.js'

import Commonfaqs from './components/Commonfaqs/Commonfaqs.js'
import ChatText from './components/ChatText/ChatText.js'
import HamburgerMenu from './components/Hamburger/HamburgerMenu.js'

import { streamAsyncIterator, saveInLocalStorage, searchInCache, fetchFromAPI, sortLatestChatUp } from './utilities/generalUtilities.js'

function App( { counter , chattings, messages, liveChat, setCounter, addChat, setChattings, addMessage, setMessages, setLiveChat, message , setMessage   }) {
  

  const [pageNo,setPageNo] = useState(() => {
    return JSON.parse(localStorage.getItem('pageNo')) || 0
  });

  const [isStreaming,setIsStreaming] = useState('');
  const [streamData,setStreamData] = useState();
  const [isTypingLeft,setIsTypingLeft] = useState(false);
  const [isTypingRight,setIsTypingRight] = useState(false);

  const [isHamburger,setIsHamburger] = useState(() => {
    return JSON.parse(localStorage.getItem('isHamburger')) || false
  });
  const [isHamburgerAnimate,setIsHamburgerAnimate] = useState(() => {
    return JSON.parse(localStorage.getItem('isHamburgerAnimate')) || false
  });

  let foundInCache = false;
  let refr = useRef(null);
  

  const handleChange = (event) => {

    setMessage(event.target.value)
  }

  useEffect(() => {
      
      saveInLocalStorage('isHamburger',JSON.stringify(isHamburger))
      saveInLocalStorage('isHamburgerAnimate',JSON.stringify(isHamburgerAnimate))

      saveInLocalStorage('chattings',JSON.stringify(chattings))
      saveInLocalStorage('counter',JSON.stringify(counter))
      saveInLocalStorage('liveChat',JSON.stringify(liveChat))
      saveInLocalStorage('messages',JSON.stringify(messages))
      
  })

  const getAsyncStream = async (response) => {
      let textRecieved = ""
      const decoder = new TextDecoder();
      setIsStreaming(true);
      for await (const chunk of streamAsyncIterator(response.body)) {
        setIsTypingRight(false)
        const data = decoder.decode(chunk)
        const lsData = data.split("\n\n")
        lsData.map((data) => {
          try {
            const jd = JSON.parse(data.replace("data: ",""));
            if ( jd["choices"][0]["delta"]["content"] ){
              const txt = jd["choices"][0]["delta"]["content"]
              textRecieved += txt;
              setStreamData(textRecieved)
            }
          } catch(err) {
            // console.log(err)
          }
        })
      }
      return textRecieved
  }

  const addAiAnswerToChat = async () => {
    try {
      setIsTypingRight(true);
      // first search in cache for the user question
      let cacheAns = searchInCache(message,data)
      if (!cacheAns){
        // if not found in cache , get answer from open chat ai
        const response = await fetchFromAPI(API_URL,API_KEY,message);
        const textRecieved = await getAsyncStream(response); 
        setIsStreaming(false)
        addMessage({text:textRecieved,isReply:true});
      } else {
        setIsTypingRight(false);
        addMessage(cacheAns)
      }
    } 
    catch(error) {
      console.log(error)
      setIsTypingRight(false);
      toast("something went wrong");
    }
  }

  useEffect(() => {
    if ( messages?.length == 1 ) {
      let stringsConverted = JSON.stringify(messages);
      let key = "chat" + counter.toString();
      localStorage.setItem(key,stringsConverted);
      setChattings([{'name':counter,'isEditing':false,header:""},...chattings])
    }
  },[messages])
 
  const addUserQuestionToChat = async (fromCache) => { 

    if ( fromCache ){
      addMessage({text:fromCache,isReply:false});
    }else {
      addMessage({text:message,isReply:false});
    }
    let currentChattings = sortLatestChatUp(chattings,pageNo); 
    if(currentChattings){
      setChattings(currentChattings)
    }
    setStreamData("")
    setMessage(null)
    addAiAnswerToChat();
  }

  const enterKeySend = e => {
    if (e.keyCode === 13) {
      refr.current.value = "";
      addUserQuestionToChat();
    }
  };

   
  return (
    <div className="topDiv">
      <HamburgerMenu setPageNo={setPageNo}></HamburgerMenu>
      <div className= {"chatBox " +  (isHamburgerAnimate ? 'chatBox2' : null) }>
        <div className="parentDiv">
          <div className="box">
            <ToastContainer />
            <ChatText isStreaming={isStreaming} isTypingLeft={isTypingLeft} isTypingRight={isTypingRight} streamData={streamData}></ChatText>  
          </div>
        </div>
        { messages?.length == 0 ?
          <Commonfaqs addUserQuestionToChat={addUserQuestionToChat}> </Commonfaqs> : null }
        <div className="flexRowContainer">
          <div className="flexRow">
            <div className="inputContainer">
              <input type='text' ref={refr} placeholder='Ask me anything about Jainism' onKeyDown={enterKeySend} onChange={handleChange} value={message}/>
            </div>
            <div className="icon" onClick={addUserQuestionToChat}> <img src={send} /> </div>
          </div>
        </div>
      </div>


    </div>
  );
}

const mapStateToProps = (state) => ({
  counter: state.counter.counter,
  chattings: state.chattings.chattings,
  messages: state.messages.messages,
  liveChat: state.liveChat.liveChat,
  message: state.common.message
})

const mapDispatchToProps = (dispatch) => ({
  setCounter: (dataObject) => dispatch(setCounter(dataObject)),
  addChat: (dataObject) => dispatch(addChat(dataObject)),
  setChattings: (dataObject) => dispatch(setChattings(dataObject)),
  addMessage: (dataObject) => dispatch(addMessage(dataObject)),
  setMessages: (dataObject) => dispatch(setMessages(dataObject)),
  setLiveChat: (dataObject) => dispatch(setLiveChat(dataObject)),
  setMessage: (dataValue) => dispatch(setMessage(dataValue))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
