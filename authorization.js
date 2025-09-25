import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

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

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        Swal.fire({
            icon: "error",
            title: "Ошибка...",
            text: "Введите логин и пароль!",
          });
        return;
    }

    try {
        const snapshot = await get(ref(database, 'Authorization'));
        const users = snapshot.val();

        const filteredUsers = Object.values(users).filter(u => u);

        const user = filteredUsers.find(u => u.Login.toLowerCase() === email.toLowerCase() && u.Password === password);

        if (user) {
            localStorage.setItem("userEmail", user.Login);
            window.location.href = "index.html";
            const isAdmin = user.ID_Post === 1;
            
            const isCoach = user.ID_Post === 3;

            if (isAdmin) {
                window.location.href = 'adminpanel.html';
            } else if (isCoach) {
                window.location.href = 'index.html';
            } else {
                window.location.href = 'index.html'
            }
        } else {
            console.error('Пользователь не найден или неверный логин/пароль.');
            Swal.fire({
                icon: "error",
                title: "Ошибка...",
                text: "Неправильный логин или пароль!",
              });
        }
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
    }
}

document.getElementById('loginbutton').addEventListener('click', loginUser);
