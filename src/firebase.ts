import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, serverTimestamp } from 'firebase/firestore';

// This will be replaced by the actual config from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "PLACEHOLDER",
  authDomain: "PLACEHOLDER",
  projectId: "PLACEHOLDER",
  storageBucket: "PLACEHOLDER",
  messagingSenderId: "PLACEHOLDER",
  appId: "PLACEHOLDER"
};

// We'll try to import the real config if it exists
let app;
let db: any;
let auth: any;
let googleProvider: any;

try {
  // @ts-ignore
  import('./firebase-applet-config.json').then(config => {
    app = initializeApp(config.default);
    db = getFirestore(app, config.default.firestoreDatabaseId);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  }).catch(() => {
    console.warn("Configuración de Firebase no encontrada. Usando estado local.");
  });
} catch (e) {
  console.warn("Error al inicializar Firebase.");
}

export { db, auth, googleProvider, collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, serverTimestamp, signInWithPopup, signOut };
