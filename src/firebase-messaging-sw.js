import { getMessaging } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";

const firebaseApp = {
  apiKey: "AIzaSyAXVyhpdYTWyXCRntdgi3EA0WT9Q6WL0nc",
  authDomain: "matka-notification.firebaseapp.com",
  projectId: "matka-notification",
  storageBucket: "matka-notification.firebasestorage.app",
  messagingSenderId: "737983359377",
  appId: "1:737983359377:web:826deb3067781500fc1230",
  measurementId: "G-YZJ4FBPDB0",
  databaseURL: "https://matka-notification-default-rtdb.firebaseio.com/"
};

const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});