import { createSlice } from '@reduxjs/toolkit';
import { SUPPORTED_REGIONS } from '../../constants/constants';

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
