import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

import { getStorage } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyC14vhFHwtW1b9vxXTXneiMhl2rTJ2h_-g",

  authDomain: "pyfunds-8645e.firebaseapp.com",

  projectId: "pyfunds-8645e",

  storageBucket: "pyfunds-8645e.firebasestorage.app",

  messagingSenderId: "920472094624",

  appId: "1:920472094624:web:28bd1c0662e47353be06c5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);