/* ---------------------------------
   ROOT – działa lokalnie i na GitHub Pages
----------------------------------- */

const ROOT = "";
let firstLoad = !localStorage.getItem("loaderShown");

/* ---------------------------------
   LISTA PODSTRON
----------------------------------- */

const pages = [ 
    "pages/home.html",
    "pages/about.html",
    "pages/methods.html",
    "pages/specialization.html",
    "pages/pricing.html",
    "pages/working.html",
    "pages/contact.html"
];

const cache = {};

/* ---------------------------------
   PRELOAD PODSTRON
----------------------------------- */

async function preloadPages() {
    for (const page of pages) {
        const url = ROOT + page;

        try {
            const res = await fetch(url);
            if (!res.ok) continue;

            const html = await res.text();
            if (!html.trim()) continue;

            cache[page] = html;
            localStorage.setItem(page, html);

        } catch (_) {}
    }
}

/* ---------------------------------
   PODŚWIETLANIE AKTYWNEGO LINKU
----------------------------------- */

function highlightActiveLink(page) {
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        const target = link.getAttribute('data-page');
        if (target === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* ---------------------------------
   ŁADOWANIE PODSTRONY
----------------------------------- */

function loadPage(pagePath) {
    const content = document.getElementById("content");
    const url = ROOT + pagePath;

    content.classList.add("fade-out");

    setTimeout(() => {
        const apply = html => {
            content.innerHTML = html;
            initReveal();

            // aktywacja linków wewnętrznych
            content.querySelectorAll("[data-page]").forEach(link => {
                link.addEventListener("click", e => {
                    e.preventDefault();
                    loadPage(link.dataset.page);
                });
            });

            content.classList.remove("fade-out");
            content.classList.add("fade-in");

            highlightActiveLink(pagePath);

            setTimeout(() => content.classList.remove("fade-in"), 250);
        };

        if (cache[pagePath]) {
            apply(cache[pagePath]);
            return;
        }

        const stored = localStorage.getItem(pagePath);
        if (stored) {
            cache[pagePath] = stored;
            apply(stored);
            return;
        }

        fetch(url)
            .then(res => res.text())
            .then(html => {
                cache[pagePath] = html;
                localStorage.setItem(pagePath, html);
                apply(html);
            })
            .catch(() => apply("<p>Błąd ładowania strony.</p>"));

    }, 150);
}

/* ---------------------------------
   SCROLL REVEAL
----------------------------------- */

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

function initReveal() {
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

/* ---------------------------------
   START APLIKACJI
----------------------------------- */

async function startApp() {
    const loader = document.getElementById("loader");

    // STRONA STARTOWA
    loadPage("pages/home.html");

    if (firstLoad) {
        await preloadPages();
        localStorage.setItem("loaderShown", "true");
        firstLoad = false;
    } else {
        preloadPages();
    }

    // ⭐ Poprawka: loader znika zawsze
    loader.classList.add("hidden");
}

/* ---------------------------------
   EVENTY
----------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const page = link.dataset.page;
            loadPage(page);
        });
    });

    const hamburger = document.getElementById("hamburger");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        sidebar.classList.toggle("open");
        overlay.classList.toggle("visible");
    });

    overlay.addEventListener("click", () => {
        hamburger.classList.remove("active");
        sidebar.classList.remove("open");
        overlay.classList.remove("visible");
    });

    startApp();
});
