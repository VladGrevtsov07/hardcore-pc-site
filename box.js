import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

/* ========== Firebase config ========== */
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

/* ========== Main DOM-ready initialization ========== */
document.addEventListener("DOMContentLoaded", () => {
  /* ---- Elements ---- */
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  const authBox = document.getElementById("authBox");
  const authBoxMobile = document.getElementById("authBoxMobile"); // optional
  const buildsContainer = document.getElementById("builds-container");

  /* ---- Defensive checks ---- */
  if (!menuBtn) console.warn("menu-btn not found in DOM");
  if (!menu) console.warn("menu (nav) not found in DOM");

  /* ---- Helper: set container classes for auth boxes ---- */
  const containerClasses = "md:ml-auto flex flex-col md:flex-row items-stretch md:items-center justify-start md:justify-center mt-4 md:mt-0 w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2";
  if (authBox) authBox.className = containerClasses;
  if (authBoxMobile) authBoxMobile.className = containerClasses;

  /* ========== AUTH (render login / logout) ========== */
  function renderAuthBox() {
    const email = localStorage.getItem("userEmail");

    if (email) {
      // logged in UI (use w-full on mobile, md:w-auto on desktop)
      const loggedHTML = `
        <div class="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-2">
          <span class="text-white bg-gray-700 px-3 py-2 rounded w-full md:w-auto text-center md:text-left truncate">${email}</span>
          <button class="logoutBtn bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full md:w-auto">
            Выйти
          </button>
        </div>
      `;

      if (authBox) authBox.innerHTML = loggedHTML;
      if (authBoxMobile) authBoxMobile.innerHTML = loggedHTML;
    } else {
      // guest UI — button/link that is full-width on mobile
      const guestHTML = `
        <a href="authorization.html"
           class="authBtn block w-full md:w-auto text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-center">
          Вход
        </a>
      `;

      if (authBox) authBox.innerHTML = guestHTML;
      if (authBoxMobile) authBoxMobile.innerHTML = guestHTML;
    }

    // Attach logout handlers to all logoutBtn occurrences (if any)
    document.querySelectorAll(".logoutBtn").forEach(btn => {
      // remove existing listeners by cloning (simple and safe)
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener("click", () => {
        localStorage.removeItem("userEmail");
        renderAuthBox();
      });
    });
  }

  /* Initial render */
  renderAuthBox();

  /* ========== MENU (hamburger) ========== */
  function openMenu() {
    if (!menu) return;
    menu.classList.remove('hidden');
    menuBtn?.classList.add('open');
    menuBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (!menu) return;
    menu.classList.add('hidden');
    menuBtn?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    if (!menu) return;
    const isHidden = menu.classList.contains('hidden');
    if (isHidden) openMenu(); else closeMenu();
  }

  // Hook hamburger button
  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
    // ensure accessible attribute initial state
    if (!menuBtn.hasAttribute('aria-expanded')) menuBtn.setAttribute('aria-expanded', 'false');
  }

  // Close menu when clicking outside (mobile)
  document.addEventListener('click', (e) => {
    if (!menu || !menuBtn) return;
    if (window.innerWidth >= 768) return; // only for mobile
    const target = e.target;
    if (!menu.contains(target) && !menuBtn.contains(target)) {
      closeMenu();
    }
  });

  // Close menu when clicking a link (mobile)
  if (menu) {
    const links = menu.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          closeMenu();
        }
      });
    });
  }

  // Resize behavior: switch between mobile/desktop states
  function handleResize() {
    if (!menu) return;
    if (window.innerWidth >= 768) {
      // desktop: ensure menu visible and button reset
      menu.classList.remove('hidden');
      menuBtn?.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    } else {
      // mobile: hide menu by default (unless it is explicitly open)
      if (!menuBtn?.classList.contains('open')) {
        menu.classList.add('hidden');
      }
    }
  }

  window.addEventListener('resize', handleResize);
  // call once to set initial correct state
  handleResize();

  /* ========== Builds loader (from Firebase Realtime DB) ========== */
  function loadBuilds(limit = null) {
    if (!buildsContainer) return;
    const dbRef = ref(db);
    get(child(dbRef, "Builds"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // Firebase returns object keyed by id — use Object.values to get array
          const raw = snapshot.val();
          const data = Array.isArray(raw) ? raw.filter(Boolean) : Object.values(raw);
          buildsContainer.innerHTML = "";

          const buildsToShow = limit ? data.slice(0, limit) : data;

          buildsToShow.forEach((build) => {
            const card = document.createElement("div");
            card.className = "bg-white p-6 rounded-lg shadow-md text-center";

            // Fallbacks for missing fields
            const img = build?.Image || "img/placeholder.png";
            const name = build?.Name || "Без названия";
            const desc = build?.Description || "";
            const price = build?.Price ? `${build.Price} ₽` : "";
            const link = build?.Link || "#";

            card.innerHTML = `
              <img src="${img}" alt="${name}" class="w-full h-65 object-cover rounded-md mb-4">
              <h3 class="text-xl font-semibold mb-2">${name}</h3>
              <p class="text-gray-600 mb-2">${desc}</p>
              <p class="text-lg font-bold mb-4">${price}</p>
              <a href="${link}" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block w-full md:w-auto text-center">Купить</a>
            `;

            buildsContainer.appendChild(card);
          });
        } else {
          console.log("Нет данных о сборках");
          buildsContainer.innerHTML = `<p class="text-gray-500">Сборки не найдены.</p>`;
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке сборок:", error);
        buildsContainer.innerHTML = `<p class="text-red-500">Ошибка загрузки данных.</p>`;
      });
  }

  /* ========== Page-specific load trigger ========== */
  const pathname = window.location.pathname;
  // handle both index.html and root '/'
  if (pathname.includes("index.html") || pathname.endsWith("/")) {
    loadBuilds(3);
  } else {
    loadBuilds();
  }
});
