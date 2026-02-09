/* ------------------------------
   ŁADOWANIE PODSTRON + LOADER
------------------------------ */

function loadPage(page) {
    const content = document.getElementById('content');
    const loader = document.getElementById('loader');

    loader.classList.remove('hidden'); // pokaż loader
    content.classList.add('fade-out');

    fetch(page)
        .then(res => res.text())
        .then(html => {
            setTimeout(() => {
                content.innerHTML = html;
                content.classList.remove('fade-out');

                requestAnimationFrame(() => {
                    content.classList.add('fade-in');
                });

                setTimeout(() => {
                    content.classList.remove('fade-in');
                }, 400);

                loader.classList.add('hidden'); // ukryj loader

            }, 300);
        });
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