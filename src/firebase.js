// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvPJPY_S8x9tlo0xRJZJ0MLacfC8eQ3WM",
  authDomain: "monica-ribeiro.firebaseapp.com",
  projectId: "monica-ribeiro",
  storageBucket: "monica-ribeiro.firebasestorage.app",
  messagingSenderId: "189042087760",
  appId: "1:189042087760:web:c0e4b34fc7557b0314be55",
  measurementId: "G-QNS3WWN4YE"
};

// 🔥 CORREÇÃO AQUI
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);