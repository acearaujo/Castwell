import "./style.css";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";

const howGlideEl = document.querySelector("#how-glide");

/**
 * HOW IT WORKS slider
 */
const howEl = document.querySelector("#how-glide");
let howGlide = null;

if (howEl) {
  howGlide = new Glide("#how-glide", {
    type: "carousel",
    startAt: 0,
    gap: 0,
    perView: 3,
    bound: true,
    animationDuration: 900,
    autoplay: 6000,
    hoverpause: true,
    dragThreshold: 60,
    swipeThreshold: 60,
    peek: { before: 0, after: 80 },
    breakpoints: {
      1024: { perView: 2, peek: { before: 0, after: 60 } },
      640: { perView: 1, peek: { before: 0, after: 40 } },
    },
  });

  howGlide.mount();

  // Controls only for this slider
  const prevBtn = document.getElementById("howPrev");
  const nextBtn = document.getElementById("howNext");

  prevBtn?.addEventListener("click", () => howGlide?.go("<"));
  nextBtn?.addEventListener("click", () => howGlide?.go(">"));
}

/**
 * BREAKTHROUGH slider
 */
const breakEl = document.querySelector("#break-glide");
let breakGlide = null;

if (breakEl) {
  breakGlide = new Glide("#break-glide", {
    type: "carousel",
    focusAt: "center",
    perView: 3,
    gap: 24,
    autoplay: false,
    animationDuration: 500,
    breakpoints: {
      1023: { perView: 2 },
      767: { perView: 1 },
    },
  });

  breakGlide.mount();
}

/**
 * MOBILE DRAWER (menu)
 * Fix: define toggleBtn/drawer + openDrawer, and keep class "is-open" on .drawer
 */
const toggleBtn = document.getElementById("navToggle");
const drawer = document.getElementById("mobileDrawer");

function openDrawer() {
  if (!drawer || !toggleBtn) return;

  drawer.hidden = false; // must be visible before animating

  // next frame so transition runs
  requestAnimationFrame(() => drawer.classList.add("is-open"));

  toggleBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  if (!drawer || !toggleBtn) return;

  drawer.classList.remove("is-open");
  toggleBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";

  // wait for transition then hide
  window.setTimeout(() => {
    drawer.hidden = true;
  }, 260);
}

toggleBtn?.addEventListener("click", () => {
  const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
  isOpen ? closeDrawer() : openDrawer();
});

drawer?.addEventListener("click", (e) => {
  const target = e.target;

  // close buttons / overlay
  if (
    target instanceof HTMLElement &&
    target.hasAttribute("data-drawer-close")
  ) {
    closeDrawer();
    return;
  }

  // close when clicking a nav link
  if (target instanceof HTMLAnchorElement) {
    closeDrawer();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

// Scrollspy: highlight current section in nav links
const navLinks = document.querySelectorAll('a[href^="#"]');
const sections = [];

navLinks.forEach((link) => {
  const id = link.getAttribute("href").slice(1);
  const section = document.getElementById(id);
  if (section) sections.push(section);
});

function setActive(id) {
  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", active);
    active
      ? link.setAttribute("aria-current", "page")
      : link.removeAttribute("aria-current");
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible?.target?.id) {
      setActive(visible.target.id);
    }
  },
  {
    rootMargin: "-40% 0px -40% 0px",
    threshold: 0.15,
  }
);

sections.forEach((section) => observer.observe(section));
