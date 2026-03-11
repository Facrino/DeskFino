import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3pSKWTJ03q6R6kif6vFh2sB7DhcCQm14",
  authDomain: "finovex-26c16.firebaseapp.com",
  databaseURL: "https://finovex-26c16-default-rtdb.firebaseio.com",
  projectId: "finovex-26c16",
  storageBucket: "finovex-26c16.firebasestorage.app",
  messagingSenderId: "651950194308",
  appId: "1:651950194308:web:9e684fe77e8096249eccd1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
