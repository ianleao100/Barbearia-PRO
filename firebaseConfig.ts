import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmpWtbBFzLNKXxg7JpSNJu5-Vet8ISjiE",
  authDomain: "barbearia-pro-33bd5.firebaseapp.com",
  projectId: "barbearia-pro-33bd5",
  storageBucket: "barbearia-pro-33bd5.firebasestorage.app",
  messagingSenderId: "915638561274",
  appId: "1:915638561274:web:bd4579c7c26dd96ac45c43",
  measurementId: "G-GZZYX6R9BT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
