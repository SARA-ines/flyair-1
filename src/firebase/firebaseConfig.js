// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqb55T12TAaD8ac5lB8nKBCHuIsrXZrLs",
  authDomain: "flutter-ai-playground-a2699.firebaseapp.com",
  projectId: "flutter-ai-playground-a2699",
  storageBucket: "flutter-ai-playground-a2699.appspot.com",
  messagingSenderId: "484256689186",
  appId: "1:484256689186:web:5d9c0992065fc8903dae7b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth + Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
