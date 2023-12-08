const initialState = {
  counter: JSON.parse(localStorage.getItem('counter')) || 0,
};

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_COUNTER':
      return { counter: action.payload };
    default:
      return state;
  }
};

export default counterReducer;