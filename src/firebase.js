import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging"
// const firebaseConfig = window.ENV?.FIREBASE_CONFIG;
const firebaseConfig = {
    apiKey: "AIzaSyASoDqBa9eDz3BuwGAtjeVrN98YL9DvtlI",
    authDomain: "madhur567-1126f.firebaseapp.com",
    projectId: "madhur567-1126f",
    storageBucket: "madhur567-1126f.firebasestorage.app",
    messagingSenderId: "820066901961",
    appId: "1:820066901961:web:0690642173a84c4ddc1218",
    measurementId: "G-PDHG6NC7GR",
    databaseURL: "https://madhur567-1126f-default-rtdb.firebaseio.com"
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);