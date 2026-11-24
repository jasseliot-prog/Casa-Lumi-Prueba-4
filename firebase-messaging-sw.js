/*
 * CASA-LUMI 4
 * Notificaciones del Buzón Mágico
 */

"use strict";

const BUZON_URL = new URL(
  "buzon/index.html",
  self.location.href
).href;

// Abrir el buzón al tocar una notificación.
self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(async ventanas => {
      for (const ventana of ventanas) {
        if (ventana.url.startsWith(BUZON_URL)) {
          return ventana.focus();
        }
      }

      return clients.openWindow(BUZON_URL);
    })
  );
});

importScripts(
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBIRYJbb7AGUv3cqkQAw-xaJ5DKUxH1BkA",
  authDomain: "casa-lumi-e61dc.firebaseapp.com",
  projectId: "casa-lumi-e61dc",
  storageBucket: "casa-lumi-e61dc.firebasestorage.app",
  messagingSenderId: "1095622759655",
  appId: "1:1095622759655:web:a80ea94270e8876b55be42"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  if (payload.notification) return;

  return self.registration.showNotification(
    "💌 Buzón Mágico",
    {
      body: "Tienes una nueva carta en Casa-Lumi 💜",
      tag: "casa-lumi-carta",
      data: {
        url: BUZON_URL
      }
    }
  );
});
