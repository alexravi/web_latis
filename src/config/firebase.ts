import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, type Analytics } from "firebase/analytics";

// Debug: log whether env vars are loaded (values not logged for security)
const envCheck = {
  VITE_FIREBASE_API_KEY: !!import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: !!import.meta.env.VITE_FIREBASE_APP_ID,
  VITE_FIREBASE_MEASUREMENT_ID: !!import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
console.log("[Firebase env check]", envCheck);
const missing = Object.entries(envCheck)
  .filter(([, loaded]) => !loaded)
  .map(([key]) => key);
if (missing.length > 0) {
  console.warn("[Firebase] Missing env vars:", missing);
}

// Validate required Firebase env vars before initialization
const requiredFirebaseVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingVars = Object.entries(requiredFirebaseVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  const errorMsg = `Missing required Firebase environment variables: ${missingVars.join(', ')}`;
  console.warn(`⚠️ ${errorMsg}`);
}

const firebaseConfig = {
    apiKey: requiredFirebaseVars.apiKey!,
    authDomain: requiredFirebaseVars.authDomain!,
    projectId: requiredFirebaseVars.projectId!,
    storageBucket: requiredFirebaseVars.storageBucket!,
    messagingSenderId: requiredFirebaseVars.messagingSenderId!,
    appId: requiredFirebaseVars.appId!,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only if measurementId is provided
let analyticsInstance: Analytics | null = null;
try {
  if (firebaseConfig.measurementId) {
    analyticsInstance = getAnalytics(app);
  } else {
    console.warn('[Firebase] Analytics not initialized: VITE_FIREBASE_MEASUREMENT_ID is not set');
  }
} catch (error) {
  console.error('[Firebase] Failed to initialize Analytics:', error);
  // Don't throw - analytics failure shouldn't break the app
}

export const analytics = analyticsInstance;

export default app;
