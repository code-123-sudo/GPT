export const setMessage = (messageValue) => ({
  type: 'SET_MESSAGE',
  payload: messageValue,
}); 

export const setPageNo = (pageValue) => ({
  type: 'SET_PAGE_NO',
  payload: pageValue,
});

export const setIsStreaming = (isStreamingValue) => ({
  type: 'SET_IS_STREAMING',
  payload: isStreamingValue,
});

export const setStreamData= (streamDataValue) => ({
  type: 'SET_STREAM_DATA',
  payload: streamDataValue,
});

export const setIsTypingLeft = (isTypingLeftValue) => ({
  type: 'SET_IS_TYPING_LEFT',
  payload: isTypingLeftValue,
});

export const setIsTypingRight = (isTypingRightValue) => ({
  type: 'SET_IS_TYPING_RIGHT',
  payload: isTypingRightValue,
});

export const setIsHamburger = (isHamburgerValue) => ({
  type: 'SET_IS_HAMBURGER',
  payload: isHamburgerValue,
});

export const setIsHamburgerAnimate = (isHamburgerAnimateValue) => ({
  type: 'SET_IS_HAMBURGER_ANIMATE',
  payload: isHamburgerAnimateValue,
});

export const setIsNavigate = (isNavigateValue) => ({
  type: 'SET_IS_NAVIGATE',
  payload: isNavigateValue,
});