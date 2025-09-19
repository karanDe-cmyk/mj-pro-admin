// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyASoDqBa9eDz3BuwGAtjeVrN98YL9DvtlI",
  authDomain: "madhur567-1126f.firebaseapp.com",
  projectId: "madhur567-1126f",
  storageBucket: "madhur567-1126f.firebasestorage.app",
  messagingSenderId: "820066901961",
  appId: "1:820066901961:web:0690642173a84c4ddc1218",
  measurementId: "G-PDHG6NC7GR",
  databaseURL: "https://madhur567-1126f-default-rtdb.firebaseio.com"
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