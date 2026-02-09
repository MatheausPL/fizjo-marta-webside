/* ------------------------------
   PRELOAD PODSTRON
------------------------------ */

const pages = [
    "about.html",
    "methods.html",
    "specialization.html",
    "pricing.html",
    "working.html",
    "contact.html"
];

const cache = {};

pages.forEach(page => {
    fetch(page)
        .then(res => res.text())
        .then(html => cache[page] = html);
});


/* ------------------------------
   ŁADOWANIE PODSTRON + LOADER
------------------------------ */

function loadPage(page) {
    const content = document.getElementById('content');
    const loader = document.getElementById('loader');

    loader.classList.remove('hidden');
    content.classList.add('fade-out');

    const load = () => {
        setTimeout(() => {
            content.innerHTML = cache[page] || "Błąd ładowania strony.";
            content.classList.remove('fade-out');

            requestAnimationFrame(() => {
                content.classList.add('fade-in');
            });

            setTimeout(() => {
                content.classList.remove('fade-in');
            }, 400);

            loader.classList.add('hidden');
        }, 300);
    };

    if (cache[page]) load();
    else fetch(page).then(res => res.text()).then(html => { cache[page] = html; load(); });
}


/* ------------------------------
   KLIKANIE W MENU
------------------------------ */

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        loadPage(link.dataset.page);
    });
});

/* Pierwsze ładowanie */
loadPage("about.html");


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