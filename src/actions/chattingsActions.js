export const addChat = (chatObject) => ({
  type: 'ADD_CHAT',
  payload: chatObject,
}); 

export const setChattings = (chattingsObject) => ({
  type: 'SET_CHATTINGS',
  payload: chattingsObject,
}); 