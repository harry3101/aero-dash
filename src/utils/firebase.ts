
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPnzJtvqxig4rSOtljAqPKCiA08aHqqQs",
  authDomain: "chatapp032-f4998.firebaseapp.com",
  projectId: "chatapp032-f4998",
  storageBucket: "chatapp032-f4998.firebasestorage.app",
  messagingSenderId: "144742410420",
  appId: "1:144742410420:web:c3b77b97bda73fa0c44fe1",
  measurementId: "G-75V6R271D7"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
