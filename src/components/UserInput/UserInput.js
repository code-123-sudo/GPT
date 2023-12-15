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
import { streamAsyncIterator, getAsyncStream, saveInLocalStorage, searchInCache, fetchFromAPI, sortLatestChatUp } from '../../utilities/generalUtilities.js'

import { API_KEY, API_URL } from "../../constants.js"

import Commonfaqs from "../Commonfaqs/Commonfaqs.js" 

const Checking = styled(OutlinedInput)({
  "& label.Mui-focused": {
    display: "none",
  },
  "& fieldset": {
    border: "4px solid #D3D3D3",
    borderRadius: "30px",
    overflow: "hidden",
  },
  "&.Mui-focused fieldset": {
    display: "none",
  },
  "&:hover fieldset": {
    border: "4px solid #D3D3D3 !important",
    backgroundColor: "transparent",
  },
});

const UserInput = ({ counter , chattings, messages, liveChat, setChattings, addMessage, message , setMessage ,
    	pageNo , setPageNo , setIsStreaming  , setStreamData ,
    	 setIsTypingRight , isHamburger , setIsHamburger , isHamburgerAnimate , setIsHamburgerAnimate }) => {

  const [messageInput,setMessageInput] = useState("")

  let refr = useRef(null);
  const handleChange = (event) => {
    setMessageInput(event.target.value)
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
        addMessage(cacheAns)
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
    if ( messages?.length == 1 ) {
      let stringsConverted = JSON.stringify(messages);
      let key = "chat" + counter.toString();
      localStorage.setItem(key,stringsConverted);
      setChattings([{'name':counter,'isEditing':false,header:""},...chattings])
    }
  },[messages])
 
  const addUserQuestionToChat = async (fromCache) => { 
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

	return (
		<div data-testid="userinput-1">
    {messages.length == 0 ? <Commonfaqs addUserQuestionToChat={addUserQuestionToChat} > </Commonfaqs> : null}
		  <div className="flexRowContainer">
        <div className="flexRow">
          <div className="inputContainer">
            <Checking ref={refr} id="outlined-search" placeholder="Ask me anything about Jainism" type="text" onKeyDown={enterKeySend} onChange={handleChange} value={messageInput} className="searchBox" />
          </div>

          <div className="icon" onClick={addUserQuestionToChat}> <SendIcon onClick={addUserQuestionToChat} sx={{ color: "#3d3d3d" ,fontSize: 40, marginTop : "9px", cursor: "pointer" }} /> </div>
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
  setIsTypingRight: (dataValue) => dispatch(setIsTypingRight(dataValue)),
  setIsHamburger: (dataValue) => dispatch(setIsHamburger(dataValue)),
  setIsHamburgerAnimate: (dataValue) => dispatch(setIsHamburgerAnimate(dataValue))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserInput);