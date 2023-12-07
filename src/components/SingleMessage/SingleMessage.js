import React from 'react'
import './SingleMessage.css';

const SingleMessage = ({ left , text }) => {
  if (left) {
    return (
      <div className="chatLeftContainer">
        <div className="user">You</div>
          <div className='chat-left'>
            {text}
          </div>
      </div>
    )
  } else {
    return (
      <div className="chatLeftContainer">
        <div className="user">Assistant</div>
          <div className='chat-right'>
            {text}
        </div>
      </div>
    )
  }
}

export default SingleMessage;
