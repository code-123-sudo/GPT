// reducers/countReducer.js
const initialState = {
  counter: 0,
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