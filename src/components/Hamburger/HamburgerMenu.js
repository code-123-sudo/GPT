import React, { useState , useEffect , useRef } from 'react';
import { connect } from 'react-redux';
import Modal from '../Modal/Modal.js'
import './HamburgerMenu.css'
import menu from '../../assets/menu.png';
import menuWhite from '../../assets/menuWhite.svg'
import editSolid from '../../assets/edit-solid.svg'
import xmark from '../../assets/xmark.svg'

import { setCounter } from '../../actions/counterActions.js'
import { addChat, setChattings } from '../../actions/chattingsActions.js'
import { addMessage, setMessages } from '../../actions/messagesActions.js'
import { setLiveChat } from '../../actions/liveChatActions.js'
import { setPageNo, setIsHamburger, setIsHamburgerAnimate } from '../../actions/commonActions.js'


const HamburgerMenu = ({  chattings, counter, liveChat, messages , setChattings, setCounter, setLiveChat, setMessages, setPageNo, isStreaming,
isHamburger, isHamburgerAnimate, setIsHamburger, setIsHamburgerAnimate}) => { 
  const [showEditInsideIcons, setShowEditInsideIcons] = useState(false)
  const [editChatHeading, setEditChatHeading] = useState('')

  const [deletingChat,setDeletingChat] = useState("")
  const [deleteChatKey,setDeleteChatKey] = useState("")
  const [showModalFlag,setShowModalFlag] = useState(false)

  const deleteChat = (valueName,LSkey) => {
    const chatsAfterDeletion = chattings.filter((chatValue) => chatValue.name == valueName)
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

  const handleChange = (event) => {
    setEditChatHeading(event.target.value)
  }

  const showModal = (deletingChat,deleteChatKey) => {
    setShowModalFlag(true)
    setDeletingChat(deletingChat)
    setDeleteChatKey(deleteChatKey)
  }

  const hideModal = (modalAnswer) => {
    if ( modalAnswer == "true" ) {
      deleteChat(deletingChat,deleteChatKey)
    }
    setShowModalFlag(false)
  }


  const setNewEmptyChatValues = (counter) => {
      setMessages([]);
      let currentCounter = counter+1;
      setCounter(currentCounter)
      let liveChatValue = "chat"+currentCounter.toString();
      setLiveChat(liveChatValue)
  }

  const startNewChat = (isDeletion=false) => {
    if ( messages?.length === 0 || !messages ){ 
      return;
    }
    let isOld = false;
    const LSkeyExist = localStorage.getItem(liveChat) !== null;
    if ( LSkeyExist ) {
      //previous was a old chat edition, save it first
      isOld = true;
      let stringConverted = JSON.stringify(messages);
      localStorage.setItem(liveChat,stringConverted);
      //start a new chat
      setNewEmptyChatValues(counter)
      return;
    }
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


   const editHeading = (index) => {
    setEditChatHeading("")
    setShowEditInsideIcons(true)
    const chatsAfterEdition = chattings.map((chat,i) => {
        if ( i == index ) {
          return {
            isEditing : !chat.isEditing,
            name : chat.name,
            header: chat.header
          }
        }
        else {
          return  {
            isEditing : false,
            name: chat.name,
            header : chat.header
          }
        }
    })
    setChattings([...chatsAfterEdition])
  }

   const editHeadingFinal =  (index) => {
    const chatsAfterEditionFinal = chattings.map((chat,i) => {
      if ( i == index ) {
        let selectedChat = {
          isEditing : true,
          name : '',
          header: ''
        }
        selectedChat.isEditing = !chat.isEditing
        selectedChat.name = chat.name
        selectedChat.header = chat.header
        if ( chat.isEditing ){
          if(!editChatHeading) {
            selectedChat.header = " "
          }else {
            selectedChat.header = editChatHeading;
          } 
        }
        else {
          // do nothing 
        }
        return selectedChat
      }
      else {
        return {
          isEditing : false,
          name : chat.name,
          header : chat.header
        }
      }
    })
    setChattings([...chatsAfterEditionFinal])
    setShowEditInsideIcons(false)
   }

   const discardEditing = () => {
    let resetChats = chattings.map((chat,i) => {
      return {
        isEditing: false,
        name: chat.name,
        header: chat.header
      }
      }
    )
    setChattings([...resetChats])
    setShowEditInsideIcons(false)
   }

  const fetchOldChat = (countNo) => {

    if(messages?.length !== 0) {
      let stringsConverted2 = JSON.stringify(messages);
      localStorage.setItem(liveChat,stringsConverted2);
      /* checking wether its a new chat or old chat */
      let oldChatFlag = 0;
      oldChatFlag = chattings.some((chatting) => chatting.name === counter ) 
      if ( !oldChatFlag ) setChattings([{'name':counter,'isEditing':false,header:""},...chattings])
    }
    let liveKey = "chat" + countNo.toString();
    if ( liveKey === liveChat ) return;/*user clicked on same chat button twice */
    setLiveChat(liveKey)
    /*update the chat messages of button being clicked */
    let retString = localStorage.getItem(liveKey);
    let retArray = JSON.parse(retString);
    setMessages(retArray)
    
    /* sorting the chat order as newest first */
    setPageNo(countNo)
  }

  return (
<>
    <Modal show={showModalFlag} handleClose={hideModal}>Modal</Modal>

    <div className="menuButton" onClick={() => {setIsHamburger(!isHamburger);setIsHamburgerAnimate(!isHamburgerAnimate)}}>
        <img src={isHamburger ? menuWhite : menu} className="iconImg" />
    </div>

    <div className={ isHamburger ? 'hamburger' : 'hamburger hamburger2'} >
        <button disabled={isStreaming ? true : false} className={ isHamburger ? "newChatButton" : "displayNone"} onClick={startNewChat} >New Chat +</button>
        {chattings?.map((value,index) => {
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
            <div className={ isHamburger ?  value.isEditing ? "chatsListItem chatsListItemHover" : "chatsListItem"  : "displayNone"}>
              { !value.isEditing ? <div className="chatText" onClick={ () => {fetchOldChat(value.name)}}>
                {value.header.length > 0  ? value.header : quesText + '....' }
              </div> : <input type="text" className="editHead" value={editChatHeading} onChange={handleChange}/> }
              
              {showEditInsideIcons && value.isEditing ?
                <>
                  <div className="editButton" onClick={() => {editHeadingFinal(index)}}>E</div>
                  <div className="deleteButton" onClick={ () => {discardEditing()} }>D</div>
                </> :
                <>
                <div className="editButton" onClick={() => {editHeading(index)}}><img src={editSolid} className="editSo" /></div>
                <div className="deleteButton" onClick={ () => {showModal(value.name,keyRr)} }><img src={xmark} className="xmark"/></div>
                </>
              }
            </div>
          )
          }
        )}
      </div>
      </>
  )
}

const mapStateToProps = (state) => ({
  chattings: state.chattings.chattings,
  counter: state.counter.counter,
  liveChat: state.liveChat.liveChat,
  messages: state.messages.messages,
  isStreaming: state.common.isStreaming,
  isHamburger: state.common.isHamburger,
  isHamburgerAnimate: state.common.isHamburgerAnimate
})

const mapDispatchToProps = (dispatch) => ({
  setChattings: (dataObject) => dispatch(setChattings(dataObject)),
  setMessages: (dataObject) => dispatch(setMessages(dataObject)),
  setLiveChat: (dataObject) => dispatch(setLiveChat(dataObject)),
  setCounter: (dataObject) => dispatch(setCounter(dataObject)),
  setPageNo:  (dataObject) => dispatch(setPageNo(dataObject)),
  setIsHamburger: (dataObject) => dispatch(setIsHamburger(dataObject)),
  setIsHamburgerAnimate: (dataObject) => dispatch(setIsHamburgerAnimate(dataObject)) 
})

export default connect(mapStateToProps, mapDispatchToProps)(HamburgerMenu);