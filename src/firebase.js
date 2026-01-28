import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging"
// const firebaseConfig = window.ENV?.FIREBASE_CONFIG;
const firebaseConfig = {
    apiKey: "AIzaSyBPyeOhmFRnpi8C6WdmC1KPNm6GAIpUiLw",
    authDomain: "matkabar-1ec29.firebaseapp.com",
    databaseURL: "https://matkabar-1ec29-default-rtdb.firebaseio.com",
    projectId: "matkabar-1ec29",
    storageBucket: "matkabar-1ec29.firebasestorage.app",
    messagingSenderId: "1076308028320",
    appId: "1:1076308028320:web:c71d14b52a1409f3f452c5",
    databaseURL: "https://matkabar-1ec29-default-rtdb.firebaseio.com",
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);