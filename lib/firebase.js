// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBYIg6sSowf62Zg2kQsPyizhUs72qPr3ZA",
    authDomain: "digital-flip-menu.firebaseapp.com",
    projectId: "digital-flip-menu",
    storageBucket: "digital-flip-menu.firebasestorage.app",
    messagingSenderId: "824692095789",
    appId: "1:824692095789:web:63f1bb7fc22d57c8db71a4",
    measurementId: "G-V0YEP6ZM0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;