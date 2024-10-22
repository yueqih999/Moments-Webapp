// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "your api key",
  authDomain: "your authDomain",
  projectId: "your projectId",
  storageBucket: "your storageBucket",
  messagingSenderId: "your messaginSenderId",
  appId: "your appId"
};

let firebaseApp
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApps()[0];
}

export default firebaseApp;
