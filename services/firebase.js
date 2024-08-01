import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import {
  getDatabase,
  set,
  ref,
  child,
  get,
  update,
  onValue,
} from 'firebase/database';

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
// const admin_app = initializeApp(admin_firebaseConfig);
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
// const admin_database = getDatabase(admin_app);
const database = getDatabase(app);

// Initialize the auth service
export const auth = getAuth();

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

// get all user data from the database
export const getAdminProfile = async (uid) => {
  const res = await get(ref(database, `super-admins/${uid}`)).then(
    (snapshot) => {
      if (snapshot.exists()) return snapshot.val();
      else return null;
    }
  );
  return res;
};

// update user preferences
export const updateRequiredServices = async (payload, uid) => {
  get(child(ref(database), `users/${uid}`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const postData = {
        ...data,
        ...payload,
      };
      const updates = {
        [`users/${uid}`]: postData,
      };
      await update(ref(database), updates);
      return;
    } else throw new Error('User does not exist');
  });
  return;
};

// get all user data from the database
export const getUserProfile = async (uid) => {
  const res = await get(ref(database, `users/${uid}`)).then((snapshot) => {
    if (snapshot.exists()) return snapshot.val();
    else return null;
  });
  return res;
};

export const getAllPendingJobs = async () => {
  const res = await get(ref(database, `admin-jobs/pending/transcription`)).then(
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
          [`user-jobs/completed/${creatorId}/${jobId}`]: jobDetails,
          [`admin-jobs/pending/${jobId}`]: null,
          [`user-jobs/pending/${creatorId}/${jobId}`]: null,
          [`admin-jobs/completed/${jobId}`]: jobDetails,
        };
        await update(ref(database), updates);
      }
    }
  );
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
