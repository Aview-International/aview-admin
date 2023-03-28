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

const devFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_DEVELOPMENT_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_DEVELOPMENT_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_DEVELOPMENT_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_DEVELOPMENT_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_DEVELOPMENT_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_DEVELOPMENT_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_DEVELOPMENT_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_DEVELOPMENT_FIREBASE_DATABASE_URL,
};

const prodFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_PRODUCTION_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_PRODUCTION_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PRODUCTION_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_PRODUCTION_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_PRODUCTION_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_PRODUCTION_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_PRODUCTION_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_PRODUCTION_FIREBASE_DATABASE_URL,
};

// Initialize the applications
// const admin_app = initializeApp(admin_firebaseConfig);
const app = initializeApp(
  process.env.NODE_ENV === 'development'
    ? devFirebaseConfig
    : prodFirebaseConfig
);

// Initialize Realtime Database and get a reference to the service
// const admin_database = getDatabase(admin_app);
const database = getDatabase(app);

// Initialize the auth service
const auth = getAuth();

export const getAllAdmins = async () => {
  const res = await get(ref(database, `admins/`)).then((snapshot) => {
    if (snapshot.exists()) return snapshot.val();
    else return null;
  });
  return res;
};

export const getAllCreators = async () => {
  const res = await get(ref(database, `users/`)).then((snapshot) => {
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

// create new admin account in the database after signup
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
export const getAdminProfile = async (_id) => {
  const res = await get(ref(database, `super-admins/${_id}`)).then(
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

// save video to the database
export const saveVideo = async (channelId, data) => {
  await set(ref(database, `youtube-videos/${channelId}`), data);
};

// save user message to db
export const sendMessage = async (uid, message) => {
  const data = {
    message: message,
    timeStamp: Date.now(),
  };

  // get message key
  const dataKey = push(child(ref(database), 'chats')).key;
  const updates = {};
  updates['/chats/' + uid + '/' + dataKey] = data;
  return update(ref(database), updates);
};

// fetch user messages
export const fetchMessages = async (uid, callback) => {
  const messages = ref(database, 'chats/' + uid);
  onValue(messages, (snapshot) => {
    let chats = [];
    snapshot.forEach((el) => {
      chats.push(el.val());
    });
    callback(chats);
  });
};

export const getSenders = async () => {
  const res = await get(ref(database, `chats/`)).then((snapshot) => {
    let chats = [];
    snapshot.forEach((el) => {
      get(ref(database, `users/${el.key}`)).then((snaps) => {
        if (snaps.exists()) chats.push(snaps.val());
      });
    });
    return chats;
  });
  return res;
};

export const updateAccountCharge = async (uid, newCharge) => {
  const updates = {};
  updates[`users/${uid}/charge`] = newCharge;
  updates[`users/${uid}/defaultCurrency`] = 'USD';
  return update(ref(database), updates);
};

export const getAllPendingJobs = async () => {
  const res = await get(ref(database, `admin-jobs/pending`)).then(
    (snapshot) => {
      if (snapshot.exists()) return snapshot.val();
      else return null;
    }
  );
  return res;
};

export const getAllCompletedJobs = async () => {
  const res = await get(ref(database, `admin-jobs/completed`)).then(
    (snapshot) => {
      if (snapshot.exists()) return snapshot.val();
      else return null;
    }
  );
  return res;
};

export const markVideoAsCompleted = async (creatorId, jobId, jobDetails) => {
  await get(child(ref(database), `users/${creatorId}`)).then(
    async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const newPostData = {
          ...data,
          completedVideos: 1,
          pendingVideos: +data.pendingVideos - 1,
        };
        const existingPostData = {
          ...data,
          pendingVideos: +data.pendingVideos - 1,
          completedVideos: +data.completedVideos + 1,
        };
        const updates = {
          [`users/${creatorId}`]: data.completedVideos
            ? existingPostData
            : newPostData,
          [`user-jobs/${creatorId}/${jobId}`]: jobDetails,
          [`admin-jobs/pending/${jobId}`]: null,
          [`admin-jobs/completed/${jobId}`]: jobDetails,
        };
        await update(ref(database), updates);
      }
    }
  );
};
