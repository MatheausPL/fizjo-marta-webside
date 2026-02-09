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

// dodaj tu wszystkie ważne obrazy z projektu
const images = [
    "img/logo.png",
    "img/marta-1.jpg",
    "img/marta-2.jpg",
    "img/gabinet-1.jpg",
    "img/gabinet-2.jpg"
];

const cache = {};

/* ------------------------------
   PRELOAD PODSTRON
------------------------------ */

pages.forEach(page => {
    fetch(page)
        .then(res => res.text())
        .then(html => cache[page] = html)
        .catch(() => {});
});

/* ------------------------------
   PRELOAD OBRAZÓW
------------------------------ */

images.forEach(src => {
    const img = new Image();
    img.src = src;
});


/* ------------------------------
   ŁADOWANIE PODSTRON + LOADER
------------------------------ */

function loadPage(page) {
    const content = document.getElementById('content');
    const loader = document.getElementById('loader');

    // Loader tylko przy pierwszym wejściu
    if (firstLoad) {
        loader.classList.remove('hidden');
    }

    content.classList.add('fade-out');

    const load = () => {
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

            // Ukryj loader tylko raz
            if (firstLoad) {
                loader.classList.add('hidden');
                firstLoad = false;
                localStorage.setItem("loaderShown", "true");
            }

        }, 300);
    };

    if (cache[page]) load();
    else fetch(page).then(res => res.text()).then(html => { cache[page] = html; load(); });
}



/* Klikanie w menu */
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        loadPage(link.dataset.page);
    });
});

/* Pierwsze ładowanie */
loadPage('about.html');


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
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // jeśli nie chcesz, żeby znikało po wyjściu z viewportu:
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

function initReveal() {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* wywołuj po każdej zmianie contentu */