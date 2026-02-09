let firstLoad = !localStorage.getItem("loaderShown");

/* ------------------------------
   LISTA PODSTRON I OBRAZÓW
------------------------------ */

const pages = [
    "about.html",
    "methods.html",
    "specialization.html",
    "pricing.html",
    "working.html",
    "contact.html"
];

const images = [
    "img/logo.wepb",
    "img/marta.webp"
];

const cache = {};


/* ------------------------------
   PRELOAD PODSTRON – BLOKUJĄCY
------------------------------ */

async function preloadPages() {
    for (const page of pages) {
        const res = await fetch(page);
        const html = await res.text();
        cache[page] = html;
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
        content.innerHTML = cache[page] || "Błąd ładowania strony.";
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
        await preloadPages();   // czekamy aż WSZYSTKO się załaduje
        preloadImages();        // obrazy w tle

        loadPage("about.html"); // <-- PRZENIESIONE TUTAJ

        loader.classList.add("hidden");
        firstLoad = false;
        localStorage.setItem("loaderShown", "true");
    } else {
        preloadPages();  // w tle
        preloadImages(); // w tle
        loadPage("about.html"); // <-- TUTAJ TEŻ
    }
}



startApp();


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