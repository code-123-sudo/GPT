import React from 'react'
import './SingleMessage.css';
import Star from '../../assets/Star.svg'

const SingleMessage = ({ left , text }) => {
    return (
      <div className="chatLeftContainer">
        <div className={ left ? "user" : "ai"}>{ left ? "S" : <img src={Star} />}</div>
          <div className= { left ? "chat-left" : "chat-right"}>
            {text}
          </div>
      </div>
    )
}

export default SingleMessage;
