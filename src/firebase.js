import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging"
const firebaseConfig = window.ENV?.FIREBASE_CONFIG;
// const firebaseConfig = {
//     apiKey: "AIzaSyAXVyhpdYTWyXCRntdgi3EA0WT9Q6WL0nc",
//     authDomain: "matka-notification.firebaseapp.com",
//     projectId: "matka-notification",
//     storageBucket: "matka-notification.firebasestorage.app",
//     messagingSenderId: "737983359377",
//     appId: "1:737983359377:web:826deb3067781500fc1230",
//     measurementId: "G-YZJ4FBPDB0",
//     databaseURL: "https://matka-notification-default-rtdb.firebaseio.com/"
// };

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);