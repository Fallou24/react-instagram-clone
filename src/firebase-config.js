import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "instagram-clone-677f9.firebaseapp.com",
  projectId: "instagram-clone-677f9",
  storageBucket: "instagram-clone-677f9.appspot.com",
  messagingSenderId: "907578164783",
  appId: "1:907578164783:web:330e6f1f422e73d7e9e8da"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export  const bdd = getFirestore(app)
export const storage = getStorage(app)