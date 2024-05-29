import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  email: '',
  firstName: '',
  lastName: '',
  picture: '',
  uid: '',
  _id: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthState(state, action) {
      const { payload } = action;
      return { ...state, isLoggedIn: payload };
    },
  },
});

export const { setUser, setAuthState } = userSlice.actions;

export default userSlice.reducer;
