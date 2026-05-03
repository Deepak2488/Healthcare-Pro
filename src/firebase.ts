// import { initializeApp } from "firebase/app";
// import { getAuth, type Auth } from "firebase/auth";
// import { getMessaging, isSupported } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// };

// const requiredConfig = [
//   firebaseConfig.apiKey,
//   firebaseConfig.authDomain,
//   firebaseConfig.projectId,
//   firebaseConfig.messagingSenderId,
//   firebaseConfig.appId,
// ];

// export const isFirebaseConfigured = requiredConfig.every(
//   (value) => typeof value === "string" && value.length > 0 && !value.startsWith("YOUR_"),
// );

// export const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

// export const auth: Auth | null = app ? getAuth(app) : null;

// export const getFirebaseMessaging = async () => {
//   if (!app || !(await isSupported())) {
//     return null;
//   }

//   return getMessaging(app);
// };

// src/firebase.ts

// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// 🔐 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA_vnvy6ebrOHVYZamF8nY6coJ-6z6aSFs",
  authDomain: "reactjsauth-df919.firebaseapp.com",
  projectId: "reactjsauth-df919",
  storageBucket: "reactjsauth-df919.appspot.com",
  messagingSenderId: "288344606988",
  appId: "1:288344606988:web:a4aff72aceec542827a129",
  measurementId: "G-1EBXG0T0HN",
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Auth (used for login)
export const auth = getAuth(app);

// 📊 Analytics (safe check)
export const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

// 🔔 Messaging (for FCM)
export const getFirebaseMessaging = async () => {
  return getMessaging(app);
};

export default app;