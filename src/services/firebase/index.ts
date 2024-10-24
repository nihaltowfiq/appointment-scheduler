// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA2H1mdUv_TYSA6iTkMDwppVEj-v-oU-Tk',
  authDomain: 'appointment-scheduler-39fc2.firebaseapp.com',
  projectId: 'appointment-scheduler-39fc2',
  storageBucket: 'appointment-scheduler-39fc2.appspot.com',
  messagingSenderId: '101083616821',
  appId: '1:101083616821:web:b8e274fad414a9f01ac37c',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
