const initialState = {
  chattings: JSON.parse(localStorage.getItem('chats')) || [],
};

const chattingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CHAT':
      return {
        chattings: [ ...state.chattings, action.payload ],
      };
    case 'SET_CHATTINGS':
      return {
        chattings: [ ...action.payload ],
      };
    default:
      return state;
  }
};

export default chattingsReducer;