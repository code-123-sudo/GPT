const initialState = {
  liveChat: JSON.parse(localStorage.getItem('currentChat')) || 'chat0',
};

const liveChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LIVECHAT':
      return { ...state,liveChat:action.payload };
    default:
      return state;
  }
};

export default liveChatReducer;