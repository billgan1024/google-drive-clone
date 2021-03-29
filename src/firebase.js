//set up firebase functionality (use npm install firebase)
import firebase from "firebase/app";
import 'firebase/storage';
import "firebase/auth";
import "firebase/firestore";

//initialize env variables such that only we see these values locally (no one on github can view these)
const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
});

const firestore = app.firestore();
export const database = {
    //export database data of the database's folders and files
    //use firebase's methods of getting the current timestamp
    folders: firestore.collection("folders"),
    files: firestore.collection("files"),
    formatDoc: doc => {
        return {id: doc.id, ...doc.data()}; 
    },
    getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp
}
//export authentication
export const auth = app.auth();
export const storage = app.storage();
export default app;