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
import { setPageNo } from './actions/commonActions.js'
import { setIsStreaming } from './actions/commonActions.js'
import { setStreamData } from './actions/commonActions.js'
import { setIsTypingLeft } from './actions/commonActions.js'
import { setIsTypingRight } from './actions/commonActions.js'
import { setIsHamburger } from './actions/commonActions.js'
import { setIsHamburgerAnimate } from './actions/commonActions.js'

import { API_KEY, API_URL } from "./constants.js"

import send from './assets/send.png'

import menu from './assets/menu.png';
import editSolid from './assets/edit-solid.svg'
import xmark from './assets/xmark.svg'

import Modal from './components/Modal/Modal.js'

import Commonfaqs from './components/Commonfaqs/Commonfaqs.js'
import ChatText from './components/ChatText/ChatText.js'
import HamburgerMenu from './components/Hamburger/HamburgerMenu.js'
import UserInput from './components/UserInput/UserInput.js'

import { streamAsyncIterator, saveInLocalStorage, searchInCache, fetchFromAPI, sortLatestChatUp } from './utilities/generalUtilities.js'

function App( { counter , chattings, messages, liveChat, setCounter, addChat, setChattings, addMessage, setMessages, setLiveChat, message , setMessage ,
    pageNo , setPageNo , isStreaming , setIsStreaming , streamData , setStreamData , isTypingLeft , setIsTypingLeft ,
    isTypingRight , setIsTypingRight , isHamburger , setIsHamburger , isHamburgerAnimate , setIsHamburgerAnimate 
 }) {   
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
       <UserInput></UserInput>
          
      </div>


    </div>
  );
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
  setCounter: (dataObject) => dispatch(setCounter(dataObject)),
  addChat: (dataObject) => dispatch(addChat(dataObject)),
  setChattings: (dataObject) => dispatch(setChattings(dataObject)),
  addMessage: (dataObject) => dispatch(addMessage(dataObject)),
  setMessages: (dataObject) => dispatch(setMessages(dataObject)),
  setLiveChat: (dataObject) => dispatch(setLiveChat(dataObject)),
  setMessage: (dataValue) => dispatch(setMessage(dataValue)),
  setPageNo: (dataValue) => dispatch(setPageNo(dataValue)),
  setIsStreaming: (dataValue) => dispatch(setIsStreaming(dataValue)),
  setStreamData: (dataValue) => dispatch(setStreamData(dataValue)),
  setIsTypingLeft: (dataValue) => dispatch(setIsTypingLeft(dataValue)),
  setIsTypingRight: (dataValue) => dispatch(setIsTypingRight(dataValue)),
  setIsHamburger: (dataValue) => dispatch(setIsHamburger(dataValue)),
  setIsHamburgerAnimate: (dataValue) => dispatch(setIsHamburgerAnimate(dataValue))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
