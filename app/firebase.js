import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/firebase-storage";

var firebaseConfig = {
  apiKey: "AIzaSyDyupflR3dHL5CD-YpchgIQaCGG2nA8LtM",
  authDomain: "time-delas.firebaseapp.com",
  databaseURL: "https://time-delas.firebaseio.com",
  projectId: "time-delas",
  storageBucket: "time-delas.appspot.com",
  messagingSenderId: "367668516489",
  appId: "1:367668516489:web:a195ce240b3765671bd858",
  measurementId: "G-DENWG84447",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
