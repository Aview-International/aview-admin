import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allLanguages: [],
  allPlans: [],
};

const aviewSlice = createSlice({
  name: 'aview',
  initialState,
  reducers: {
    setAllLanguages: (state, action) => {
      state.allLanguages = action.payload;
    },
  },
});

export const { setAllLanguages } = aviewSlice.actions;

export default aviewSlice.reducer;
