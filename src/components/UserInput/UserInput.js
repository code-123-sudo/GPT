import React ,{ useEffect , useState , useRef } from 'react';
import { connect } from 'react-redux';
import './UserInput.css'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { data, defaultQuestions } from '../../data.js'

import { setMessage } from '../../actions/commonActions.js'
import { setPageNo } from '../../actions/commonActions.js'
import { setIsStreaming } from '../../actions/commonActions.js'
import { setStreamData } from '../../actions/commonActions.js'
import { setIsTypingLeft } from '../../actions/commonActions.js'
import { setIsTypingRight } from '../../actions/commonActions.js'
import { setIsHamburger } from '../../actions/commonActions.js'
import { setIsHamburgerAnimate } from '../../actions/commonActions.js'
import {  setChattings } from '../../actions/chattingsActions.js'
import { addMessage } from '../../actions/messagesActions.js'

import send from '../../assets/send.png';
import { streamAsyncIterator, saveInLocalStorage, searchInCache, fetchFromAPI, sortLatestChatUp } from '../../utilities/generalUtilities.js'

import { API_KEY, API_URL } from "../../constants.js"

import Commonfaqs from "../Commonfaqs/Commonfaqs.js" 

const UserInput = ({ counter , chattings, messages, liveChat, setChattings, addMessage, message , setMessage ,
    	pageNo , setPageNo , isStreaming , setIsStreaming , streamData , setStreamData , isTypingLeft , setIsTypingLeft ,
    	isTypingRight , setIsTypingRight , isHamburger , setIsHamburger , isHamburgerAnimate , setIsHamburgerAnimate }) => {

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
		<div>
		{messages.length == 0 ? <Commonfaqs addUserQuestionToChat={addUserQuestionToChat} > </Commonfaqs> : null}
		<div className="flexRowContainer">
          <div className="flexRow">
            <div className="inputContainer">
              <input type='text' ref={refr} placeholder='Ask me anything about Jainism' onKeyDown={enterKeySend} onChange={handleChange} value={message}/>
            </div>
            <div className="icon" onClick={addUserQuestionToChat}> <img src={send} /> </div>
          </div>
        </div>
        </div>
	)
}


const mapStateToProps = (state) => ({
  counter: state.counter.counter,
  chattings: state.chattings.chattings,
  messages: state.messages.messages,
  liveChat: state.liveChat.liveChat,
  message: state.common.message,
  pageNo: state.common.pageNo,
  isStreaming: state.common.isStreaming,
  streamData: state.common.streamData,
  isTypingLeft: state.common.isTypingLeft,
  isTypingRight: state.common.isTypingRight,
  isHamburger: state.common.isHamburger,
  isHamburgerAnimate: state.common.isHamburgerAnimate
})

const mapDispatchToProps = (dispatch) => ({
  setChattings: (dataObject) => dispatch(setChattings(dataObject)),
  addMessage: (dataObject) => dispatch(addMessage(dataObject)),
  setMessage: (dataValue) => dispatch(setMessage(dataValue)),
  setPageNo: (dataValue) => dispatch(setPageNo(dataValue)),
  setIsStreaming: (dataValue) => dispatch(setIsStreaming(dataValue)),
  setStreamData: (dataValue) => dispatch(setStreamData(dataValue)),
  setIsTypingLeft: (dataValue) => dispatch(setIsTypingLeft(dataValue)),
  setIsTypingRight: (dataValue) => dispatch(setIsTypingRight(dataValue)),
  setIsHamburger: (dataValue) => dispatch(setIsHamburger(dataValue)),
  setIsHamburgerAnimate: (dataValue) => dispatch(setIsHamburgerAnimate(dataValue))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserInput);