import { combineReducers } from 'redux';

import chattingsReducer from './chattingsReducer.js';
import messagesReducer from './messagesReducer.js';
import liveChatReducer from './liveChatReducer.js';
import commonReducer from './commonReducer.js';

const rootReducer = combineReducers({
  chattings: chattingsReducer,
  messages: messagesReducer,
  liveChat: liveChatReducer,
  common: commonReducer
  // Add more reducers here if needed
});

export default rootReducer;