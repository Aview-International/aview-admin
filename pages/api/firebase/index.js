import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import {
  getDatabase,
  set,
  ref,
  child,
  get,
  onValue,
  update,
} from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

const admin_firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const user_firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_USER_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_USER_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_USER_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_USER_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_USER_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_USER_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_USER_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_USER_FIREBASE_DATABASE_URL,
};

// Initialize the applications
const admin_app = initializeApp(admin_firebaseConfig);
const user_app = initializeApp(user_firebaseConfig, 'users');

// Initialize Realtime Database and get a reference to the service
const admin_database = getDatabase(admin_app);
const user_database = getDatabase(user_app);

// Initialize the auth service
const auth = getAuth();

export const getAllAdmins = async () => {
  // const queryConstraints = [orderByKey('email')];
  // const res = await get(query(ref(admin_database, 'admins/'), ...queryConstraints));
  const res = await get(ref(admin_database, `admins/`)).then((snapshot) => {
    if (snapshot.exists()) return snapshot.val();
    else return null;
  });
  return res;
};

export const getAllCreators = async () => {
  // const queryConstraints = [orderByKey('email')];
  // const res = await get(query(ref(admin_database, 'admins/'), ...queryConstraints));
  const res = await get(ref(user_database, `users/`)).then((snapshot) => {
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

// create new user account in the admin_database after signup
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
  await set(ref(admin_database, `super-admins/${id}`), data);
};

// create new user account in the admin_database after signup
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
  get(child(ref(admin_database), `admins/${id}`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      let newid = uuidv4();
      await set(ref(admin_database, `admins/${newid}`), data);
    } else {
      await set(ref(admin_database, `admins/${id}`), data);
    }
  });
};

// get all user data from the admin_database
export const getAdminProfile = async (_id) => {
  const res = await get(ref(admin_database, `super-admins/${_id}`)).then(
    (snapshot) => {
      if (snapshot.exists()) return snapshot.val();
      else return null;
    }
  );
  return res;
};

// get all user data from the database
export const getUserProfile = async (_id) => {
  const res = await get(ref(database, `users/${_id}`)).then((snapshot) => {
    if (snapshot.exists()) return snapshot.val();
    else return null;
  });
  return res;
};

// save video to the admin_database
export const saveVideo = async (channelId, data) => {
  await set(ref(admin_database, `youtube-videos/${channelId}`), data);
};

// save user message to db
export const sendMessage = async (uid, message) => {
  const data = {
    message: message,
    timeStamp: Date.now(),
  };

  // get message key
  const dataKey = push(child(ref(user_database), 'chats')).key;
  const updates = {};
  updates['/chats/' + uid + '/' + dataKey] = data;
  return update(ref(user_database), updates);
};

// fetch user messages
export const fetchMessages = async (uid, callback) => {
  const messages = ref(user_database, 'chats/' + uid);
  onValue(messages, (snapshot) => {
    let chats = [];
    snapshot.forEach((el) => {
      chats.push(el.val());
    });
    callback(chats);
  });
};

export const getSenders = async () => {
  const res = await get(ref(user_database, `chats/`)).then((snapshot) => {
    let chats = [];
    snapshot.forEach((el) => {
      get(ref(user_database, `users/${el.key}`)).then((snaps) => {
        if (snaps.exists()) chats.push(snaps.val());
      });
    });
    return chats;
  });
  return res;
};

export const updateAccountCharge = async (uid, newCharge) => {
  // const res = await get(ref(user_database, `users/${uid}/charge`)).then((snapshot) => {
  //   const updates = {};
  //   updates['/chats/' + uid + '/' + dataKey] = data;
  //   return update(ref(user_database), updates);
  //   if (snapshot.exists()) return snapshot.val();
  //   else return null;
  // });
  // return res;

  const updates = {};
  updates[`users/${uid}/charge`] = newCharge;
  updates[`users/${uid}/defaultCurrency`] = 'USD';
  return update(ref(user_database), updates);
};
