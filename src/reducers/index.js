// reducers/index.js
import { combineReducers } from 'redux';
import counterReducer from './counterReducer'; // You'll create this file in the next step

const rootReducer = combineReducers({
  counter: counterReducer,
  // Add more reducers here if needed
});

export default rootReducer;
