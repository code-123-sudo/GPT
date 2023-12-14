import React, { useState , useEffect , useRef } from 'react';
import { connect } from 'react-redux';
import Modal from '../Modal/Modal.js';
import Search from '../Search/Search.js';
import './HamburgerMenu.css'

import menu from '../../assets/menu.png';
import MenuIcon from '@mui/icons-material/Menu';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import editSolid from '../../assets/edit-solid.svg'
import xmark from '../../assets/xmark.svg'

import { setCounter } from '../../actions/counterActions.js'
import { addChat, setChattings } from '../../actions/chattingsActions.js'
import { addMessage, setMessages } from '../../actions/messagesActions.js'
import { setLiveChat } from '../../actions/liveChatActions.js'
import { setPageNo, setIsHamburger, setIsHamburgerAnimate } from '../../actions/commonActions.js'

import { editHeading, editHeadingFinal , discardEditing } from '../../utilities/generalUtilities.js'

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';

const HamburgerMenu = ({  chattings, counter, liveChat, messages , setChattings, setCounter, setLiveChat, setMessages, setPageNo, isStreaming,
isHamburger, isHamburgerAnimate, setIsHamburger, setIsHamburgerAnimate}) => { 
  const [showEditInsideIcons, setShowEditInsideIcons] = useState(false)
  const [editChatHeading, setEditChatHeading] = useState('')

  const [deletingChat,setDeletingChat] = useState("")
  const [deleteChatKey,setDeleteChatKey] = useState("")
  const [showModalFlag,setShowModalFlag] = useState(false)

  const [searchValue,setSearchValue] = useState("")

  const handleChange1 = (e) => {
    setSearchValue(e.target.value)
  }

  const ariaLabel = { 'aria-label': 'description' };

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
        <MenuIcon fontSize="large" sx={{ color: "#1E68D7" }} />
    </div>
    { isHamburger &&
    <div className={ isHamburger ? 'hamburger' : 'hamburger hamburger2'} >
             
        
        <br/>

        <div className="searchContainer">
          <TextField 
            id="outlined-search" label="Search" type="search" onChange={() => {handleChange1(event)}} value={searchValue} className="searchInput2" 
            sx={{
              width: 300,
              color: 'success.main',
              '& .MuiOutlinedInput-notchedOutline': {
                height: '45px',
                width: '150px',
                marginLeft: '10px'
              },
              '& MuiFormLabel-root-MuiInputLabel-root':{
                marginTop: '-7px',
                marginLeft: '5px' ,
              }
            }}
            />
        </div>
        <Button variant="contained" disabled={isStreaming ? true : false} className={ isHamburger ? "newChatButton" : "displayNone"} onClick={startNewChat} >New Chat +</Button>

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
          
          let searchResultIndex = -1
          let searchText = '';

          for ( let i = 0; i < returnArray.length ; i++ ) {
            searchResultIndex = returnArray[i].text.search(searchValue);
            if ( searchResultIndex != -1 ) {
              searchText = returnArray[i].text.slice(searchResultIndex,searchResultIndex+5)
              break;
            }
          }
          if ( searchResultIndex === -1 ) {
            searchResultIndex = value.header.search(searchValue)
          }
          if ( (searchValue !== "" && searchResultIndex !== -1) || searchValue === ""){
            return (
                <div className={ isHamburger ? "chatsListItem" : "displayNone"}>
                  { !value.isEditing ? <div className="chatText" onClick={ () => {fetchOldChat(value.name)}}>
                    {value.header.length > 0  ? value.header : quesText + '....' }
                  </div> : <input type="text" className="editHead" value={editChatHeading} onChange={handleChange}/> }
                
                  {showEditInsideIcons && value.isEditing ?
                    <>
                      <div className="editButton" onClick={() => {editHeadingFinal(index,chattings,setChattings,setShowEditInsideIcons,editChatHeading)}}>E</div>
                      <div className="deleteButton" onClick={ () => {discardEditing(chattings,setChattings,setShowEditInsideIcons)} }>D</div>
                    </> :
                    <>
                    <div className="editButton" onClick={() => {editHeading(index,setEditChatHeading,setShowEditInsideIcons,chattings,setChattings)}}><EditNoteIcon fontSize="large" sx={{ color: "#1E68D7" }} /></div>
                    <div className="deleteButton" onClick={ () => {showModal(value.name,keyRr)} }><DeleteIcon fontSize="large" sx={{ color: "#1E68D7", width: "23px" }} /></div>
                    </>
                  }
                </div>
              )
          }
        }
        )}
      </div>} 
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