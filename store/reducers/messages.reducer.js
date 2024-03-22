import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    name: '',
    picture: '',
    id: '',
  },
  messages: [],
  reviewersMessages: [],
};

const messagesSlice = createSlice({
  initialState,
  name: 'messages',
  reducers: {
    setUserMessages(state, action) {
      const { payload } = action;
      state.messages = payload;
    },

    setSenderProfile(state, action) {
      const { payload } = action;
      state.user = payload;
    },

    setIncomingMessages(state, action) {
      const { payload } = action;
      console.log(payload);
      // const user = state.find((data) => data.userId === payload.userId);

      // if (user) {
      //   user[messages].push(payload);
      // } else {
      //   state.push({
      //     userId: payload.userId,
      //     messages: [
      //       { message: payload.message, timeStamp: payload.timeStamp },
      //     ],
      //   });
      // }
    },

    setReviewerMessages(state, action) {
      const { payload } = action;
      state.reviewersMessages = payload;
    },
  },
});

const messagesReducer = messagesSlice.reducer;

export const {
  setUserMessages,
  setIncomingMessages,
  setSenderProfile,
  setReviewerMessages,
} = messagesSlice.actions;

export default messagesReducer;
