import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Web app's Firebase configuration loaded from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check if Firebase environment variables are provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "your-project-id"
);

if (!isFirebaseConfigured) {
  console.warn(
    "[Firebase Config Notice]: Firebase environment variables are missing or using placeholder values in .env.\n" +
    "Please create a .env file with your VITE_FIREBASE_* credentials (see .env.example) to enable full cloud persistence."
  );
}

// Initialize Firebase App singleton safely
const app = getApps().length > 0 ? getApp() : initializeApp(
  isFirebaseConfigured ? firebaseConfig : {
    apiKey: "AIzaSyFakeKeyForInitialLoadToPreventCrash123",
    authDomain: "ems-burgers.firebaseapp.com",
    projectId: "ems-burgers",
    storageBucket: "ems-burgers.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:1234567890abcdef"
  }
);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Cloud Storage
export const storage = getStorage(app);

export default app;
