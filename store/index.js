import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import creatorEnquiriesReducer from './reducers/senders.reducer';
import messagesReducer from './reducers/messages.reducer';
import userReducer from './reducers/user.reducer';
import aviewReducer from './reducers/aview.reducer';
import historyReducer from './reducers/history.reducer';
import jobsReducer from './reducers/jobs.reducer';
import contentCreatorsReducer from './reducers/content-creator.reducer';

const store = configureStore({
  reducer: {
    creatorEnquiries: creatorEnquiriesReducer,
    userMessages: messagesReducer,
    user: userReducer,
    aview: aviewReducer,
    history: historyReducer,
    jobs: jobsReducer,
    contentCreators: contentCreatorsReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({});
    if (process.env.NODE_ENV === 'development') middleware.push(logger);
    return middleware;
  },
});

export default store;
