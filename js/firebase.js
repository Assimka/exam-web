import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth } from "firebase/auth"; 
const firebaseConfig = {
  apiKey: "AIzaSyDnbOKC880Bky__W6cwsidsBejaoH7oMuc",
  authDomain: "examen-web-20fd1.firebaseapp.com",
  projectId: "examen-web-20fd1",
  storageBucket: "examen-web-20fd1.firebasestorage.app",
  messagingSenderId: "339120655888",
  appId: "1:339120655888:web:8c8e6abfed6bbe4e8cc495",
  databaseURL: "https://examen-web-20fd1-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app); 