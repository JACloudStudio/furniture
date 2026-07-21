// Firebase Configuration & Service Initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBITpEYFaQO74WM-8cPlfaN2bXHz-KEwHg",
  authDomain: "furniture-5b468.firebaseapp.com",
  projectId: "furniture-5b468",
  storageBucket: "furniture-5b468.firebasestorage.app",
  messagingSenderId: "901876144244",
  appId: "1:901876144244:web:11ebcbe70315c138b8d921",
  measurementId: "G-24SJ5697QD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth instance
export const auth = getAuth(app);

// Firestore instance (used for admin email list)
export const db = getFirestore(app);

export default app;
