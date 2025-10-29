import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVKSZIxjyy2qg3_0qH2FHz1KZYjUSx8WA",
  authDomain: "web-mods-8c679.firebaseapp.com",
  databaseURL: "https://web-mods-8c679-default-rtdb.firebaseio.com",
  projectId: "web-mods-8c679",
  storageBucket: "web-mods-8c679.firebasestorage.app",
  messagingSenderId: "403594167177",
  appId: "1:403594167177:web:0095523105c7b1bc46d758",
  measurementId: "G-VWMRDPNV87"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);