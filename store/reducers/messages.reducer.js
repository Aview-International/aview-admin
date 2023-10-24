import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    name: '',
    picture: '',
    id: '',
  },
  messages: [],
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
  },
});

const messagesReducer = messagesSlice.reducer;

export const { setUserMessages, setIncomingMessages, setSenderProfile } =
  messagesSlice.actions;

export default messagesReducer;
