import React, { useState , useEffect , useRef } from 'react';
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ToastContainer, toast } from 'react-toastify';
import { data, defaultQuestions } from './data.js'
import 'react-toastify/dist/ReactToastify.css';

import { API_KEY, API_URL } from "./constants.js"

import send from './assets/send.png'
import menu from './assets/menu.png';


function App() {
  const [message, setMessage] = useState('');

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
  
  const saveInLocalStorage = (key,value) => {
    localStorage.setItem(key,value);
  }

  const handleChange = (event) => {
    setMessage(event.target.value)
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
    if ( chatMessages.length == 1 ) {
      let stringsConverted = JSON.stringify(chatMessages);
      console.log(stringsConverted)
      let key = "chat" + count.toString();
      console.log(key)
      localStorage.setItem(key,stringsConverted);
      setChats([count,...chats])
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
    const index = tempChats.indexOf(pageNo);
    if (index > -1 ) { 
      tempChats.splice(index, 1);
      tempChats = [pageNo,...tempChats]
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

  const startNewChat = () => {

    if ( chatMessages.length == 0 ) return;
    
    let isOld = false;
    const keyss = Object.keys(localStorage);
    keyss.forEach((keys) => {
      if ( keys == currentChat) {
          isOld = true;
          let stringConverted = JSON.stringify(chatMessages);
          localStorage.setItem(keys,stringConverted);
          setChatMessages([]);
          let tempCount = count+1;
          setCount(tempCount)
          let tempCounts = "chat"+tempCount.toString();
          setCurrentChat(tempCounts)

          return;
      }
    });
    if (!isOld){
      let stringsConverted = JSON.stringify(chatMessages);
      console.log(stringsConverted)
      let key = "chat" + count.toString();
      console.log(key)
      localStorage.setItem(key,stringsConverted);
      setChats([count,...chats])
      setChatMessages([]);
      let tempCount = count+1;
      setCount(tempCount);
      tempCount = tempCount.toString();
      let tempChat = "chat"+tempCount;
      setCurrentChat(tempChat)
    }
  }

  const fetchOldChat = (countNo) => {

    if(chatMessages.length != 0) {
      let stringsConverted2 = JSON.stringify(chatMessages);
      localStorage.setItem(currentChat,stringsConverted2);
      /* checking wether its a new chat or old chat */

      let oldChatFlag = false;

      for ( let i = 0; i < chats.length; i++ ) {
        if ( chats[i] == count ) oldChatFlag = true;
      }


      if ( !oldChatFlag ) setChats([count,...chats])
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

   const editHeading = () => {
    // setIsEditing
   }

  return (
    <div className="topDiv">
      <div className="menuButton" onClick={() => {setIsHamburger(!isHamburger);setIsHamburgerAnimate(!isHamburgerAnimate)}}>
        <img src={menu} className="iconImg" />
      </div>
      <div className={ isHamburger ? 'hamburger' : 'hamburger hamburger2'} >
        <div className="newChatButton" onClick={startNewChat} >New Chat +</div>
        {chats?.map((value) => {
          let keyRr = "chat" + value.toString();
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
            <div className="chatsListItem" onClick={ () => {fetchOldChat(value)}}>
              <div className="chatText">
                {quesText?.length >0 ? quesText + '....' : ''}
              </div>
              <div className="editButton" onClick={() => {editHeading}}>E</div>
              <div className="deleteButton">D</div>
            </div>
          )
        })}
      </div>
      <div className= {"chatBox " +  (isHamburgerAnimate ? 'chatBox2' : null) }>
        <div className="parentDiv">
          <div className="box">
            <ToastContainer />
            <div className='chat-container'>
              {chatMessages.map((value) => {
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
        { chatMessages.length == 0 ?
          <div className="commonfaqs">
            <div className="faqs1">
              <div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[0].question)}}>Who is Nelson Mandela</div>
              <div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[1].question)}}>Who is Rahul Dravid</div>
            </div>
            <div className="faqs2">
              <div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[2].question)}}>Who is Barack Obama</div>
              <div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[3].question)}}>Who is Undertaker</div>
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
