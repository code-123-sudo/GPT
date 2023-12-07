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
    throw error // Propage the error for higher level handling
  }
}

const sortLatestChatUp = (currentChattings,pageNo) => {
  let index = currentChattings.findIndex((chatValue) => chatValue.name === pageNo )
  if (index > -1 ) { 
    const { isEditing, header } = currentChattings[index]
    const updatedChattings = [
      { name: pageNo, isEditing, header },
      ...currentChattings.slice(0, index),
      ...currentChattings.slice(index + 1)
    ];
    return updatedChattings
  }
  return false;
}


export { streamAsyncIterator, saveInLocalStorage, searchInCache, fetchFromAPI, sortLatestChatUp };