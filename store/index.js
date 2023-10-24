import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import sendersReducer from './reducers/senders.reducer';
import messagesReducer from './reducers/messages.reducer';

const store = configureStore({
  reducer: {
    messageSenders: sendersReducer,
    userMessages: messagesReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({});
    if (process.env.NODE_ENV === 'development') middleware.push(logger);
    return middleware;
  },
});

export default store;
