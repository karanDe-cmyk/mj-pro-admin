import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging"
// const firebaseConfig = window.ENV?.FIREBASE_CONFIG;
const firebaseConfig = {
    apiKey: "AIzaSyBYrOJawIST7KFMgtXXcENlaiPi2pYyqqs",
    authDomain: "sblive-efaa4.firebaseapp.com",
    projectId: "sblive-efaa4",
    storageBucket: "sblive-efaa4.firebasestorage.app",
    messagingSenderId: "43134670817",
    appId: "1:43134670817:web:96fec34f39e8e4020be4a0",
    measurementId: "G-T8YSYLQ3TS",
    databaseURL: "https://sblive-efaa4-default-rtdb.firebaseio.com"
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);