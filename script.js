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
    "pages/first-visit.html",
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

    loader.classList.add("hidden");
}

/* ---------------------------------
   EVENTY + MOBILE TOPBAR INTEGRATION
----------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    // Ensure mobile topbar exists (create if missing)
    let mobileTopbar = document.querySelector('.mobile-topbar');
    if (!mobileTopbar) {
        mobileTopbar = document.createElement('div');
        mobileTopbar.className = 'mobile-topbar';
        mobileTopbar.innerHTML = `
            <button id="hamburger" class="hamburger" aria-label="Menu" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
            <div class="brand">Fizjoterapia Marta Pięta</div>
        `;
        // insert at top of body so it's always first
        document.body.insertBefore(mobileTopbar, document.body.firstChild);
    } else {
        // ensure brand exists
        if (!mobileTopbar.querySelector('.brand')) {
            const brand = document.createElement('div');
            brand.className = 'brand';
            brand.textContent = 'Fizjoterapia Marta Pięta';
            mobileTopbar.appendChild(brand);
        }
        // if mobileTopbar contains no hamburger, create one
        if (!mobileTopbar.querySelector('#hamburger')) {
            const btn = document.createElement('button');
            btn.id = 'hamburger';
            btn.className = 'hamburger';
            btn.setAttribute('aria-label', 'Menu');
            btn.innerHTML = '<span></span><span></span><span></span>';
            mobileTopbar.prepend(btn);
        }
    }

    // Grab elements (after ensuring hamburger exists)
    const hamburger = document.getElementById("hamburger");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    // If there is an existing hamburger elsewhere in DOM, move it into mobileTopbar
    // (This ensures single source of truth for the button)
    const existingHamburger = document.querySelector('.hamburger');
    if (existingHamburger && existingHamburger.parentElement !== mobileTopbar) {
        mobileTopbar.prepend(existingHamburger);
    }

    // kliknięcia w linki nawigacji (sidebar)
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const page = link.dataset.page;

            // ⭐ TU ZAMYKAMY MENU PO KLIKNIĘCIU W LINK
            if (hamburger) hamburger.classList.remove("active");
            if (sidebar) sidebar.classList.remove("open");
            if (overlay) overlay.classList.remove("visible");
            document.body.style.overflow = ""; // przywróć przewijanie
            loadPage(page);
        });
    });

    // OTWIERANIE / ZAMYKANIE HAMBURGERA
    if (hamburger) {
        hamburger.addEventListener("click", () => {
            const isActive = hamburger.classList.toggle("active");
            if (sidebar) sidebar.classList.toggle("open", isActive);
            if (overlay) overlay.classList.toggle("visible", isActive);

            // aria-expanded for accessibility
            hamburger.setAttribute("aria-expanded", isActive ? "true" : "false");

            // lock body scroll when menu open
            document.body.style.overflow = isActive ? "hidden" : "";
        });
    }

    // ZAMYKANIE PO KLIKNIĘCIU W OVERLAY
    if (overlay) {
        overlay.addEventListener("click", () => {
            if (hamburger) hamburger.classList.remove("active");
            if (sidebar) sidebar.classList.remove("open");
            if (overlay) overlay.classList.remove("visible");
            document.body.style.overflow = "";
        });
    }

    // Ensure main-content has top padding so content isn't hidden under sticky topbar
    const mainContent = document.querySelector('.main-content') || document.getElementById('content');
    if (mainContent) {
        // Only set padding-top if CSS doesn't already handle it; this is safe override for mobile
        const computed = window.getComputedStyle(mainContent).paddingTop;
        // apply only if padding-top is small (to avoid doubling)
        if (!computed || parseInt(computed, 10) < 10) {
            mainContent.style.paddingTop = '68px'; // matches header height + small gap
            mainContent.style.boxSizing = 'border-box';
        }
    }

    startApp();
});
