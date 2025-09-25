import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function registerUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();

  if (!email || !password || !confirmPassword) {
    alert("Заполните все поля!");
    return;
  }

  if (password !== confirmPassword) {
    alert("Пароли не совпадают!");
    return;
  }

  try {
    const usersRef = ref(db, "Authorization");
    const snapshot = await get(usersRef);
    const users = snapshot.val() || {};

    const exists = Object.values(users).some(u => u.Login.toLowerCase() === email.toLowerCase());
    if (exists) {
      alert("Такой email уже зарегистрирован!");
      return;
    }

    let newId = 1;
    if (Object.keys(users).length > 0) {
      const ids = Object.values(users).map(u => u.ID_Authorization || 0);
      newId = Math.max(...ids) + 1;
    }

    await set(ref(db, "Authorization/" + newId), {
      ID_Authorization: newId,
      ID_Post: 2,
      Login: email,
      Password: password
    });

    localStorage.setItem("userEmail", email);

    window.location.href = "index.html";
  } catch (err) {
    console.error("Ошибка регистрации:", err);
    alert("Ошибка при регистрации, попробуйте позже!");
  }
}

document.getElementById("registerBtn").addEventListener("click", registerUser);
