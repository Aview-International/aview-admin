import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  __v: 0,
  _id: undefined,
  averageVideoDuration: '',
  completedVideos: [],
  country: '',
  createdAt: '',
  email: '',
  emailVerified: false,
  firstName: '',
  jobsCompletedArray: [],
  moderationJobsCompleted: 0,
  name: '',
  nativeLanguage: [],
  overlayJobsCompleted: 0,
  paymentDetails: '',
  paymentMethod: '',
  paymentOwed: 0,
  pendingJobsCompleted: 0,
  profilePicture: null,
  totalJobsCompleted: 0,
  totalPayment: 0,
  uid: '',
  updatedAt: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const { payload } = action;
      return { ...state, ...payload };
    },
    updateProfilePicture(state, action) {
      state.profilePicture = action.payload;
    },
    updateUserDetails(state, action) {
      const { field, value } = action.payload;
      state[field] = value;
    },
    logOutUser() {
      return { ...initialState, isLoggedIn: false };
    },
  },
});

export const { setUser, logOutUser, updateProfilePicture, updateUserDetails } =
  userSlice.actions;

export default userSlice.reducer;
