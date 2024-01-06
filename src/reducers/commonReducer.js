const initialState = {
  message: '',
  pageNo: 0,
  isStreaming: '',
  streamData: '',
  isTypingLeft: false,
  isTypingRight: false,
  isHamburger:false,
  isHamburgerAnimate:false,
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return { ...state , message: action.payload };
    case 'SET_PAGE_NO':
      return { ...state , pageNo: action.payload };
    case 'SET_IS_STREAMING':
      return { ...state , isStreaming: action.payload };
    case 'SET_STREAM_DATA':
      return { ...state , streamData: action.payload };
    case 'SET_IS_TYPING_LEFT':
      return { ...state , isTypingLeft: action.payload };
    case 'SET_IS_TYPING_RIGHT':
      return { ...state , isTypingRight: action.payload };
    case 'SET_IS_HAMBURGER':
      return { ...state , isHamburger: action.payload };
    case 'SET_IS_HAMBURGER_ANIMATE':
      return { ...state , isHamburgerAnimate: action.payload };
    default:
      return state;
  }
};

export default commonReducer;