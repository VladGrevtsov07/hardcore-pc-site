import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

document.getElementById("loginbutton").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Введите логин и пароль!");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Сохраняем в localStorage (по желанию)
    localStorage.setItem("userEmail", user.email);

    alert("Вы успешно вошли!");
    window.location.href = "index.html";
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      alert("Пользователь не найден!");
    } else if (error.code === "auth/wrong-password") {
      alert("Неверный пароль!");
    } else if (error.code === "auth/invalid-email") {
      alert("Некорректный email!");
    } else {
      alert("Ошибка входа: " + error.message);
    }
    console.error(error);
  }
});

// Следим за состоянием пользователя
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Пользователь вошёл:", user.email);
  } else {
    console.log("Пользователь не авторизован");
  }
});
