import React, { useState , useEffect , useRef } from 'react';
import { connect } from 'react-redux';
import { setLiveChat } from '../../actions/liveChatActions.js'
import "./Search.css"

const Search = ({chattings,liveChat,setLiveChat,messages}) => {
  const [searchValue,setSearchValue] = useState("")
  const [allChattingsText,setAllChattingsText] = useState([])
  
  const handleChange = (e) => {
    setSearchValue(e.target.value)
  }

  const fetchOldChat = (countNo) => {
    let liveKey = "chat" + countNo.toString();
    if ( liveKey === liveChat ) return;/*user clicked on same chat button twice */
    setLiveChat(liveKey)
    /*update the chat messages of button being clicked */
    let retString = localStorage.getItem(liveKey);
    let retArray = JSON.parse(retString);
    setMessages(retArray)
    
    /* sorting the chat order as newest first */
    // setPageNo(countNo)
  }

  return (
    <div className="searchContainer">
      <input type="text" placeholder="search" onChange={() => {handleChange(event)}} value={searchValue} className="searchInput" />
      <br/>
      <br/>
      <br/>
      {searchValue !== "" && chattings.map((value,index) => {
      let keyRr = "chat" + value.name.toString();
      let returnString = localStorage.getItem(keyRr)
      let returnArray = JSON.parse(returnString)
      for ( let i = 0; i < returnArray.length ; i++ ) {
        let searchResultIndex = -1
        let quesText = '';
        let chatHeading = returnArray[0].text.slice(0,5)
        searchResultIndex = returnArray[i].text.search(searchValue);
        console.log("search result index is",searchResultIndex)
        if ( searchResultIndex != -1 ) {
          quesText = returnArray[i].text.slice(searchResultIndex,searchResultIndex+5)
          return(
            <div className="searchChatText" onClick={ () => {fetchOldChat(value.name)}}>
                {value.header.length > 0  ? value.header : chatHeading + '....' }
                {"search result :-"+quesText}
            </div>
          )
        }
      }
    })}
    </div>
  );
};

const mapStateToProps = (state) => ({
  chattings: state.chattings.chattings,
  liveChat: state.liveChat.liveChat,
  messages: state.messages.messages,
})

const mapDispatchToProps = (dispatch) => ({
  setLiveChat: (dataObject) => dispatch(setLiveChat(dataObject)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)