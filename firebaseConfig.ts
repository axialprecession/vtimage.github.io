
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Safely access environment variables from Vite or process.env fallback
const getEnvVar = (key: string) => {
  let val = '';
  // Try import.meta.env (Vite standard)
  try {
    val = (import.meta as any).env?.[key];
  } catch (e) {}
  
  // Try process.env (Fallback injected by vite.config.ts define)
  if (!val) {
    try {
      val = process.env[key] || '';
    } catch (e) {}
  }
  return val;
};

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID')
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
  console.group("MISSING KEYS DEBUGGER");
  console.log("Status of keys (true=loaded, false=missing):");
  console.table({
      "VITE_FIREBASE_API_KEY": !!firebaseConfig.apiKey,
      "VITE_FIREBASE_AUTH_DOMAIN": !!firebaseConfig.authDomain,
      "VITE_FIREBASE_PROJECT_ID": !!firebaseConfig.projectId,
      "GEMINI_API_KEY (AI)": !!getEnvVar('GEMINI_API_KEY')
  });
  console.log("If using a .env file locally, ensure you restarted the dev server.");
  console.groupEnd();
}

export { auth, db, storage, isFirebaseConfigured };
