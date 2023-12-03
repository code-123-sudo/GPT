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


import { API_KEY, API_URL } from "./constants.js"

import send from './assets/send.png'
import menu from './assets/menu.png';
import editSolid from './assets/edit-solid.svg'
import xmark from './assets/xmark.svg'

import Modal from './components/Modal.js'


function App( { counter , chattings, messages, liveChat, setCounter, addChat, setChattings, addMessage, setMessages, setLiveChat  }) {
  
  const [message, setMessage] = useState('');
  const [editChatHeading, setEditChatHeading] = useState('')
  const [showEditInsideIcons, setShowEditInsideIcons] = useState(false)
  const [showModalFlag,setShowModalFlag] = useState(false)

  // const [chatMessages, setChatMessages] = useState(() => {
  //   return JSON.parse(localStorage.getItem('chatMessages')) || []
  // });
  // const [chats,setChats] = useState(() => {
  //   return JSON.parse(localStorage.getItem('chats')) || []
  // });
  // const [currentChat,setCurrentChat] = useState(() => {
  //   return JSON.parse(localStorage.getItem('currentChat')) || 'chat0'
  // });
  // const [count,setCount] = useState(() => {
  //   return JSON.parse(localStorage.getItem('count')) || 0
  // });
  const [pageNo,setPageNo] = useState(() => {
    return JSON.parse(localStorage.getItem('pageNo')) || 0
  });

  const [isStreaming,setIsStreaming] = useState('');
  const [streamData,setStreamData] = useState();
  const [isTypingLeft,setIsTypingLeft] = useState(false);
  const [isTypingRight,setIsTypingRight] = useState(false);
  const [deletingChat,setDeletingChat] = useState("")
  const [deleteChatKey,setDeleteChatKey] = useState("")

  const [isHamburger,setIsHamburger] = useState(() => {
    return JSON.parse(localStorage.getItem('isHamburger')) || false
  });
  const [isHamburgerAnimate,setIsHamburgerAnimate] = useState(() => {
    return JSON.parse(localStorage.getItem('isHamburgerAnimate')) || false
  });

  let foundInCache = false;
  let messagesEndRef = useRef(null);
  let refr = useRef(null);

  const deleteChat = (valueName,LSkey) => {
    let chatsAfterDeletion = chattings;
    chatsAfterDeletion.filter((chatValue) => {
      if (chatValue.name == valueName ){
        return false;
      }else {
        return true;
      }
    })
    setChattings([...chatsAfterDeletion]);
    localStorage.removeItem(LSkey);
    if ( LSkey == liveChat ) {
      startNewChat(true) // the chat to be deleted is the current chat opened , so no need to preprocess 
      // it before starting a new chat, its already deleted
    }
    else {
      startNewChat()// the chat to be deleted is some other chat other than the selected one right now, so first save any changes to current chat before
      //starting a new chat  
    }
  }

  const showModal = (a,b) => {
    setShowModalFlag(true)
    setDeletingChat(a)
    setDeleteChatKey(b)
  }

  const hideModal = (modalAnswer) => {
    if ( modalAnswer == "true" ) {
      deleteChat(deletingChat,deleteChatKey)
    }
    setShowModalFlag(false)
  }
  
  const saveInLocalStorage = (key,value) => {
    localStorage.setItem(key,value);
  }

  const handleChange = (event) => {
    setMessage(event.target.value)
  }

  const handleChange2 = (event) => {
    setEditChatHeading(event.target.value)
  }

  const searchInCache = () => {
    data.forEach( (quesAns) => {
        if ( quesAns.question == message ) {
          addMessage({text:quesAns.answer,isReply:true});
          setIsTypingRight(false);
          foundInCache = true;
          return;
        }
    })
  }

  useEffect(() => {
      // saveInLocalStorage('count',JSON.stringify(count))
      // saveInLocalStorage('currentChat',JSON.stringify(currentChat))
      // saveInLocalStorage('chatMessages',JSON.stringify(chatMessages))
      // saveInLocalStorage('chats',JSON.stringify(chats))
      saveInLocalStorage('isHamburger',JSON.stringify(isHamburger))
      saveInLocalStorage('isHamburgerAnimate',JSON.stringify(isHamburgerAnimate))

      saveInLocalStorage('chattings',JSON.stringify(chattings))
      saveInLocalStorage('counter',JSON.stringify(counter))
      saveInLocalStorage('liveChat',JSON.stringify(liveChat))
      saveInLocalStorage('messages',JSON.stringify(messages))
      // saveInLocalStorage('chattings',JSON.stringify(chattings))
  })

  // useEffect(() => {
  //     let countLS = localStorage.getItem('count')
  //     let currentChatLS = localStorage.getItem('currentChat')
  //     let chatMessagesLS = localStorage.getItem('chatMessages')
  //     let chatsLS = localStorage.getItem('chats')
  //     let isHamburgerLS = localStorage.getItem('isHamburger')
  //     let isHamburgerAnimateLS = localStorage.getItem('isHamburgerAnimate')

  //     countLS = JSON.parse(countLS)
  //     currentChatLS = JSON.parse(currentChatLS)
  //     chatMessagesLS =  JSON.parse(chatMessagesLS)
  //     chatsLS = JSON.parse(chatsLS)
  //     isHamburgerLS = JSON.parse(isHamburgerLS)
  //     isHamburgerAnimateLS = JSON.parse(isHamburgerAnimateLS)

  //     setCount(countLS)
  //     setCurrentChat(currentChatLS)
  //     setChatMessages(chatMessagesLS)
  //     setChats(chatsLS)
  //     setIsHamburger(isHamburgerLS)
  //     setIsHamburgerAnimate(isHamburgerAnimateLS)
  // },[])

  const fetchFromAPI = async (API_URL,message) => {
    let finalMessage = "chatgpt " + message + " Reply in a maximum of 20 words. Always reply in Hindi with English characters";
    let response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user",content: finalMessage }],
        temperature: 0.1,
        stream : true
      })
    })
    return response;
  }

  async function* streamAsyncIterator(stream) {
    // Get a lock on the stream
    const reader = stream.getReader();
    try {
      while (true) {
        // Read from the stream
        const {done, value} = await reader.read();
        // Exit if we're done
        if (done) return;
        // Else yield the chunk
        yield value;
      }
    }
    finally {
      reader.releaseLock();
    }
  }

  const getAsyncStream = async (response) => {
      let textRecieved = ""
      const decoder = new TextDecoder();
      setIsStreaming(true);
      for await (const chunk of streamAsyncIterator(response.body)) {
        scrollToBottom();
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
      scrollToBottom();
      // first search in cache for the user question
      searchInCache();
      if (!foundInCache){
        // if not found in cache , get answer from open chat ai
        const response = await fetchFromAPI(API_URL,message);
        const textRecieved = await getAsyncStream(response); 
        setIsStreaming(false)
        addMessage({text:textRecieved,isReply:true});
        foundInCache = false;
      }
      foundInCache=false;
      scrollToBottom();
    } 
    catch(error) {
      setIsTypingRight(false);
      toast("something went wrong");
    }
  }

  useEffect(() => {
    if ( messages?.length == 1 ) {
      let stringsConverted = JSON.stringify(messages);
      let key = "chat" + counter.toString();
      localStorage.setItem(key,stringsConverted);
      // setChats([{'name':count,'isEditing':false,header:""},...chats])
      setChattings([{'name':counter,'isEditing':false,header:""},...chattings])
    }
  },[messages])
 
  const addUserQuestionToChat = async (fromCache) => { 
    if ( fromCache ){
      addMessage({text:fromCache,isReply:false});
    }else {
      addMessage({text:message,isReply:false});
    }
    scrollToBottom();
    // let currentChats = chats;
    // let index = currentChats.find((chatValue) => {
    //   if (chatValue.name == pageNo ) {
    //     return true;
    //   }else {
    //     return false;
    //   }
    // })
    // if (index > -1 ) { 
    //   let editField = currentChats[index].isEditing
    //   let headerField = currentChats[index].header
    //   currentChats.splice(index, 1);
    //   currentChats = [{'name':pageNo,'isEditing':editField,header:headerField},...currentChats]
    //   setChats(currentChats)
    // }
    let currentChattings = chattings;
    let index = currentChattings.find((chatValue) => {
      if (chatValue.name == pageNo ) {
        return true;
      }else {
        return false;
      }
    })
    if (index > -1 ) { 
      let editField = currentChattings[index].isEditing
      let headerField = currentChattings[index].header
      currentChattings.splice(index, 1);
      currentChattings = [{'name':pageNo,'isEditing':editField,header:headerField},...currentChattings]
      setChattings(currentChattings)
    }
    setStreamData("")
    setMessage(null)
    scrollToBottom();
    addAiAnswerToChat();
    scrollToBottom();
  }

  const enterKeySend = e => {
    if (e.keyCode === 13) {
      refr.current.value = "";
      scrollToBottom();
      addUserQuestionToChat();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const setNewEmptyChatValues = (counter) => {
    setMessages([]);
    let currentCounter = counter+1;
    setCounter(currentCounter)
    let liveChatValue = "chat"+currentCounter.toString();
    setLiveChat(liveChatValue)
  }

  const startNewChat = (isDeletion=false) => {

    // addChat({'name':counter,'isEditing': false, header: "a"})
    // setChattings([{'name':counter,'isEditing': false, header: ""},{'name':counter+1,'isEditing': false, header: ""}])
    // addMessage({text:"abab",isReply:false})
    // let x = {text:"dsds",isReply:false}
    // addMessage(x);
    // console.log("here we go",messages)
    // x = {text:"abcd",isReply:false}
    // addMessage(x);
    // console.log("here we go",messages)
    // x = [...messages,{text:"efgh",isReply:false}]
    // setMessages(x);
    // console.log("here we go",messages)
    // setLiveChat("chat1")
    // increment()
    // console.log(counter)
    // console.log(chattings)
    
    // console.log(liveChat)

    if ( messages?.length == 0 ) return;
    let isOld = false;
    const LSkeys = Object.keys(localStorage);
    LSkeys.forEach((LSkey) => {
      if ( LSkey == liveChat) {
          //previous was a old chat edition, save it first
          isOld = true;
          let stringConverted = JSON.stringify(messages);
          localStorage.setItem(LSkey,stringConverted);
          //start a new chat
          setNewEmptyChatValues(counter)
          return;
      }
    });
    if ( isDeletion ) {
          // start a new chat, do not save previous chat
          setNewEmptyChatValues(counter);
          return
    }
    if (!isOld ){
      //previous was a new chat, save it first
      let stringsConverted = JSON.stringify(messages);
      let key = "chat" + counter.toString();
      localStorage.setItem(key,stringsConverted);
      // setChats([{'name':count,'isEditing': false, header: ""},...chats])
      setChattings([{'name':counter,'isEditing': false, header: ""},...chattings])
      // start a new chat
      setNewEmptyChatValues(counter);
    }
  }

  const fetchOldChat = (countNo) => {

    if(messages?.length != 0) {
      let stringsConverted2 = JSON.stringify(messages);
      localStorage.setItem(liveChat,stringsConverted2);
      /* checking wether its a new chat or old chat */
      let oldChatFlag = 0;
      // oldChatFlag = chats.find((chat)=> {
      //   if (chat.name == count ) return true;
      //   else return false;
      // })
      // if ( oldChatFlag == -1 ) setChats([{'name':count,'isEditing':false,header:""},...chats]) 
      oldChatFlag = chattings.find((chatting)=> {
        if (chatting.name == counter ) return true;
        else return false;
      })
      if ( oldChatFlag == -1 ) setChattings([{'name':counter,'isEditing':false,header:""},...chattings])

    }
    let liveKey = "chat" + countNo.toString();
    if ( liveKey == liveChat ) return;/*user clicked on same chat button twice */
    setLiveChat(liveKey)
    /*update the chat messages of button being clicked */
    let retString = localStorage.getItem(liveKey);
    let retArray = JSON.parse(retString);
    setMessages(retArray)
    
    /* sorting the chat order as newest first */
    setPageNo(countNo)
  }

   const editHeading = (index) => {
    setEditChatHeading("")
    setShowEditInsideIcons(true)
    let chatsAfterEdition = []
    // for ( let i = 0; i < chats.length ; i++ ) {
    //   if ( i == index ) {
    //     let clickedChat = {
    //       isEditing : true,
    //       name : '',
    //       header: ''
    //     }
    //     clickedChat.isEditing = !chats[i].isEditing
    //     clickedChat.name = chats[i].name
    //     clickedChat.header = chats[i].header
    //     chatsAfterEdition[i] = clickedChat
    //   }
    //   else {
    //     let otherChatName = chats[i].name
    //     let otherChatHeader = chats[i].header
    //     let otherChat = {
    //       isEditing : false,
    //       name: otherChatName,
    //       header : otherChatHeader
    //     }
    //     chatsAfterEdition[i] = otherChat
    //   }
    // }
    // setChats([...chatsAfterEdition])

    for ( let i = 0; i < chattings.length ; i++ ) {
      if ( i == index ) {
        let clickedChat = {
          isEditing : true,
          name : '',
          header: ''
        }
        clickedChat.isEditing = !chattings[i].isEditing
        clickedChat.name = chattings[i].name
        clickedChat.header = chattings[i].header
        chatsAfterEdition[i] = clickedChat
      }
      else {
        let otherChatName = chattings[i].name
        let otherChatHeader = chattings[i].header
        let otherChat = {
          isEditing : false,
          name: otherChatName,
          header : otherChatHeader
        }
        chatsAfterEdition[i] = otherChat
      }
    }
    setChattings([...chatsAfterEdition])

   }

   const editHeadingFinal =  (index) => {
    let chatsAfterEditionFinal = []
    // for ( let i = 0; i < chats.length ; i++ ) {
    //   if ( i == index ) {
    //     let selectedChat = {
    //       isEditing : true,
    //       name : '',
    //       header: ''
    //     }
    //     selectedChat.isEditing = !chats[i].isEditing
    //     selectedChat.name = chats[i].name
    //     selectedChat.header = chats[i].header
    //     if ( chats[i].isEditing ){
    //       if(!editChatHeading) {
    //         selectedChat.header = " "
    //       }else {
    //         selectedChat.header = editChatHeading;
    //       } 
    //     }
    //     else {
    //       // do nothing 
    //     }
    //     chatsAfterEditionFinal[i] = selectedChat
    //   }
    //   else {
    //     let otherChatName = chats[i].name
    //     let otherChatHeader = chats[i].header
    //     let otherChat = {
    //       isEditing : false,
    //       name: otherChatName,
    //       header : otherChatHeader
    //     }
    //     chatsAfterEditionFinal[i] = otherChat
    //   }
    // }
    // setChats([...chatsAfterEditionFinal])
    for ( let i = 0; i < chattings.length ; i++ ) {
      if ( i == index ) {
        let selectedChat = {
          isEditing : true,
          name : '',
          header: ''
        }
        selectedChat.isEditing = !chattings[i].isEditing
        selectedChat.name = chattings[i].name
        selectedChat.header = chattings[i].header
        if ( chattings[i].isEditing ){
          if(!editChatHeading) {
            selectedChat.header = " "
          }else {
            selectedChat.header = editChatHeading;
          } 
        }
        else {
          // do nothing 
        }
        chatsAfterEditionFinal[i] = selectedChat
      }
      else {
        let otherChatName = chattings[i].name
        let otherChatHeader = chattings[i].header
        let otherChat = {
          isEditing : false,
          name: otherChatName,
          header : otherChatHeader
        }
        chatsAfterEditionFinal[i] = otherChat
      }
    }
    setChattings([...chatsAfterEditionFinal])
    setShowEditInsideIcons(false)
   }

   const discardEditing = () => {
    let resetChats = []
    // for ( let i = 0 ; i < chats.length; i++ ) {
    //   let resetChat = {
    //     isEditing: false,
    //     name: '',
    //     header: ''
    //   }
    //   resetChat.name = chats[i].name
    //   resetChat.header = chats[i].header
    //   resetChats[i] = resetChat;
    // }
    for ( let i = 0 ; i < chattings.length; i++ ) {
      let resetChat = {
        isEditing: false,
        name: '',
        header: ''
      }
      resetChat.name = chattings[i].name
      resetChat.header = chattings[i].header
      resetChats[i] = resetChat;
    }
    setChattings([...resetChats])
    setShowEditInsideIcons(false)
   }

  return (
    <div className="topDiv">
        <Modal show={showModalFlag} handleClose={hideModal}>Modal</Modal>
      <div className="menuButton" onClick={() => {setIsHamburger(!isHamburger);setIsHamburgerAnimate(!isHamburgerAnimate)}}>
        <img src={menu} className="iconImg" />
      </div>
      <div className={ isHamburger ? 'hamburger' : 'hamburger hamburger2'} >
        <div className="newChatButton" onClick={startNewChat} >New Chat +</div>
        {chattings?.map((value,index) => {
          console.log(value)
          let keyRr = "chat" + value.name.toString();
          let returnString = localStorage.getItem(keyRr);
          let returnArray = JSON.parse(returnString);
          let quesText = '';
          if (!returnArray ){
            return null;
          }
          if ( returnArray ){
            quesText = returnArray[0]?.text
          }
          quesText = quesText?.slice(0,5)
          return (
            <div className="chatsListItem">
              { !value.isEditing ? <div className="chatText" onClick={ () => {fetchOldChat(value.name)}}>
                {value.header.length > 0  ? value.header : quesText + '....' }
              </div> : <input type="text" className="editHead" value={editChatHeading} onChange={handleChange2}/> }
              
              {showEditInsideIcons && value.isEditing ?
                <>
                  <div className="editButton" onClick={() => {editHeadingFinal(index)}}><img src={editSolid} className="editSo" /></div>
                  <div className="deleteButton" onClick={ () => {discardEditing()} }><img src={xmark} className="xmark"/></div>
                </> :
                <>
                <div className="editButton" onClick={() => {editHeading(index)}}>E</div>
                <div className="deleteButton" onClick={ () => {showModal(value.name,keyRr)} }>D</div>
                </>
              }
            </div>
          )
          }
        )}
      </div>
      <div className= {"chatBox " +  (isHamburgerAnimate ? 'chatBox2' : null) }>
        <div className="parentDiv">
          <div className="box">
            <ToastContainer />
            <div className='chat-container'>
              {messages?.map((value) => {
                if (!value.isReply) {
                  return (
                    <div className="chatLeftContainer">
                      <div className="user">You</div>
                      <div className='chat-left'>
                        {value.text}
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div className="chatLeftContainer">
                      <div className="user">Assistant</div>
                      <div className='chat-right'>
                        {value.text}
                      </div>
                    </div>
                  )
                }
              })}
            {
              isTypingLeft &&
                <div className="chatLeftContainer">
                  <div className="user">Assistant</div>
                  <div className='chat-left'>
                    ...typing
                  </div>
                </div>
              }
              {
               isTypingRight &&
               <div className="chatLeftContainer">
                  <div className="user">Assistant</div>
                  <div className='chat-right'>
                    ...typing
                  </div>
                </div>
              }
              {
              isStreaming &&
                <div className="chatLeftContainer">
                  <div className="user">Assistant</div>
                  <div className='chat-right'>
                    {streamData}
                  </div>
                </div>
              }
              <div className="scroll-point" ref={messagesEndRef}>
              </div> 
          </div>
           
            
        </div>
      </div>
        { messages?.length == 0 ?
          <div className="commonfaqs">
            <div className="faqs1">
              <div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[0].question)}}>{defaultQuestions[0].question}</div>
              <div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[1].question)}}>{defaultQuestions[1].question}</div>
            </div>
            <div className="faqs2">
              <div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[2].question)}}>{defaultQuestions[2].question}</div>
              <div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[3].question)}}>{defaultQuestions[3].question}</div>
            </div>
          </div> : null }
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
  liveChat: state.liveChat.liveChat
})

const mapDispatchToProps = (dispatch) => ({
  setCounter: (dataObject) => dispatch(setCounter(dataObject)),
  addChat: (dataObject) => dispatch(addChat(dataObject)),
  setChattings: (dataObject) => dispatch(setChattings(dataObject)),
  addMessage: (dataObject) => dispatch(addMessage(dataObject)),
  setMessages: (dataObject) => dispatch(setMessages(dataObject)),
  setLiveChat: (dataObject) => dispatch(setLiveChat(dataObject))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
