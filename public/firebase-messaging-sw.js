// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBYrOJawIST7KFMgtXXcENlaiPi2pYyqqs",
  authDomain: "sblive-efaa4.firebaseapp.com",
  projectId: "sblive-efaa4",
  storageBucket: "sblive-efaa4.firebasestorage.app",
  messagingSenderId: "43134670817",
  appId: "1:43134670817:web:96fec34f39e8e4020be4a0",
  measurementId: "G-T8YSYLQ3TS",
  databaseURL: "https://sblive-efaa4-default-rtdb.firebaseio.com"
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