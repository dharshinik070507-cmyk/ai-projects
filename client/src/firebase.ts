import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// 🔹 Your Firebase config (from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyCV_BNIftQKSYYeV-ScU-Pdsy5K7BaZne0",
  authDomain:"agrigrade-ai-cc1cd.firebaseapp.com",
  projectId: "agrigrade-ai-cc1cd",
  appId: "1:996176731205:web:240415613e7ee31a66d72c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth + provider for Google Login
export const auth = getAuth(app);
