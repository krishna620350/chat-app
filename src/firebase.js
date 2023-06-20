
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB9ZaEjHideN32IqMj95mmE0LKRu9HzZ4A",
    authDomain: "chat-application-ae55c.firebaseapp.com",
    projectId: "chat-application-ae55c",
    storageBucket: "chat-application-ae55c.appspot.com",
    messagingSenderId: "5742762863",
    appId: "1:5742762863:web:296b766ac34a54f2e6269a",
    measurementId: "G-T4HNRYVWNJ"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore(app);