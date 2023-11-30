// reducers/counterReducer.js
const initialState = {
  countValue: 0,
};

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { countValue: state.countValue + 1 };
    case 'DECREMENT':
      return { countValue: state.countValue - 1 };
    default:
      return state;
  }
};

export default counterReducer;
