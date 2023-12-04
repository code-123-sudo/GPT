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

const getAsyncStream = async (response) => {
  let textRecieved = ""
  const decoder = new TextDecoder();
  setIsStreaming(true);
  for await (const chunk of streamAsyncIterator(response.body)) {
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
            // console.log(err)
      }
    })
  }
      return textRecieved
}

export { getAsyncStream };