// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAXVyhpdYTWyXCRntdgi3EA0WT9Q6WL0nc",
  authDomain: "matka-notification.firebaseapp.com",
  databaseURL: "https://matka-notification-default-rtdb.firebaseio.com",
  projectId: "matka-notification",
  storageBucket: "matka-notification.firebasestorage.app",
  messagingSenderId: "737983359377",
  appId: "1:737983359377:web:9c1599fe814ec4affc1230",
  measurementId: "G-EVVVDGB5CC"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'Background Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new update.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});