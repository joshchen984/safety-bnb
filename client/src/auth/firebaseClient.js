import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD1oR_ghyZlBxW6OYWOVDA-UmLWY-GJDRI",
  authDomain: "safety-bnb.firebaseapp.com",
  projectId: "safety-bnb",
  storageBucket: "safety-bnb.firebasestorage.app",
  messagingSenderId: "783401757053",
  appId: "1:783401757053:web:4b689f0c404817defa4414"
};

export default function firebaseClient() {
  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
  }
}
