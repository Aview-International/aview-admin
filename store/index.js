import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import sendersReducer from './reducers/senders.reducer';
import messagesReducer from './reducers/messages.reducer';
import userReducer from './reducers/user.reducer';
import aviewReducer from './reducers/aview.reducer';
import historyReducer from './reducers/history.reducer';

const store = configureStore({
  reducer: {
    messageSenders: sendersReducer,
    userMessages: messagesReducer,
    user: userReducer,
    aview: aviewReducer,
    history: historyReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({});
    if (process.env.NODE_ENV === 'development') middleware.push(logger);
    return middleware;
  },
});

export default store;
