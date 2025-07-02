import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contentCreators: [],
};

const contentCreatorsSlice = createSlice({
  name: 'contentCreators',
  initialState,
  reducers: {
    setContentCreators(state, action) {
      state.contentCreators = action.payload;
    },

    addContentCreator(state, action) {
      state.contentCreators.push(action.payload);
    },
  },
});

export const { setContentCreators, addContentCreator } =
  contentCreatorsSlice.actions;

export default contentCreatorsSlice.reducer;
