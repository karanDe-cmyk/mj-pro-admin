import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging"
// const firebaseConfig = window.ENV?.FIREBASE_CONFIG;
const firebaseConfig = {
    apiKey: "AIzaSyB1WgqxxEeB_wZ6KQkMBM8QH8S8h5GhgNg",
    authDomain: "matkabar-1ec29.firebaseapp.com",
    databaseURL: "https://matkabar-1ec29-default-rtdb.firebaseio.com",
    projectId: "matkabar-1ec29",
    storageBucket: "matkabar-1ec29.firebasestorage.app",
    messagingSenderId: "1076308028320",
    appId: "1:1076308028320:web:b7a5e262840d87d4f452c5",
    measurementId: "G-EVVVDGB5CC",
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);