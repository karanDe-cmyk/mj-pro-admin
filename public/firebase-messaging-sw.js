// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDR0frTvL9yk5qYxFmTSVkpoqFboPjjrDo",
  authDomain: "miraz-matka.firebaseapp.com",
  projectId: "miraz-matka",
  storageBucket: "miraz-matka.firebasestorage.app",
  messagingSenderId: "68251806824",
  appId: "1:68251806824:web:559ec8fb1aa8ab45991fdd",
  measurementId: "G-ERCL3J3TDM"
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