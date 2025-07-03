// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQfd659kplx0xUbkKdRiIL25D1thZsCco",
  authDomain: "netflix-clone-9b8f7.firebaseapp.com",
  projectId: "netflix-clone-9b8f7",
  storageBucket: "netflix-clone-9b8f7.appspot.com", // ✅ FIXED
  messagingSenderId: "404608470257",
  appId: "1:404608470257:web:763130bf0b13f1e4a1ad50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);           // ✅ for auth
export const db = getFirestore(app);        // ✅ for Firestore
