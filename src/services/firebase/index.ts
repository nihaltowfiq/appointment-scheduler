// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: 'appointment-scheduler-1-3671c.appspot.com',
  messagingSenderId: '203665186294',
  appId: '1:203665186294:web:5d5a66a31aa82f9c25fbd7',
};

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyADoB33dDzStiwb9l6vyY52RrI_eXaamDU',
//   authDomain: 'appointment-scheduler-1-3671c.firebaseapp.com',
//   projectId: 'appointment-scheduler-1-3671c',
//   storageBucket: 'appointment-scheduler-1-3671c.appspot.com',
//   messagingSenderId: '203665186294',
//   appId: '1:203665186294:web:5d5a66a31aa82f9c25fbd7',
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Set persistence to 'local' so the user stays signed in even if they close the browser
export async function setAuthPersistence() {
  await setPersistence(auth, browserLocalPersistence);
}

export { auth, db, storage };
