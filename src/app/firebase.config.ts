
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC9_hvZKLk7sKEpHqMCRCA_obTm21hwDtI",
  authDomain: "pet-amigo-e0284.firebaseapp.com",
  projectId: "pet-amigo-e0284",
  storageBucket: "pet-amigo-e0284.firebasestorage.app",
  messagingSenderId: "241606114584",
  appId: "1:241606114584:web:ac07b1935ae042a4f9f26d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
