import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVKSZIxjyy2qg3_0qH2FHz1KZYjUSx8WA",
  authDomain: "web-mods-8c679.firebaseapp.com",
  databaseURL: "https://web-mods-8c679-default-rtdb.firebaseio.com",
  projectId: "web-mods-8c679",
  storageBucket: "web-mods-8c679.firebasestorage.app",
  messagingSenderId: "403594167177",
  appId: "1:403594167177:web:0095523105c7b1bc46d758",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  const authBox = document.getElementById("authBox");

  function renderAuthBox() {
    const email = localStorage.getItem("userEmail");

    if (email) {
      authBox.innerHTML = `
        <span class="text-white bg-gray-700 px-3 py-1 rounded">${email}</span>
        <button id="logoutBtn" class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded ml-2">Выйти</button>
      `;

      document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("userEmail");
        renderAuthBox();
      });
    } else {
      authBox.innerHTML = `
        <a href="authorization.html" 
           class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
          Вход
        </a>
      `;
    }
  }

  renderAuthBox();
});



function loadBuilds(limit = null) {
  const dbRef = ref(db);
  get(child(dbRef, "Builds"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        const container = document.getElementById("builds-container");

        container.innerHTML = "";

        const buildsToShow = limit ? data.slice(0, limit) : data;

        buildsToShow.forEach((build) => {
          const card = document.createElement("div");
          card.className = "bg-white p-6 rounded-lg shadow-md text-center";

          card.innerHTML = `
            <img src="${build.Image}" alt="${build.Name}" class="w-full h-65 object-cover rounded-md mb-4">
            <h3 class="text-xl font-semibold mb-2">${build.Name}</h3>
            <p class="text-gray-600 mb-2">${build.Description}</p>
            <p class="text-lg font-bold mb-4">${build.Price} ₽</p>
            <a href="${build.Link}" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Купить</a>
          `;

          container.appendChild(card);
        });
      } else {
        console.log("Нет данных о сборках");
      }
    })
    .catch((error) => {
      console.error("Ошибка при загрузке:", error);
    });
}

if (window.location.pathname.includes("index.html")) {
  loadBuilds(3);
} else {
  loadBuilds();
}
