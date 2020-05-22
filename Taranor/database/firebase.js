import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyATGAMGYsmUyJgk4K8i4pT_1GAVjNbdymg",
    authDomain: "orbital-taranor-9c868.firebaseapp.com",
    databaseURL: "https://orbital-taranor-9c868.firebaseio.com",
    projectId: "orbital-taranor-9c868",
    storageBucket: "orbital-taranor-9c868.appspot.com",
    messagingSenderId: "506347658127",
    appID:"1:506347658127:android:846fa286ca7a4f4ea889fa",
};

firebase.initializeApp(firebaseConfig);

export default firebase;