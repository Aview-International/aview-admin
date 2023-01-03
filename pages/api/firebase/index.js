import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { getDatabase, set, ref, child, get } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

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

// Initialize the application
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Initialize the auth service
const auth = getAuth();

export const getAllAdmins = async () => {
  // const queryConstraints = [orderByKey('email')];
  // const res = await get(query(ref(database, 'admins/'), ...queryConstraints));
  const res = await get(ref(database, `admins/`)).then((snapshot) => {
    if (snapshot.exists()) return snapshot.val();
    else return null;
  });
  return res;
};

// get user from google account
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const response = await signInWithPopup(auth, provider);
  return response;
};

// create new user account in the database after signup
export const createNewSuperAdmin = async (
  id,
  firstName,
  lastName,
  email,
  picture
) => {
  const data = {
    id,
    firstName,
    lastName,
    email,
    picture,
  };
  await set(ref(database, `super-admins/${id}`), data);
};

// create new user account in the database after signup
export const createNewAdmin = async (payload, picture) => {
  let chars =
    '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let passwordLength = 10;
  let password = '';
  let id = uuidv4();
  for (let i = 0; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  const data = {
    ...payload,
    picture,
    uid: uuidv4(),
    password,
    isBlocked: false,
  };
  get(child(ref(database), `admins/${id}`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      let newid = uuidv4();
      await set(ref(database, `admins/${newid}`), data);
    } else {
      await set(ref(database, `admins/${id}`), data);
    }
  });
};

// get all user data from the database
export const getUserProfile = async (_id) => {
  const res = await get(ref(database, `super-admins/${_id}`)).then(
    (snapshot) => {
      if (snapshot.exists()) return snapshot.val();
      else return null;
    }
  );
  return res;
};

// save video to the database
export const saveVideo = async (channelId, data) => {
  await set(ref(database, `youtube-videos/${channelId}`), data);
};
