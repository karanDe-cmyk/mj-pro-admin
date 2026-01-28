// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBPyeOhmFRnpi8C6WdmC1KPNm6GAIpUiLw",
  authDomain: "matkabar-1ec29.firebaseapp.com",
  databaseURL: "https://matkabar-1ec29-default-rtdb.firebaseio.com",
  projectId: "matkabar-1ec29",
  storageBucket: "matkabar-1ec29.firebasestorage.app",
  messagingSenderId: "1076308028320",
  appId: "1:1076308028320:web:c71d14b52a1409f3f452c5",
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