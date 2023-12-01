import { combineReducers } from 'redux';
import counterReducer from './counterReducer.js';
import chattingsReducer from './chattingsReducer.js';

const rootReducer = combineReducers({
  counter: counterReducer,
  chattings: chattingsReducer,
  // Add more reducers here if needed
});

export default rootReducer;