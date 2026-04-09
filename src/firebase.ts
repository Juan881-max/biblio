import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCX5F2DZedpDIA6iPhjKziWYpdbLpk3Rjo",
  authDomain: "biblio-2040a.firebaseapp.com",
  projectId: "biblio-2040a",
  storageBucket: "biblio-2040a.firebasestorage.app",
  messagingSenderId: "1007262265983",
  appId: "1:1007262265983:web:007be94b947abe2f3a454a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);