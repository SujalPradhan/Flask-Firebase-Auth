import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, 
         GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq_hqoYsLKcT7H9c_U1ho_jFI1RHOqnqk",
  authDomain: "sujal-s-portfolio.firebaseapp.com",
  projectId: "sujal-s-portfolio",
  storageBucket: "sujal-s-portfolio.firebasestorage.app",
  messagingSenderId: "156600863890",
  appId: "1:156600863890:web:288c16c6088c599c8e6a4b"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app);

export { auth, provider, db };