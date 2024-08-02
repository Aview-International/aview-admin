import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: {},
  messages: [],
  aiThreads: [],
  allAIThreads: [],
  lastUsedAIThread: '',
  reviewersMessages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages(state, action) {
      const { payload } = action;
      state.messages = payload;
    },

    setIncomingMessages(state, action) {
      const { payload } = action;
      state.messages.push(payload);
    },

    setMessageStatus(state, action) {
      const { payload } = action;
      state.status = payload;
    },

    setNewMessageDot(state, action) {
      const { payload } = action;
      if (state.status?.readByUser) {
        state.status.readByUser = payload;
      }
    },
    setLastUsedAIThread(state, action) {
      const { payload } = action;
      state.lastUsedAIThread = payload;
    },
    setAiThreads(state, action) {
      const { payload } = action;
      state.aiThreads = payload;
    },
    setLastUserAIMessage(state, action) {
      const { payload } = action;
      const obj = {
        assistant_id: null,
        content: [
          {
            text: { annotations: [], value: payload },
            type: 'text',
          },
        ],
        created_at: Date.now(),
        file_ids: [],
        id: '',
        metadata: {},
        object: '',
        role: 'user',
        run_id: null,
        thread_id: '',
      };
      state.aiThreads.push(obj);
    },
    setAllAIThreads(state, action) {
      const { payload } = action;
      state.allAIThreads = payload;
    },
    setReviewerMessages(state, action) {
      const { payload } = action;
      state.reviewersMessages = payload;
    },
  },
});

const messagesReducer = messagesSlice.reducer;
export const {
  setMessages,
  setIncomingMessages,
  setMessageStatus,
  setNewMessageDot,
  setLastUsedAIThread,
  setAiThreads,
  setAllAIThreads,
  setLastUserAIMessage,
  setReviewerMessages,
} = messagesSlice.actions;

export default messagesReducer;
