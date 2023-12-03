import React, { useState , useEffect , useRef } from 'react';
import './ChatText.css';
import { connect } from 'react-redux';

const ChatText = ({ messages , isTypingLeft , isTypingRight , isStreaming , streamData}) => {
  let messagesEndRef = useRef(null);
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    scrollToBottom()
  },[messages])
  return (
    <div className='chat-container'>
      {messages?.map((value) => {
        if (!value.isReply) {
          return (
            <div className="chatLeftContainer">
              <div className="user">You</div>
                <div className='chat-left'>
                    {value.text}
                  </div>
              </div>
          )
        } else {
          return (
            <div className="chatLeftContainer">
              <div className="user">Assistant</div>
                <div className='chat-right'>
                  {value.text}
                </div>
            </div>
          )
        }
      })}
      {
        isTypingLeft &&
          <div className="chatLeftContainer">
            <div className="user">Assistant</div>
            <div className='chat-left'>
              ...typing
            </div>
          </div>
      }
      {
        isTypingRight &&
          <div className="chatLeftContainer">
            <div className="user">Assistant</div>
            <div className='chat-right'>
              ...typing
            </div>
          </div>
      }
      {
        isStreaming &&
          <div className="chatLeftContainer">
            <div className="user">Assistant</div>
            <div className='chat-right'>
              {streamData}
            </div>
          </div>
      }
      <div className="scroll-point" ref={messagesEndRef}>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  messages: state.messages.messages
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatText);
