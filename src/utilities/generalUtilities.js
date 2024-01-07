import {updateChat, updateManyChats, getChats } from "../apis/chatAPI.js"

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
const getAsyncStream = async (response,setStreamData) => {
  let textRecieved = ""
  const decoder = new TextDecoder();
  for await (const chunk of streamAsyncIterator(response.body)) {
    const data = decoder.decode(chunk)
    const splitData = data.split("\n\n")
    for ( const jsonData of splitData ) {
      try {
        const parsedData = JSON.parse(jsonData.replace("data: ",""));
        const deltaContent = parsedData?.choices?.[0]?.delta?.content
        if ( deltaContent ){
          textRecieved += deltaContent
          setStreamData(textRecieved)
        }
      } catch(err) {
        console.error("Error parsing JSON data",err)
      }
    }
  }
  return textRecieved
}
const saveInLocalStorage = (key,value) => {
    localStorage.setItem(key,value);
}

const searchInCache = (message,data) => {
  let flag = false;
  const foundItem = data.find( (quesAns) => quesAns.question === message )
  if ( foundItem ) return {text:foundItem.answer,isReply:true};
  return false
}

const fetchFromAPI = async (API_URL,API_KEY,message) => {
  try {
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
      })
    })
    return response;
  } catch ( error ) {
    console.error("Error fetching from API:",error.message)
    throw error // Propagate the error for higher level handling
  }
}

const sortLatestChatUp = (currentChattings,pageNo) => {
  let index = currentChattings.findIndex((chatValue) => chatValue.name === pageNo )
  if (index > -1 ) { 
    const { isEditing, header, msgs } = currentChattings[index]
    const updatedChattings = [
      { name: pageNo, isEditing, header, msgs },
      ...currentChattings.slice(0, index),
      ...currentChattings.slice(index + 1)
    ];
    return updatedChattings
  }
  return false;
}
const editHeading = async (index,setEditChatHeading,setShowEditInsideIcons,chattings,setChattings,loadChats
  ) => {
  setEditChatHeading("")
  setShowEditInsideIcons(true)

  let reqBody = {
          "updateQueryValue1" : false,
          "updateQueryKey1" : "isEditing",
          // "updateQueryValue2" : timeStamp,
          // "updateQueryKey2" : "updatedAt"
  }
  let res = await updateManyChats(reqBody);
  res = await loadChats()

  let nameValue = chattings[index].name
  reqBody = {
          "updateQueryValue1" : true,
          "updateQueryKey1" : "isEditing",
          "filterQueryValue" : nameValue,
          "filterQueryKey" : "name"
          // "updateQueryValue2" : timeStamp,
          // "updateQueryKey2" : "updatedAt"
  }
  res = await updateChat(reqBody);
  res = await loadChats()



  // let nameValue = chattings[index].name;
  // let isEditingValue = !chattings[index].isEditing
  // let reqBody = {
  //         "filterQueryValue" : nameValue,
  //         "filterQueryKey" : "name",
  //         "updateQueryValue1" : isEditingValue,
  //         "updateQueryKey1" : "isEditing",
  //         // "updateQueryValue2" : timeStamp,
  //         // "updateQueryKey2" : "updatedAt"
  // }
  // let res = await updateChat(reqBody);
  // await loadChats();

  // const chatsAfterEdition = chattings.map((chat,i) => {
  //   if ( i == index ) {
  //     return {
  //       isEditing : !chat.isEditing,
  //       name : chat.name,
  //       header: chat.header,
  //       msgs: chat.msgs
  //     }
  //   }
  //   else {
  //     return  {
  //       isEditing : false,
  //       name: chat.name,
  //       header : chat.header,
  //       msgs: chat.msgs
  //     }
  //   }
  // })
  // console.log("chats after edition",chatsAfterEdition)
  // setChattings([...chatsAfterEdition])
}

const editHeadingFinal =  async (index,chattings,setChattings,setShowEditInsideIcons,editChatHeading,loadChats) => {
  let nameValue = chattings[index].name
  let isEdit = !chattings[index].isEditing
  let header = ""
  if ( chattings[index].isEditing){
    if(!editChatHeading) {
      header = " "
    }else {
      header = editChatHeading;
      let reqBody = {
          "updateQueryValue1" : isEdit,
          "updateQueryKey1" : "isEditing",
          "filterQueryValue" : nameValue,
          "filterQueryKey" : "name",
          "updateQueryValue2" : header,
          "updateQueryKey2" : "header"
      } 
      let res = await updateChat(reqBody);
      res = await loadChats()
    } 
  }
  else {
    // do nothing
  }

  let reqBody = {
          "updateQueryValue1" : false,
          "updateQueryKey1" : "isEditing",
          // "updateQueryValue2" : timeStamp,
          // "updateQueryKey2" : "updatedAt"
  }
  let res = await updateManyChats(reqBody);
  res = await loadChats()
 

  // const chatsAfterEditionFinal = chattings.map((chat,i) => {
  //   if ( i == index ) {
  //     let selectedChat = {
  //       isEditing : true,
  //       name : '',
  //       header: '',
  //       msgs: []
  //     }
  //     selectedChat.isEditing = !chat.isEditing
  //     selectedChat.name = chat.name
  //     selectedChat.header = chat.header
  //     selectedChat.msgs = chat.msgs
  //     if ( chat.isEditing ){
  //         if(!editChatHeading) {
  //           selectedChat.header = " "
  //         }else {
  //           selectedChat.header = editChatHeading;
  //         } 
  //     }
  //     else {
  //         // do nothing 
  //     }
  //       return selectedChat
  //   }
  //   else {
  //     return {
  //       isEditing : false,
  //       name : chat.name,
  //       header : chat.header,
  //       msgs: chat.msgs
  //     }
  //   }
  // })
  // setChattings([...chatsAfterEditionFinal])
  setShowEditInsideIcons(false)
}

const discardEditing = async (chattings,setChattings,setShowEditInsideIcons,loadChats) => {
  let reqBody = {
          "updateQueryValue1" : false,
          "updateQueryKey1" : "isEditing",
          // "updateQueryValue2" : timeStamp,
          // "updateQueryKey2" : "updatedAt"
  }
  let res = await updateManyChats(reqBody);
  res = await loadChats()
  setShowEditInsideIcons(false)
}

export { streamAsyncIterator, getAsyncStream, saveInLocalStorage, searchInCache, fetchFromAPI, sortLatestChatUp, editHeading, editHeadingFinal,discardEditing };