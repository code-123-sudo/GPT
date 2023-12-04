import React { useEffect , useState , useRef } from 'react';
import { connect } from 'react-redux';
import './UserInput.css'

import { setCounter } from '../../actions/counterActions.js'
import { addChat, setChattings } from '../../actions/chattingsActions.js'
import { addMessage, setMessages } from '../../actions/messagesActions.js'
import { setLiveChat } from '../../actions/liveChatActions.js'


const UserInput = () => {
	const [message, setMessage] = useState('');
	const [isStreaming,setIsStreaming] = useState('');
  	const [streamData,setStreamData] = useState();
  	let foundInCache = false;

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





	let refr = useRef(null);

	const handleChange = (event) => {
    	setMessage(event.target.value)
  	}

  	const enterKeySend = e => {
    	if (e.keyCode === 13) {
      		refr.current.value = "";
      		addUserQuestionToChat();
    	}
  	};

	return (
		<div className="flexRowContainer">
          <div className="flexRow">
            <div className="inputContainer">
              <input type='text' ref={refr} placeholder='Ask me anything about Jainism' onKeyDown={enterKeySend} onChange={handleChange} value={message}/>
            </div>
            <div className="icon" onClick={addUserQuestionToChat}> <img src={send} /> </div>
          </div>
        </div>
	)
}