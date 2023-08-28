import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAyButGwy_9KQ_UMC0AnurKyupd4yRgVwo",
    authDomain: "lobby-eef07.firebaseapp.com",
    databaseURL:
        "https://lobby-eef07-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "lobby-eef07",
    storageBucket: "lobby-eef07.appspot.com",
    messagingSenderId: "292889344397",
    appId: "1:292889344397:web:f21d0e77fa0b090c1de5c4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const dbRealtime = getDatabase(app);
export const dbFirestore = getFirestore(app);
