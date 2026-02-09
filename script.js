/* ---------------------------------
   USTAWIENIE ROOT DLA GITHUB PAGES
----------------------------------- */

const ROOT = "/fizjo-marta-webside/";  
let firstLoad = !localStorage.getItem("loaderShown");

/* ------------------------------
   LISTA PODSTRON I OBRAZÓW
------------------------------ */

const pages = [
    ROOT + "pages/about.html",
    ROOT + "pages/methods.html",
    ROOT + "pages/specialization.html",
    ROOT + "pages/pricing.html",
    ROOT + "pages/working.html",
    ROOT + "pages/contact.html"
];

const images = [
    ROOT + "img/logo.webp",
    ROOT + "img/marta.webp"
];

const cache = {};


/* ------------------------------
   PRELOAD PODSTRON – BEZ ZAWIESZANIA
------------------------------ */

async function preloadPages() {
    for (const page of pages) {
        try {
            const res = await fetch(page);

            if (!res.ok) {
                console.warn("Nie udało się załadować:", page);
                continue;
            }

            const html = await res.text();

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

        // jeśli strona NIE jest jeszcze w cache → pobierz ją normalnie
        if (!cache[page]) {
            fetch(page)
                .then(res => res.text())
                .then(html => {
                    cache[page] = html;
                    content.innerHTML = html;
                    initReveal();
                });
        } else {
            content.innerHTML = cache[page];
            initReveal();
        }

        content.classList.remove('fade-out');

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

        loadPage(ROOT + "pages/about.html");

        loader.classList.add("hidden");
        firstLoad = false;
        localStorage.setItem("loaderShown", "true");

    } else {
        preloadPages();
        preloadImages();
        loadPage(ROOT + "pages/about.html");
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
        loadPage(ROOT + link.dataset.page);
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