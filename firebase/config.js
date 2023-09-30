// import * as FB from "firebase";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Функція для підключення авторизації в проект
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
// Функція для підключення бази даних у проект
import { getFirestore } from "firebase/firestore";
// Функція для підключення сховища файлів в проект
import { getStorage } from "firebase/storage";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3CCmQUF-oyKAQmHg56oCPLqIq4GW3VZI",
  authDomain: "gi-social-fd57f.firebaseapp.com",
  projectId: "gi-social-fd57f",
  storageBucket: "gi-social-fd57f.appspot.com",
  messagingSenderId: "757135884752",
  appId: "1:757135884752:web:4ffa2df3fe4310305679d5",
  measurementId: "G-L6NFDXKFGE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const authMethods = {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
};
