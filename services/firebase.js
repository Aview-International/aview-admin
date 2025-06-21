import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { getDatabase, ref, get, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize the applications
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Initialize the auth service
export const auth = getAuth();

// get user from google account
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const response = await signInWithPopup(auth, provider);
  return response;
};

export const getUserProfile = async (uid) => {
  const res = await get(ref(database, `users/${uid}`)).then((snapshot) => {
    if (snapshot.exists()) return snapshot.val();
    else return null;
  });
  return res;
};

export const subscribeToDB = (timestamp, subscriptionCallback) => {
  const pathRef = ref(database, `admin-jobs/audio-separation/${timestamp}`);
  const unsubscribe = onValue(pathRef, (snapshot) => {
    const data = snapshot.val();
    subscriptionCallback(data);
  });
  return unsubscribe; // Return the unsubscribe function
};

export const subscribeToHistory = (subscriptionCallback) => {
  const pathRef = ref(database, `user-jobs/pending/admin`);
  const unsubscribe = onValue(pathRef, (snapshot) => {
    const data = snapshot.val();
    subscriptionCallback(data);
  });
  return unsubscribe; // Return the unsubscribe function
};

export const subscribeToPodcast = (subscriptionCallback) => {
  const pathRef = ref(database, `user-jobs/pending/pablo-srugo`);
  const unsubscribe = onValue(pathRef, (snapshot) => {
    const data = snapshot.val();
    subscriptionCallback(data);
  });
  return unsubscribe; // Return the unsubscribe function
};

export const subscribeToAllJobs = (subscriptionCallback) => {
  const pathRef = ref(database, `user-jobs/pending`);
  const unsubscribe = onValue(pathRef, (snapshot) => {
    const data = snapshot.val();
    subscriptionCallback(data);
  });
  return unsubscribe; // Return the unsubscribe function
};

export const getSingleVideoData = async (id) => {
  const res = await get(
    ref(database, `admin-jobs/pending/video-edit/${id}`)
  ).then((snapshot) => {
    if (snapshot.exists()) return snapshot.val();
    else return null;
  });
  return res;
};
