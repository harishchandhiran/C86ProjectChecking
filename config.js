import firebase from 'firebase';
require("@firebase/firestore");

 // Your web app's Firebase configuration
 var firebaseConfig = {
  apiKey: "AIzaSyC9SL5E22UO92YY2dnxoKHLIjHajqQjNw0",
  authDomain: "barter-system-a604b.firebaseapp.com",
  databaseURL: "https://barter-system-a604b.firebaseio.com",
  projectId: "barter-system-a604b",
  storageBucket: "barter-system-a604b.appspot.com",
  messagingSenderId: "427702698852",
  appId: "1:427702698852:web:eae3b229d95b892c5bb071",
  measurementId: "G-L812LG3R7H"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();