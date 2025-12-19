import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Safely access environment variables
const getEnv = () => {
  try {
    return (import.meta as any).env || {};
  } catch (e) {
    return {};
  }
};

const env = getEnv();

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

// Check if config is valid. 
const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    console.log(`[Firebase] Connecting to project: ${firebaseConfig.projectId}...`);
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("[Firebase] Initialized successfully.");
  } catch (e) {
    console.warn("[Firebase] Initialization error (Checking configuration...):", e);
  }
} else {
  // Explicitly log this for the developer/user to see in console
  console.log("%c [VoiceThroughImage] Running in DEMO MODE ", "background: #222; color: #bada55; font-size: 14px; padding: 4px; border-radius: 4px;");
  console.log("No Firebase API keys found. App will use simulated data and local storage.");
}

export { auth, db, storage, isFirebaseConfigured };