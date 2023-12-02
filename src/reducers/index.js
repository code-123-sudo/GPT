import { combineReducers } from 'redux';
import counterReducer from './counterReducer.js';
import chattingsReducer from './chattingsReducer.js';
import messagesReducer from './messagesReducer.js';
import liveChatReducer from './liveChatReducer.js';

const rootReducer = combineReducers({
  counter: counterReducer,
  chattings: chattingsReducer,
  messages: messagesReducer,
  liveChat: liveChatReducer
  // Add more reducers here if needed
});

export default rootReducer;