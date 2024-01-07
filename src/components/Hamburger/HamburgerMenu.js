import React, { useState , useEffect , useRef } from 'react';
import { connect } from 'react-redux';
import Modal from '../Modal/Modal.js';
import './HamburgerMenu.css'

import menu from '../../assets/menu.png';
import MenuIcon from '@mui/icons-material/Menu';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import editSolid from '../../assets/edit-solid.svg'
import xmark from '../../assets/xmark.svg'

import { addChat, setChattings } from '../../actions/chattingsActions.js'
import { addMessage, setMessages } from '../../actions/messagesActions.js'
import { setLiveChat } from '../../actions/liveChatActions.js'
import { setPageNo, setIsHamburger, setIsHamburgerAnimate } from '../../actions/commonActions.js'
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";

import { editHeading, editHeadingFinal , discardEditing } from '../../utilities/generalUtilities.js'
import { deleteChat, getChats } from "../../apis/chatAPI.js";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';

const SearchInput = styled(OutlinedInput)({
  "& label.Mui-focused": {
    display: "none",
  },
  'input': {
    '&::placeholder': {
      textOverflow: 'ellipsis !important',
      color: 'white !important'
    },
  },
  "& label": {
    color: "white",
  },
  "& fieldset": {
    color: "white",
    border: "1px solid #D3D3D3",
    borderRadius: "30px",
    overflow: "hidden",
  },
  "&.Mui-focused fieldset": {
    display: "none",
  },
  "&:hover fieldset": {
    border: "1px solid #D3D3D3 !important",
  },
});

const HamburgerMenu = ({  chattings, liveChat, messages , setChattings, setLiveChat, setMessages, setPageNo, isStreaming,
isHamburger, isHamburgerAnimate, setIsHamburger, setIsHamburgerAnimate}) => { 
  const [showEditInsideIcons, setShowEditInsideIcons] = useState(false)
  const [editChatHeading, setEditChatHeading] = useState('')

  const [deletingChat,setDeletingChat] = useState("")
  const [showModalFlag,setShowModalFlag] = useState(false)

  const [searchValue,setSearchValue] = useState("")

  const handleChange1 = (e) => {
    setSearchValue(e.target.value)
  }

  const loadChats = async () => {
      let res = await getChats();
      setChattings(res.result);
  }


  const ariaLabel = { 'aria-label': 'description' };

  const removeChat = async (valueName) => {
    // const chatsAfterDeletion = chattings.filter((chatValue) => chatValue.name != valueName)
    // setChattings([...chatsAfterDeletion]);
    await deleteChat(valueName)
    await loadChats()
    if ( valueName == liveChat ) {
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
  }

  const hideModal = (modalAnswer) => {
    if ( modalAnswer == "true" ) {
      removeChat(deletingChat)
    }
    setShowModalFlag(false)
  }


  const setNewEmptyChatValues = () => {
      setMessages([]);
      let liveChatValue = Math.random().toString(36).substring(7);
      setLiveChat(liveChatValue)
  }

  const startNewChat = (isDeletion=false) => {
    setNewEmptyChatValues();
  }

  const fetchOldChat = (chatUniqueName) => {
    let liveKey = chatUniqueName;
    if ( liveKey === liveChat ) return;/*user clicked on same chat button twice */
    setLiveChat(liveKey)
    let index = chattings.findIndex((chatValue) => chatValue.name === liveKey )
    if (index > -1 ) { 
      let retString = chattings[index].msgs;
      console.log("return string",retString)
      setMessages(retString)
    }
  }

  return (
<>
    <Modal show={showModalFlag} handleClose={hideModal}>Modal</Modal>

    <div className="menuButton" onClick={() => {setIsHamburger(!isHamburger);setIsHamburgerAnimate(!isHamburgerAnimate)}}>
        <MenuIcon fontSize="large" sx={{ color: "white" }} />
    </div>
    { isHamburger &&
    <div className={ isHamburger ? 'hamburger' : 'hamburger hamburger2'} >
             
        
        <br/>

        <Button variant="contained" disabled={isStreaming ? true : false} className={ isHamburger ? "newChatButton" : "displayNone"} onClick={startNewChat} >New Chat +</Button>
        <div className="searchContainer">
          <SearchInput 
            id="outlined-search" placeholder="Search" type="search" onChange={() => {handleChange1(event)}} value={searchValue} className="searchInput2" />
        </div>

        {chattings?.map((value,index) => {
          let quesText = '';
          if (!value.msgs ){
            return null;
          }
          if ( value.msgs ){
              quesText = value.msgs[0].text
          }
          quesText = quesText?.slice(0,5)
          
          let searchResultIndex = -1
          let searchText = '';

          for ( let i = 0; i < value.msgs.length ; i++ ) {
            searchResultIndex = value.msgs[i].text.search(searchValue);
            if ( searchResultIndex != -1 ) {
              searchText = value.msgs[i].text.slice(searchResultIndex,searchResultIndex+5)
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
                  <div className="buttonBox">
                    <div className="editButton" onClick={() => {editHeadingFinal(index,chattings,setChattings,setShowEditInsideIcons,editChatHeading)}}>E</div>
                    <div className="deleteButton" onClick={ () => {discardEditing(chattings,setChattings,setShowEditInsideIcons)} }>D</div>
                  </div>
                     :
                  <div className="buttonBox">
                    <div className="editButton" onClick={() => {editHeading(index,setEditChatHeading,setShowEditInsideIcons,chattings,setChattings)}}><EditNoteIcon className="iconImage" fontSize="large" sx={{ color: "#3d3d3d" }} /></div>
                    <div className="deleteButton" onClick={ () => {showModal(value.name)} }><DeleteIcon fontSize="large" sx={{ color: "#3d3d3d", width: "23px" }} /></div>
                  </div>
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
  setPageNo:  (dataObject) => dispatch(setPageNo(dataObject)),
  setIsHamburger: (dataObject) => dispatch(setIsHamburger(dataObject)),
  setIsHamburgerAnimate: (dataObject) => dispatch(setIsHamburgerAnimate(dataObject)) 
})

export default connect(mapStateToProps, mapDispatchToProps)(HamburgerMenu);