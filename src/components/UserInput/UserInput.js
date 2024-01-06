import React ,{ useEffect , useState , useRef } from 'react';
import { connect } from 'react-redux';
import './UserInput.css'

import TextField from '@mui/material/TextField';
import OutlinedInput from "@mui/material/OutlinedInput";
import { alpha, styled } from "@mui/material/styles";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { data, defaultQuestions } from '../../data.js'

import { setMessage } from '../../actions/commonActions.js'
import { setPageNo } from '../../actions/commonActions.js'
import { setLiveChat } from '../../actions/liveChatActions.js'
import { setIsStreaming } from '../../actions/commonActions.js'
import { setStreamData } from '../../actions/commonActions.js'
import { setIsTypingLeft } from '../../actions/commonActions.js'
import { setIsTypingRight } from '../../actions/commonActions.js'
import { setIsHamburger } from '../../actions/commonActions.js'
import { setIsHamburgerAnimate } from '../../actions/commonActions.js'
import { setChattings } from '../../actions/chattingsActions.js'
import { addMessage } from '../../actions/messagesActions.js'

import send from '../../assets/send.png';
import SendIcon from '@mui/icons-material/Send';
import { streamAsyncIterator, getAsyncStream, searchInCache, fetchFromAPI, sortLatestChatUp } from '../../utilities/generalUtilities.js'

import { API_KEY, API_URL } from "../../constants.js"

import Commonfaqs from "../Commonfaqs/Commonfaqs.js" 

import { createChat, getChat, getChats, updateChat, deleteChat } from "../../apis/chatAPI.js";

const Checking = styled(OutlinedInput)({
  "& label.Mui-focused": {
    display: "none",
  },
  "& fieldset": {
    color: "white",
    border: "4px solid #D3D3D3",
    borderRadius: "30px",
    overflow: "hidden",
  },
  "&.Mui-focused fieldset": {
    display: "none",
  },
  "&:hover fieldset": {
    border: "4px solid #D3D3D3 !important",
  },
});

const UserInput = ({chattings, messages, liveChat, setLiveChat, setChattings, addMessage, message , setMessage ,
    	pageNo , setPageNo , setIsStreaming  , setStreamData ,
    	 setIsTypingRight , isHamburger , setIsHamburger , isHamburgerAnimate , setIsHamburgerAnimate }) => {

  const [messageInput,setMessageInput] = useState("")
  const [textTransactionFlag,setTextTransactionFlag] = useState(false)

  let refr = useRef(null);
  const handleChange = (event) => {
    setMessageInput(event.target.value)
    setMessage(event.target.value)
  }

  const addAiAnswerToChat = async () => {
    try {
      setIsTypingRight(true);
      // first search in cache for the user question
      const cachedAns = searchInCache(message,data)
      if (!cachedAns){
        // if not found in cache , get answer from open chat ai
        const response = await fetchFromAPI(API_URL,API_KEY,message);
        setIsStreaming(true)
        setIsTypingRight(false)
        const textRecieved = await getAsyncStream(response,setStreamData); 
        setIsStreaming(false)
        addMessage({text:textRecieved,isReply:true});
      } else {
        setIsTypingRight(false);
        addMessage(cachedAns)
      }
    } 
    catch(error) {
      console.error("Error adding AI answer to chat",error)
      // Add more specefic handler based on the error type if needed
      setIsTypingRight(false);
      toast("something went wrong");
    }
  }

  useEffect(() => {
    let chatName = Math.random().toString(36).substring(7);
    let index = chattings.findIndex((chat) => chat.name === liveChat );
    if ( messages?.length == 1 && index == - 1) {
      setLiveChat(chatName)
      let stringsConverted = JSON.stringify(messages);
      setChattings([ {name:chatName,isEditing:false,header:"",msgs:messages},...chattings])
      console.log(chattings)
    } else {
      if ( index > -1 ) {
        let x = chattings[index];
        const updatedChattings = [
          ...chattings.slice(0, index),
          { name:x.name,isEditing:x.isEditing,header:x.header,msgs:messages },
          ...chattings.slice(index + 1)
        ];
        console.log("updating chattins",updatedChattings)
        setChattings(updatedChattings);
      }
    }
  },[messages])

    useEffect(() => {
    console.log(chattings)
  },[chattings])
 
  const addUserQuestionToChat = async (fromCache) => { 
//     let reqBody = {
//       "name": "count2",
//       "messages": messages
//     }
//     let res = await createChat(reqBody);
//     console.log("1",res);

   
//     res = await getChat("count2");
//     console.log("2",res);

//     reqBody = {
//     }
//     res = await getChats();
//     console.log("3",res);

//     reqBody = {
//       "filterQueryValue" : "count2",
//       "filterQueryKey" : "name",
//       "updateQueryValue" : messages,
//       "updateQueryKey" : "messages"
//     }
//     res = await updateChat(reqBody);
//     console.log("4",res);

//     res = await deleteChat("count2");
//     console.log("5",res);

    const userQuestion = fromCache ? fromCache : message;
      addMessage({text:userQuestion,isReply:false});
    let sortedChattings = sortLatestChatUp(chattings,pageNo); 
    if(sortedChattings){
      setChattings(sortedChattings)
    }
    setStreamData("")
    setMessage(null)
    addAiAnswerToChat();
  }

  const enterKeySend = e => {
    if (e.keyCode === 13) {
      setMessageInput("")
      refr.current.blur();
      refr.current.value = "";
      addUserQuestionToChat();
    }
  };

  const callAddUserQuestionToChat = () => {
    addUserQuestionToChat()
  }

	return (
		<div data-testid="userinput-1">
		  <div className="flexRowContainer">
        {messages.length == 0 ? <Commonfaqs addUserQuestionToChat={addUserQuestionToChat} > </Commonfaqs> : null}
        <div className="flexRow">
          <div className="inputContainer">
            <Checking ref={refr} id="outlined-search" placeholder="Ask me anything about Jainism" type="text" onKeyDown={enterKeySend} onChange={handleChange} value={messageInput} className="searchBox" />
          </div>
          <div className="sendIcon" onClick={callAddUserQuestionToChat} > <SendIcon onClick={callAddUserQuestionToChat} sx={{ color: "#2a2a2a" ,fontSize: 30, marginTop : "12px", cursor: "pointer" }} /> </div>
        </div>
      </div>
    </div>
	)
}


const mapStateToProps = (state) => ({
  chattings: state.chattings.chattings,
  messages: state.messages.messages,
  liveChat: state.liveChat.liveChat,
  message: state.common.message,
  pageNo: state.common.pageNo,
  isHamburger: state.common.isHamburger,
  isHamburgerAnimate: state.common.isHamburgerAnimate
})

const mapDispatchToProps = (dispatch) => ({
  setChattings: (dataObject) => dispatch(setChattings(dataObject)),
  addMessage: (dataObject) => dispatch(addMessage(dataObject)),
  setMessage: (dataValue) => dispatch(setMessage(dataValue)),
  setLiveChat:  (dataValue) => dispatch(setLiveChat(dataValue)),
  setPageNo: (dataValue) => dispatch(setPageNo(dataValue)),
  setIsStreaming: (dataValue) => dispatch(setIsStreaming(dataValue)),
  setStreamData: (dataValue) => dispatch(setStreamData(dataValue)),
  setIsTypingRight: (dataValue) => dispatch(setIsTypingRight(dataValue)),
  setIsHamburger: (dataValue) => dispatch(setIsHamburger(dataValue)),
  setIsHamburgerAnimate: (dataValue) => dispatch(setIsHamburgerAnimate(dataValue))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserInput);