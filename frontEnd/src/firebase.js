import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-a3308.firebaseapp.com",
  projectId: "realestate-a3308",
  storageBucket: "realestate-a3308.appspot.com",
  messagingSenderId: "433146889081",
  appId: "1:433146889081:web:5fbfeae0d8c9a0aa2ea5a8",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
