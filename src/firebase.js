import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging"
// const firebaseConfig = window.ENV?.FIREBASE_CONFIG;
const firebaseConfig = {
    apiKey: "AIzaSyAXVyhpdYTWyXCRntdgi3EA0WT9Q6WL0nc",
    authDomain: "matka-notification.firebaseapp.com",
    databaseURL: "https://matka-notification-default-rtdb.firebaseio.com",
    projectId: "matka-notification",
    storageBucket: "matka-notification.firebasestorage.app",
    messagingSenderId: "737983359377",
    appId: "1:737983359377:web:9c1599fe814ec4affc1230",
    measurementId: "G-EVVVDGB5CC"
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);