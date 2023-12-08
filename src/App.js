import React, { useState , useEffect , useRef } from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import Commonfaqs from './components/Commonfaqs/Commonfaqs.js'
import ChatText from './components/ChatText/ChatText.js'
import HamburgerMenu from './components/Hamburger/HamburgerMenu.js'
import UserInput from './components/UserInput/UserInput.js'


function App(props) {   
  return (
    <div className="topDiv">
      <HamburgerMenu></HamburgerMenu>
      <div className= {"chatBox " +  (props.isHamburgerAnimate ? 'chatBox2' : null) }>
        <div className="parentDiv">
          <div className="box">
            <ToastContainer />
            <ChatText></ChatText>  
          </div>
        </div>
       <UserInput></UserInput>     
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isHamburgerAnimate: state.common.isHamburgerAnimate
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(App)

