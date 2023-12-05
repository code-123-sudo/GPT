const initialState = {
  message: '',
  pageNo: JSON.parse(localStorage.getItem('pageNo')) || 0,
  isStreaming: '',
  streamData: '',
  isTypingLeft: false,
  isTypingRight: false,
  isHamburger: JSON.parse(localStorage.getItem('isHamburger')) || false,
  isHamburgerAnimate: JSON.parse(localStorage.getItem('isHamburgerAnimate')) || false
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return { ...state , message: action.payload };
    case 'SET_PAGE_NO':
      return { ...state , message: action.payload };
    case 'SET_IS_STREAMING':
      return { ...state , message: action.payload };
    case 'SET_STREAM_DATA':
      return { ...state , message: action.payload };
    case 'SET_IS_TYPING_LEFT':
      return { ...state , message: action.payload };
    case 'SET_IS_TYPING_RIGHT':
      return { ...state , message: action.payload };
    case 'SET_IS_HAMBURGER':
      return { ...state , message: action.payload };
    case 'SET_IS_HAMBURGER_ANIMATE':
      return { ...state , message: action.payload };
    default:
      return state;
  }
};

export default commonReducer;