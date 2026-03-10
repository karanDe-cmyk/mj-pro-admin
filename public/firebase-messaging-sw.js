// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBqdzjCdGQSnZNTFwFbTNb7wobOD5VITPM",
  authDomain: "strong-matka.firebaseapp.com",
  projectId: "strong-matka",
  storageBucket: "strong-matka.firebasestorage.app",
  messagingSenderId: "401509643073",
  appId: "1:401509643073:web:c0bfdea9bb902328da67c0",
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