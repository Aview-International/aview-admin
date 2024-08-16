import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pendingJobs: [],
  completedJobs: [],
};

const jobsSlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setPendingJobs(state, action) {
      state.pendingJobs = action.payload;
    },

    setCompletedJobs(state, action) {
      state.completedJobs = action.payload;
    },
  },
});

export const { setPendingJobs, setCompletedJobs } = jobsSlice.actions;

export default jobsSlice.reducer;
