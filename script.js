let firstLoad = !localStorage.getItem("loaderShown");

/* ------------------------------
   LISTA PODSTRON I OBRAZÓW
------------------------------ */

const pages = [
    "pages/about.html",
    "pages/methods.html",
    "pages/specialization.html",
    "pages/pricing.html",
    "pages/working.html",
    "pages/contact.html"
];

const images = [
    "img/logo.webp",
    "img/marta.webp"
];

const cache = {};


/* ------------------------------
   PRELOAD PODSTRON – BEZ ZAWIESZANIA
------------------------------ */

async function preloadPages() {
    for (const page of pages) {
        try {
            const res = await fetch(page);

            // jeśli GitHub Pages zwróci 404, 301, 0B → pomijamy
            if (!res.ok) {
                console.warn("Nie udało się załadować:", page);
                continue;
            }

            const html = await res.text();

            // jeśli odpowiedź jest pusta → pomijamy
            if (!html.trim()) {
                console.warn("Pusta odpowiedź:", page);
                continue;
            }

            cache[page] = html;

        } catch (err) {
            console.warn("Błąd pobierania:", page, err);
        }
    }
}


/* ------------------------------
   PRELOAD OBRAZÓW
------------------------------ */

function preloadImages() {
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}


/* ------------------------------
   ŁADOWANIE PODSTRON + ANIMACJE
------------------------------ */

function loadPage(page) {
    const content = document.getElementById('content');

    content.classList.add('fade-out');

    setTimeout(() => {
        content.innerHTML = cache[page] || "<p>Błąd ładowania strony.</p>";
        content.classList.remove('fade-out');

        initReveal();

        requestAnimationFrame(() => {
            content.classList.add('fade-in');
        });

        setTimeout(() => {
            content.classList.remove('fade-in');
        }, 400);

    }, 300);
}


/* ------------------------------
   START APLIKACJI
------------------------------ */

async function startApp() {
    const loader = document.getElementById("loader");

    if (firstLoad) {
        await preloadPages();
        preloadImages();

        loadPage("pages/about.html");

        loader.classList.add("hidden");
        firstLoad = false;
        localStorage.setItem("loaderShown", "true");

    } else {
        preloadPages();
        preloadImages();
        loadPage("pages/about.html");
    }
}


/* ------------------------------
   START PO ZAŁADOWANIU DOM
------------------------------ */

document.addEventListener("DOMContentLoaded", startApp);


/* ------------------------------
   KLIKANIE W MENU
------------------------------ */

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        loadPage(link.dataset.page);
    });
});


/* ------------------------------
   HAMBURGER MENU
------------------------------ */

const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
    });
});

overlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
});


/* ------------------------------
   SCROLL REVEAL
------------------------------ */

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

function initReveal() {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}