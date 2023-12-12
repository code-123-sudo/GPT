import React from 'react'
import './SingleMessage.css';

const SingleMessage = ({ left , text }) => {
    return (
      <div className="chatLeftContainer">
        <div className="user">You</div>
          <div className= { left ? 'chat-left' : 'chat-right'}>
            {text}
          </div>
      </div>
    )
}

export default SingleMessage;
