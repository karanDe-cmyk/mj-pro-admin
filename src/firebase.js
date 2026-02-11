import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging"
// const firebaseConfig = window.ENV?.FIREBASE_CONFIG;
const firebaseConfig = {
    apiKey: "AIzaSyDR0frTvL9yk5qYxFmTSVkpoqFboPjjrDo",
    authDomain: "miraz-matka.firebaseapp.com",
    projectId: "miraz-matka",
    storageBucket: "miraz-matka.firebasestorage.app",
    messagingSenderId: "68251806824",
    appId: "1:68251806824:web:559ec8fb1aa8ab45991fdd",
    measurementId: "G-ERCL3J3TDM"
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);