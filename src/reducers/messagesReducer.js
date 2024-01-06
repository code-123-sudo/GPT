const initialState = {
  messages: []
};

const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        messages: [ ...state.messages, action.payload ],
      };
    case 'SET_MESSAGES':
      return {
        messages: [ ...action.payload ],
      };
    default:
      return state;
  }
};

export default messagesReducer;