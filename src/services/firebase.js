// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getDatabase, onValue, ref, set } from "firebase/database";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteField,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {
//   apiKey: "AIzaSyBq83KWN6Yvr-Xc_841Q1KrycIrbFgnzOs",
//   authDomain: "smart-warehouse-627ab.firebaseapp.com",
//   projectId: "smart-warehouse-627ab",
//   storageBucket: "smart-warehouse-627ab.appspot.com",
//   messagingSenderId: "576472132228",
//   appId: "1:576472132228:web:e02ab3984a24467e8f70d1",
//   measurementId: "G-Q3XS16XJKC",
// };

const firebaseConfig = {
  apiKey: "AIzaSyBw1nHv3woU8FoaPV1T0WKHH1-vJ4sYCxo",
  authDomain: "smart-warehouse2.firebaseapp.com",
  projectId: "smart-warehouse2",
  storageBucket: "smart-warehouse2.appspot.com",
  messagingSenderId: "282957738911",
  appId: "1:282957738911:web:e2fe885606cbb40ec843aa",
  measurementId: "G-48K6F35Y4P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, GoogleAuthProvider, signInWithPopup, signOut };
export { database, onValue, ref, set };
export {
  storage,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteField,
  deleteDoc,
  Timestamp,
};
