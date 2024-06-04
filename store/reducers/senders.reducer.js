import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const creatorEnquiriesSlice = createSlice({
  initialState,
  name: 'creator-enquiries',
  reducers: {
    setCreatorEnquiries(state, action) {
      const { payload } = action;
      return payload;
    },
  },
});

export const { setCreatorEnquiries } = creatorEnquiriesSlice.actions;
export default creatorEnquiriesSlice.reducer;
