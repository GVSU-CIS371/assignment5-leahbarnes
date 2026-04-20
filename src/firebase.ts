import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAj27DVbAGPeaN2ZJOfO3EF-DIu3kgkPdU",
  authDomain: "brew-and-save-c3bc3.firebaseapp.com",
  projectId: "brew-and-save-c3bc3",
  storageBucket: "brew-and-save-c3bc3.firebasestorage.app",
  messagingSenderId: "419735265313",
  appId: "1:419735265313:web:1cb24ab07f1a4562558360"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth };
export default db;
