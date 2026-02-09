/* ---------------------------------
   USTAWIENIE ROOT DLA GITHUB PAGES
----------------------------------- */

// Stały adres do Twojej strony na GitHub Pages
const ROOT = window.location.origin + "/fizjo-marta-webside/";

// Loader tylko przy pierwszym wejściu
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
   PRELOAD PODSTRON
------------------------------ */

async function preloadPages() {
    for (const page of pages) {
        const url = ROOT + page;
        try {
            const res = await fetch(url);

            if (!res.ok) {
                console.warn("Nie udało się załadować:", url);
                continue;
            }

            const html = await res.text();

            if (!html.trim()) {
                console.warn("Pusta odpowiedź:", url);
                continue;
            }

            cache[page] = html;

        } catch (err) {
            console.warn("Błąd pobierania:", url, err);
        }
    }
}

/* ------------------------------
   PRELOAD OBRAZÓW
------------------------------ */

function preloadImages() {
    images.forEach(path => {
        const img = new Image();
        img.src = ROOT + path;
    });
}

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

/* ------------------------------
   ŁADOWANIE PODSTRON + ANIMACJE
------------------------------ */

function loadPage(pagePath) {
    const content = document.getElementById('content');
    if (!content) return;

    const url = ROOT + pagePath;

    content.classList.add('fade-out');

    setTimeout(() => {
        const applyHtml = html => {
            content.innerHTML = html;
            initReveal();

            content.classList.remove('fade-out');

            requestAnimationFrame(() => {
                content.classList.add('fade-in');
            });

            setTimeout(() => {
                content.classList.remove('fade-in');
            }, 400);
        };

        if (!cache[pagePath]) {
            fetch(url)
                .then(res => {
                    if (!res.ok) {
                        throw new Error("HTTP " + res.status);
                    }
                    return res.text();
                })
                .then(html => {
                    cache[pagePath] = html;
                    applyHtml(html);
                })
                .catch(err => {
                    console.error("Błąd ładowania strony:", url, err);
                    applyHtml("<p>Przepraszam, nie udało się załadować tej sekcji.</p>");
                });
        } else {
            applyHtml(cache[pagePath]);
        }

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

        if (loader) loader.classList.add("hidden");
        firstLoad = false;
        localStorage.setItem("loaderShown", "true");
    } else {
        preloadPages();
        preloadImages();
        loadPage("pages/about.html");
        if (loader) loader.classList.add("hidden");
    }
}

/* ------------------------------
   START PO ZAŁADOWANIU DOM
------------------------------ */

document.addEventListener("DOMContentLoaded", () => {
    // Kliknięcia w menu
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const page = link.dataset.page; // np. "pages/about.html"
            if (page) {
                loadPage(page);
            }
        });
    });

    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (hamburger && sidebar && overlay) {
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
    }

    startApp();
});