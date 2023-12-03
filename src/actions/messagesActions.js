export const addMessage = (messageObject) => ({
  type: 'ADD_MESSAGE',
  payload: messageObject,
}); 

export const setMessages = (messagesObject) => ({
  type: 'SET_MESSAGES',
  payload: messagesObject,
}); 