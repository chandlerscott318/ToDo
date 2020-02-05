import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyCaWCgFJQRszz02gsEVNX81WYOlYPPze5k",
  authDomain: "todogroup-2630f.firebaseapp.com",
  databaseURL: "https://todogroup-2630f.firebaseio.com",
  projectId: "todogroup-2630f",
  storageBucket: "todogroup-2630f.appspot.com",
  messagingSenderId: "655322855256",
  appId: "1:655322855256:web:d11f296a1b5806e516972d"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
