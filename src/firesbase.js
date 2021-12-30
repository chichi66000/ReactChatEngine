// import firebase from 'firebase/compat/app'; 
import { initializeApp } from "firebase/app";
// import { getAuth} from 'firebase/auth';
import {getAuth } from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';



// export const db = getFirestore();


// const firebaseConfig = firebase.initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID

// }).auth()

const firebaseConfig = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
}) 

const auth = getAuth(firebaseConfig)
// const auth = app.auth();
const db = getFirestore(firebaseConfig);

export  { db, auth }

// const firebaseConfig = {

//   apiKey: process.env.REACT_APP_FIREBASE_APIKEY,

//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,

//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,

//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,

//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,

//   appId: process.env.REACT_APP_FIREBASE_APP_ID

// };
// const app = initializeApp(firebaseConfig);

// export const auth = app.auth()
