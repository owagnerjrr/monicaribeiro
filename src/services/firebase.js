import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvPJPY_S8x9tlo0xRJZJ0MLacfC8eQ3WM",
  authDomain: "monica-ribeiro.firebaseapp.com",
  projectId: "monica-ribeiro",
  storageBucket: "monica-ribeiro.firebasestorage.app",
  messagingSenderId: "189042087760",
  appId: "1:189042087760:web:c0e4b34fc7557b0314be55",
};

// inicializa o app
const app = initializeApp(firebaseConfig);

// 👉 ESSA LINHA É O QUE ESTAVA FALTANDO / ERRADO
export const db = getFirestore(app);