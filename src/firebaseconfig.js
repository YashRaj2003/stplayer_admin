import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTaBTEXPk9Ax44eCkiC4RainTLJcPHzdo",
  authDomain: "stplayer-lpu.firebaseapp.com",
  projectId: "stplayer-lpu",
  storageBucket: "stplayer-lpu.appspot.com",
  messagingSenderId: "996242174539",
  appId: "1:996242174539:web:d705205fd74fd4ebbe93ce"
};

let firebaseapp = firebase.initializeApp(firebaseConfig);
let storage = firebaseapp.storage();
let auth = firebaseapp.auth();
let firedb = firebaseapp.firestore();

export { storage, auth, firedb };
