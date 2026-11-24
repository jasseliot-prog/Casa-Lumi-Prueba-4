import {
  initializeApp,
  getApps,
  getApp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBIRYJbb7AGUv3cqkQAw-xaJ5DKUxH1BkA",
  authDomain: "casa-lumi-e61dc.firebaseapp.com",
  projectId: "casa-lumi-e61dc",
  storageBucket: "casa-lumi-e61dc.firebasestorage.app",
  messagingSenderId: "1095622759655",
  appId: "1:1095622759655:web:a80ea94270e8876b55be42"
};

export const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
