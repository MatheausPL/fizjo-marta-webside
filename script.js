let e = !localStorage.getItem("loaderShown");
const t = ["pages/home.html", "pages/about.html", "pages/first-visit.html", "pages/methods.html", "pages/specialization.html", "pages/pricing.html", "pages/working.html", "pages/contact.html"],
    o = {};

async function n() {
    for (const e of t) {
        if (o[e] || localStorage.getItem(e)) continue;
        try {
            const t = await fetch(e);
            if (t.ok) {
                const n = await t.text();
                if (n.trim()) {
                    o[e] = n;
                    // Zapisujemy do pamięci w wolnej chwili, by nie mulić strony
                    setTimeout(() => localStorage.setItem(e, n), 0);
                }
            }
        } catch (e) { }
    }
}

function a(e) {
    const t = document.getElementById("content"),
        n = "" + e;
    t.classList.add("fade-out"), setTimeout(() => {
        const c = o => {
            t.innerHTML = o, requestAnimationFrame(() => {
                const e = document.querySelector(".main-content") || document.getElementById("content");
                if (e && e !== document.scrollingElement) try {
                    e.scrollTo({ top: 0, left: 0, behavior: "auto" })
                } catch (t) { e.scrollTop = 0 }
                try { window.scrollTo({ top: 0, left: 0, behavior: "auto" }) } catch (e) {
                    document.documentElement.scrollTop = 0, document.body.scrollTop = 0
                }
                const o = Array.from(t.querySelectorAll("img"));
                if (o.length) {
                    let e = 0;
                    const t = () => {
                        if (e++, e >= o.length) try { window.scrollTo({ top: 0, left: 0, behavior: "auto" }) } catch (e) {
                            document.documentElement.scrollTop = 0, document.body.scrollTop = 0
                        }
                    };
                    o.forEach(e => { e.complete ? t() : (e.addEventListener("load", t), e.addEventListener("error", t)) })
                }
            }), document.querySelectorAll(".reveal").forEach(e => s.observe(e)), t.querySelectorAll("[data-page]").forEach(e => {
                e.addEventListener("click", t => { t.preventDefault(), a(e.dataset.page) })
            }), t.classList.remove("fade-out"), t.classList.add("fade-in");
            const n = e;
            document.querySelectorAll(".nav-links a").forEach(e => {
                e.getAttribute("data-page") === n ? e.classList.add("active") : e.classList.remove("active")
            }), setTimeout(() => t.classList.remove("fade-in"), 250)
        };
        if (o[e]) return void c(o[e]);
        const r = localStorage.getItem(e);
        if (r) return o[e] = r, void c(r);
        fetch(n).then(e => e.text()).then(t => { o[e] = t, localStorage.setItem(e, t), c(t) }).catch(() => c("<p>Błąd ładowania strony.</p>"))
    }, 150)
}

const s = new IntersectionObserver(e => {
    e.forEach(e => { e.isIntersecting && (e.target.classList.add("visible"), s.unobserve(e.target)) })
}, { threshold: .15 });

document.addEventListener("DOMContentLoaded", () => {
    let t = document.querySelector(".mobile-topbar");
    if (!t) {
        t = document.createElement("div"), t.className = "mobile-topbar", t.innerHTML = '\n            <button id="hamburger" class="hamburger" aria-label="Menu" aria-expanded="false">\n              <span></span><span></span><span></span>\n            </button>\n            <div class="brand">Fizjoterapia Marta Pięta</div>\n        ', document.body.insertBefore(t, document.body.firstChild)
    }
    const o = document.getElementById("hamburger"),
        s = document.getElementById("sidebar"),
        c = document.getElementById("overlay");
    document.querySelectorAll(".nav-links a").forEach(e => {
        e.addEventListener("click", t => {
            t.preventDefault();
            const n = e.dataset.page;
            o && o.classList.remove("active"), s && s.classList.remove("open"), c && c.classList.remove("visible"), document.body.style.overflow = "", a(n)
        })
    }), o && o.addEventListener("click", () => {
        const e = o.classList.toggle("active");
        s && s.classList.toggle("open", e), c && c.classList.toggle("visible", e), o.setAttribute("aria-expanded", e ? "true" : "false"), document.body.style.overflow = e ? "hidden" : ""
    }), c && c.addEventListener("click", () => {
        o && o.classList.remove("active"), s && s.classList.remove("open"), c && c.classList.remove("visible"), document.body.style.overflow = ""
    });
    //const l = document.querySelector(".main-content") || document.getElementById("content");
    //if (l) {
    //    const e = window.getComputedStyle(l).paddingTop;
    //    (!e || parseInt(e, 10) < 10) && (l.style.paddingTop = "68px", l.style.boxSizing = "border-box")
    //}

    // START OPTYMALIZACJI
    const loader = document.getElementById("loader");
    a("pages/home.html");
    // Dajemy przeglądarce 50ms na "namalowanie" treści pod spodem, zanim usuniemy loader
    setTimeout(() => {
        if (loader) loader.classList.add("hidden");
    }, 50);

    if (window.requestIdleCallback) {
        window.requestIdleCallback(() => n());
    } else {
        setTimeout(n, 2000);
    }
    localStorage.setItem("loaderShown", "true");
});
