/* ---------------------------------
   ROOT DLA GITHUB PAGES
----------------------------------- */

const ROOT = window.location.origin + "/fizjo-marta-webside/";
let firstLoad = !localStorage.getItem("loaderShown");

/* ---------------------------------
   LISTA PODSTRON
----------------------------------- */

const pages = [
    "pages/about.html",
    "pages/methods.html",
    "pages/specialization.html",
    "pages/pricing.html",
    "pages/working.html",
    "pages/contact.html"
];

const cache = {};

/* ---------------------------------
   PRELOAD PODSTRON (ASYNC, LEKKI)
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

            content.classList.remove("fade-out");
            content.classList.add("fade-in");

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

    loadPage("pages/about.html");

    if (firstLoad) {
        await preloadPages();
        localStorage.setItem("loaderShown", "true");
        firstLoad = false;
    } else {
        preloadPages();
    }

    loader.classList.add("hidden");
}

/* ---------------------------------
   EVENTY
----------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            loadPage(link.dataset.page);
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