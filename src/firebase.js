import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging"
// const firebaseConfig = window.ENV?.FIREBASE_CONFIG;
const firebaseConfig = {
    apiKey: "AIzaSyBqdzjCdGQSnZNTFwFbTNb7wobOD5VITPM",
    authDomain: "strong-matka.firebaseapp.com",
    projectId: "strong-matka",
    storageBucket: "strong-matka.firebasestorage.app",
    messagingSenderId: "401509643073",
    appId: "1:401509643073:web:c0bfdea9bb902328da67c0",
    measurementId: "G-EVVVDGB5CC",
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);