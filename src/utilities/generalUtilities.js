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

const searchInCache = (message) => {
  let ans = {}
  let flag = false;
  data.forEach( (quesAns) => {
      if ( quesAns.question == message ) {
        foundInCache = true;
        ans = {text:quesAns.answer,isReply:true};
        flag = true;
      }
  })
  if (flag) return ans;
  return false
}

const fetchFromAPI = async (API_URL,API_KEY,message) => {
  let finalMessage = "chatgpt " + message + " Reply in a maximum of 20 words. Always reply in Hindi with English characters";
  let response = await fetch(API_URL, {
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
}

const sortLatestChatUp = (currentChattings,pageNo) => {
  let index = currentChattings.findIndex((chatValue) => {
    if (chatValue.name == pageNo ) {
      return true;
    }else {
      return false;
    }
  })
  if (index > -1 ) { 
    let editField = currentChattings[index].isEditing
    let headerField = currentChattings[index].header
    currentChattings.splice(index, 1);
    currentChattings = [{'name':pageNo,'isEditing':editField,header:headerField},...currentChattings]
    return currentChattings
  }
  return false;
}


export { streamAsyncIterator, saveInLocalStorage, searchInCache, fetchFromAPI, sortLatestChatUp };