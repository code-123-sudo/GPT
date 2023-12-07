import React, { useState , useEffect , useRef } from 'react';
import './ChatText.css';
import { connect } from 'react-redux';
import SingleMessage from '../SingleMessage/SingleMessage.js'

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
            <SingleMessage left={true} text={value.text} />
          )
        } else {
          return (
            <SingleMessage left={false} text={value.text} />
          )
        }
      })}
      {
        isTypingLeft &&
          <SingleMessage left={true} text="typing..." />
      }
      {
        isTypingRight &&
          <SingleMessage left={false} text="typing..." />
      }
      {
        isStreaming &&
          <SingleMessage left={false} text={streamData} />
      }
      <div className="scroll-point" ref={messagesEndRef}>
      </div>
    </div>
  )
}
// isStreaming={isStreaming} isTypingLeft={isTypingLeft} isTypingRight={isTypingRight} streamData={streamData}>
const mapStateToProps = (state) => ({
  messages: state.messages.messages,
  isStreaming: state.common.isStreaming,
  streamData: state.common.streamData,
  isTypingLeft: state.common.isTypingLeft,
  isTypingRight: state.common.isTypingRight,
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatText);
