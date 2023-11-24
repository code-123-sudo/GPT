import React, { useState , useEffect , useRef } from 'react';
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ToastContainer, toast } from 'react-toastify';
import { data, defaultQuestions } from './data.js'
import 'react-toastify/dist/ReactToastify.css';

import { API_KEY, API_URL } from "./constants.js"

import send from './assets/send.png'
import menu from './assets/menu.png';

import Modal from './components/Modal.js'


function App() {
  const [message, setMessage] = useState('');
  const [editChatHeading, setEditChatHeading] = useState('')
  const [showEditInsideIcons, setShowEditInsideIcons] = useState(false)
  const [showModalFlag,setShowModalFlag] = useState(false)

  const [chatMessages, setChatMessages] = useState(() => {
    return JSON.parse(localStorage.getItem('chatMessages')) || []
  });;
  const [chats,setChats] = useState(() => {
    return JSON.parse(localStorage.getItem('chats')) || []
  });;
  const [currentChat,setCurrentChat] = useState(() => {
    return JSON.parse(localStorage.getItem('currentChat')) || 'chat0'
  });
  const [count,setCount] = useState(() => {
    return JSON.parse(localStorage.getItem('count')) || 0
  });

  const [pageNo,setPageNo] = useState(() => {
    return JSON.parse(localStorage.getItem('pageNo')) || 0
  });


  
  const [isStreaming,setIsStreaming] = useState('');
  const [streamData,setStreamData] = useState();

  const [isTypingLeft,setIsTypingLeft] = useState(false);
  const [isTypingRight,setIsTypingRight] = useState(false);

  const [deletingChat,setDeletingChat] = useState("")
  const [deleteChatKey,setDeleteChatKey] = useState("")

   const [isHamburger,setIsHamburger] = useState(() => {
    return JSON.parse(localStorage.getItem('isHamburger')) || false
  });
  const [isHamburgerAnimate,setIsHamburgerAnimate] = useState(() => {
    return JSON.parse(localStorage.getItem('isHamburgerAnimate')) || false
  });

  let foundInCache = false;
  let messagesEndRef = useRef(null);
  let refr = useRef(null);

  useEffect(() => {

  },[chatMessages,chats,currentChat,count])

  const deleteChat = (valueName,LSkey) => {
    let toBeDeleted = -1;
    for ( let i = 0; i < chats.length; i++){
      if ( chats[i].name == valueName) {
        let temp = [];
        for ( let j = 0, k = 0; j < chats.length; j++ ) {
            if ( j == i ) {
              toBeDeleted = j;
              continue;
            }
            temp[k] = chats[j];
            k++;
        }
        if ( LSkey == currentChat ) {
          setChats([...temp]);
          localStorage.removeItem(LSkey);
          startNewChat(true)
          // let curr = 'chat' + chats[0].name;
          // setCurrentChat('chat'+chats[0].name)
        }
        else {
          // setChatMessages([]);
          setChats([...temp]);
          localStorage.removeItem(LSkey);
          startNewChat()
        }
      }
    }
   }

  const showModal = (a,b) => {
    setShowModalFlag(true)
    setDeletingChat(a)
    setDeleteChatKey(b)
  }

  const hideModal = (modalAnswer) => {
    if ( modalAnswer == "true" ) {
      deleteChat(deletingChat,deleteChatKey)
    }
    setShowModalFlag(false)
  }
  
  const saveInLocalStorage = (key,value) => {
    localStorage.setItem(key,value);
  }

  const handleChange = (event) => {
    setMessage(event.target.value)
  }

  const handleChange2 = (event) => {
    setEditChatHeading(event.target.value)
  }

  const searchInCache = () => {
    data.forEach( (quesAns) => {
        if ( quesAns.question == message ) {
          setChatMessages(chatMessages => [...chatMessages,{text:quesAns.answer,isReply:true}]);
          setIsTypingRight(false);
          foundInCache = true;
          return;
        }
    })
  }

  useEffect(() => {
      saveInLocalStorage('count',JSON.stringify(count))
      saveInLocalStorage('currentChat',JSON.stringify(currentChat))
      saveInLocalStorage('chatMessages',JSON.stringify(chatMessages))
      saveInLocalStorage('chats',JSON.stringify(chats))
      saveInLocalStorage('isHamburger',JSON.stringify(isHamburger))
      saveInLocalStorage('isHamburgerAnimate',JSON.stringify(isHamburgerAnimate))
  })

  useEffect(() => {
      let countLS = localStorage.getItem('count')
      let currentChatLS = localStorage.getItem('currentChat')
      let chatMessagesLS = localStorage.getItem('chatMessages')
      let chatsLS = localStorage.getItem('chats')
      let isHamburgerLS = localStorage.getItem('isHamburger')
      let isHamburgerAnimateLS = localStorage.getItem('isHamburgerAnimate')

      countLS = JSON.parse(countLS)
      currentChatLS = JSON.parse(currentChatLS)
      chatMessagesLS =  JSON.parse(chatMessagesLS)
      chatsLS = JSON.parse(chatsLS)
      isHamburgerLS = JSON.parse(isHamburgerLS)
      isHamburgerAnimateLS = JSON.parse(isHamburgerAnimateLS)

      setCount(countLS)
      setCurrentChat(currentChatLS)
      setChatMessages(chatMessagesLS)
      setChats(chatsLS)
      setIsHamburger(isHamburgerLS)
      setIsHamburgerAnimate(isHamburgerAnimateLS)

  },[])

  const addAiAnswerToChat = async () => {
    try {
      setIsTypingRight(true);
      scrollToBottom();

      // first search in cache for the user question
      searchInCache();

      if (!foundInCache){
      // if not found in cache , get answer from open chat ai
        const finalMessage = "chatgpt " + message + " Reply in a maximum of 20 words. Always reply in Hindi with English characters";
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
            },
          body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user",content: finalMessage }],
          temperature: 0.1,
          stream : true
          }),
        });


        async function* streamAsyncIterator(stream) {
      // Get a lock on the stream
          const reader = stream.getReader();
          try {
            while (true) {
      // Read from the stream
            const {done, value} = await reader.read();
      // Exit if we're done
            if (done) return;
      // Else yield the chunk
            yield value;
          }
        }
          finally {
            reader.releaseLock();
          }
        }

        let textRecieved = ""
        const decoder = new TextDecoder();
        await setIsStreaming(true);
        for await (const chunk of streamAsyncIterator(response.body)) {
          scrollToBottom();
          setIsTypingRight(false)
          const data = decoder.decode(chunk)
          const lsData = data.split("\n\n")
          lsData.map((data) => {
          try {
            const jd = JSON.parse(data.replace("data: ",""));
            if ( jd["choices"][0]["delta"]["content"] ){
              const txt = jd["choices"][0]["delta"]["content"]
              textRecieved += txt;
              setStreamData(textRecieved)
            }
          } catch(err) {

            }
          })
        }
        setIsStreaming(false)
        setChatMessages(chatMessages => [...chatMessages,{text:textRecieved,isReply:true}]);
        foundInCache = false;
      }

      foundInCache=false;
      scrollToBottom();
    } 

    catch(error) {
      await setIsTypingRight(false);
      console.log(error)
      toast("something went wrong");
    }
  }


  useEffect(() => {
    if ( chatMessages?.length == 1 ) {
      let stringsConverted = JSON.stringify(chatMessages);
      let key = "chat" + count.toString();
      localStorage.setItem(key,stringsConverted);
      setChats([{'name':count,'isEditing':false,header:""},...chats])
    }
  },[chatMessages])
 



  const addUserQuestionToChat = async (fromCache) => { 
    if ( fromCache ){
      setChatMessages(chatMessages => [...chatMessages,{text:fromCache,isReply:false}]);
    }else {
      setChatMessages(chatMessages => [...chatMessages,{text:message,isReply:false}]);
    }
    scrollToBottom();
    let tempChats = chats;
    let index = -1;
    for ( let i = 0; i < tempChats.length; i++ ) {
      if ( tempChats[i].name == pageNo ) {
        index = i;
      }
    }

    if (index > -1 ) { 
      let editField = tempChats[index].isEditing
      let headerField = tempChats[index].header
      tempChats.splice(index, 1);
      tempChats = [{'name':pageNo,'isEditing':editField,header:headerField},...tempChats]
      setChats(tempChats)
    }
    setStreamData("")
    setMessage(null)
    scrollToBottom();
    addAiAnswerToChat();
    scrollToBottom();
  }

  const enterKeySend = e => {
    if (e.keyCode === 13) {
      refr.current.value = "";
      scrollToBottom();
      addUserQuestionToChat();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const startNewChat = (isDeletion=false) => {

    if ( chatMessages?.length == 0 ) return;
    
    let isOld = false;
    const keyss = Object.keys(localStorage);
    keyss.forEach((keys) => {
      if ( keys == currentChat) {
          //previous was a old chat edition, save it first
          isOld = true;
          let stringConverted = JSON.stringify(chatMessages);
          localStorage.setItem(keys,stringConverted);
          

          //start a new chat
          setChatMessages([]);
          let tempCount = count+1;
          setCount(tempCount)
          let tempCounts = "chat"+tempCount.toString();
          setCurrentChat(tempCounts)

          return;
      }
    });

    if ( isDeletion ) {

          // start a new chat
          setChatMessages([]);
          let tempCount = count+1;
          setCount(tempCount)
          let tempCounts = "chat"+tempCount.toString();
          setCurrentChat(tempCounts)
          return
    }


    if (!isOld ){
      //previous was a new chat, save it first
      let stringsConverted = JSON.stringify(chatMessages);
      let key = "chat" + count.toString();
      localStorage.setItem(key,stringsConverted);
      setChats([{'name':count,'isEditing': false, header: ""},...chats])
      

      // start a new chat
      setChatMessages([]);
      let tempCount = count+1;
      setCount(tempCount);
      tempCount = tempCount.toString();
      let tempChat = "chat"+tempCount;
      setCurrentChat(tempChat)
    }
  }

  const fetchOldChat = (countNo) => {

    if(chatMessages?.length != 0) {
      let stringsConverted2 = JSON.stringify(chatMessages);
      localStorage.setItem(currentChat,stringsConverted2);
      /* checking wether its a new chat or old chat */

      let oldChatFlag = false;

      for ( let i = 0; i < chats.length; i++ ) {
        if ( chats[i].name == count ) oldChatFlag = true;
      }


      if ( !oldChatFlag ) setChats([{'name':count,'isEditing':false,header:""},...chats]) 
    }


    let keyR = "chat" + countNo.toString();
    if ( keyR == currentChat ) return;/*user clicked on same chat button twice */
    setCurrentChat(keyR)

    /*update the chat messages of button being clicked */
    let retString = localStorage.getItem(keyR);
    let retArray = JSON.parse(retString);
    setChatMessages(retArray);
    
    
    /* sorting the chat order as newest first */
    setPageNo(countNo)
  }

   const editHeading = (index) => {
    setShowEditInsideIcons(true)
    let temp = []
    for ( let i = 0; i < chats.length ; i++ ) {
      if ( i == index ) {
        let temp2 = {
          isEditing : true,
          name : '',
          header: ''
        }
         temp2.isEditing = !chats[i].isEditing
        temp2.name = chats[i].name
        temp2.header = chats[i].header
        // if ( chats[i].isEditing ){
          // temp2.header = editChatHeading 
          //save the value
        // }
        // else {
          // do nothing 
        // }
        temp[i] = temp2
      }
      else {
        let tempName = chats[i].name
        let tempHeader = chats[i].header
        let temp3 = {
          isEditing : false,
          name: tempName,
          header : tempHeader
        }
        temp[i] = temp3
      }
    }
    setChats([...temp])
   }

   const editHeadingFinal =  (index) => {
    let temp = []
    for ( let i = 0; i < chats.length ; i++ ) {
      if ( i == index ) {
        let temp2 = {
          isEditing : true,
          name : '',
          header: ''
        }
        temp2.isEditing = !chats[i].isEditing
        temp2.name = chats[i].name
        temp2.header = chats[i].header
        if ( chats[i].isEditing ){
          temp2.header = editChatHeading; 
          // save the value
        }
        else {
          // do nothing 
        }
        temp[i] = temp2
      }
      else {
        let tempName = chats[i].name
        let tempHeader = chats[i].header
        let temp3 = {
          isEditing : false,
          name: tempName,
          header : tempHeader
        }
        temp[i] = temp3
      }
    }
    setChats([...temp])
    setShowEditInsideIcons(false)
   }

   const discardEditing = () => {
    let temp = []
    for ( let i = 0 ; i < chats.length; i++ ) {
      let temp2 = {
        isEditing: false,
        name: '',
        header: ''
      }
      temp2.name = chats[i].name
      temp2.header = chats[i].header
      temp[i] = temp2;
    }
    setChats([...temp])
    setShowEditInsideIcons(false)
   }

  return (
    <div className="topDiv">
        <Modal show={showModalFlag} handleClose={hideModal}>Modal</Modal>
      <div className="menuButton" onClick={() => {setIsHamburger(!isHamburger);setIsHamburgerAnimate(!isHamburgerAnimate)}}>
        <img src={menu} className="iconImg" />
      </div>
      <div className={ isHamburger ? 'hamburger' : 'hamburger hamburger2'} >
        <div className="newChatButton" onClick={startNewChat} >New Chat +</div>
        {chats?.map((value,index) => {
          console.log(value)
          let keyRr = "chat" + value.name.toString();
          let returnString = localStorage.getItem(keyRr);
          let returnArray = JSON.parse(returnString);
          let quesText = '';
          if (!returnArray ){
            return null;
          }
          if ( returnArray ){
            quesText = returnArray[0]?.text
          }
          quesText = quesText?.slice(0,5)
          return (
            <div className="chatsListItem">
              { !value.isEditing ? <div className="chatText" onClick={ () => {fetchOldChat(value.name)}}>
                {value.header.length > 0  ? value.header : quesText + '....' }
              </div> : <input type="text" className="editHead" value={editChatHeading} onChange={handleChange2}/> }
              
              {showEditInsideIcons && value.isEditing ?
                <>
                  <div className="editButton" onClick={() => {editHeadingFinal(index)}}>Ed</div>
                  <div className="deleteButton" onClick={ () => {discardEditing()} }>Di</div>
                </> :
                <>
                <div className="editButton" onClick={() => {editHeading(index)}}>E</div>
                <div className="deleteButton" onClick={ () => {showModal(value.name,keyRr)} }>D</div>
                </>
              }
            </div>
          )
        })}
      </div>
      <div className= {"chatBox " +  (isHamburgerAnimate ? 'chatBox2' : null) }>
        <div className="parentDiv">
          <div className="box">
            <ToastContainer />
            <div className='chat-container'>
              {chatMessages?.map((value) => {
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
           
            
        </div>
      </div>
        { chatMessages?.length == 0 ?
          <div className="commonfaqs">
            <div className="faqs1">
              <div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[0].question)}}>{defaultQuestions[0].question}</div>
              <div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[1].question)}}>{defaultQuestions[1].question}</div>
            </div>
            <div className="faqs2">
              <div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[2].question)}}>{defaultQuestions[2].question}</div>
              <div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[3].question)}}>{defaultQuestions[3].question}</div>
            </div>
          </div> : null }
        <div className="flexRowContainer">
          <div className="flexRow">
            <div className="inputContainer">
              <input type='text' ref={refr} placeholder='Ask me anything about Jainism' onKeyDown={enterKeySend} onChange={handleChange} value={message}/>
            </div>
            <div className="icon" onClick={addUserQuestionToChat}> <img src={send} /> </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
