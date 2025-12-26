import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging"
// const firebaseConfig = window.ENV?.FIREBASE_CONFIG;
const firebaseConfig = {
    apiKey: "AIzaSyBPyeOhmFRnpi8C6WdmC1KPNm6GAIpUiLw",
    authDomain: "matkabar-1ec29.firebaseapp.com",
    projectId: "matkabar-1ec29",
    storageBucket: "matkabar-1ec29.firebasestorage.app",
    messagingSenderId: "1076308028320",
    appId: "1:1076308028320:web:aaf9551080077cb6f452c5",
    measurementId: "G-EVVVDGB5CC",
    databaseURL: "https://matkabar-1ec29-default-rtdb.firebaseio.com",
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);