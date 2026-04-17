import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAFeUyJd48Gi-w7WaXkmjgK6IKdOWDxZ8A",
  authDomain: "barberia-tickets-prod.firebaseapp.com",
  projectId: "barberia-tickets-prod",
  storageBucket: "barberia-tickets-prod.firebasestorage.app",
  messagingSenderId: "873650298006",
  appId: "1:873650298006:web:7131b3a1d040e0d8d0b6b7",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;