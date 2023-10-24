import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const senderSlice = createSlice({
  initialState,
  name: 'message-senders',
  reducers: {
    setMessageSenders(state, action) {
      const { payload } = action;
      return payload;
    },
  },
});

export const { setMessageSenders } = senderSlice.actions;
export default senderSlice.reducer;
