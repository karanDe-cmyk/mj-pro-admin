import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging"
// const firebaseConfig = window.ENV?.FIREBASE_CONFIG;
const firebaseConfig = {
    apiKey: "AIzaSyBPyeOhmFRnpi8C6WdmC1KPNm6GAIpUiLw",
    authDomain: "matkabar-1ec29.firebaseapp.com",
    projectId: "matkabar-1ec29",
    storageBucket: "matkabar-1ec29.firebasestorage.app",
    messagingSenderId: "1076308028320",
    appId: "1:1076308028320:web:4bef2981b6381ddbf452c5"
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);