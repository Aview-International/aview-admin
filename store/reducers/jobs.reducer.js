import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  isLoading: false,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setAllJobs: (state, action) => {
      state.jobs = action.payload;
    },
    
    setJobsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setAllJobs, setJobsLoading } = jobsSlice.actions;

export default jobsSlice.reducer;
