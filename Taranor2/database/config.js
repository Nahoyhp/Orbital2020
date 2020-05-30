import * as firebase from 'firebase';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCt5SFbaeVIjcALY5SynzKVKt8qzEzRfg0",
    authDomain: "taranorv2.firebaseapp.com",
    databaseURL: "https://taranorv2.firebaseio.com",
    projectId: "taranorv2",
    storageBucket: "taranorv2.appspot.com",
    messagingSenderId: "361539483136",
    appId: "1:361539483136:web:f5f13b1a1a2e6d6c0a8ae5",
  };

firebase.initializeApp(firebaseConfig)
//firebase.firestore()

export default firebase