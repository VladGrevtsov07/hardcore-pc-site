import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

document.getElementById("registerBtn").addEventListener("click", async () => {
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

  if (password.length < 6) {
    alert("Пароль должен содержать не менее 6 символов!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Можно задать отображаемое имя
    await updateProfile(user, { displayName: email.split('@')[0] });

    alert("Регистрация прошла успешно!");
    window.location.href = "index.html";
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("Этот email уже зарегистрирован!");
    } else if (error.code === "auth/invalid-email") {
      alert("Некорректный email!");
    } else {
      alert("Ошибка регистрации: " + error.message);
    }
    console.error(error);
  }
});
