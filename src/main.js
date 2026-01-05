import "./style.css";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";

/* ---------------------------
   Helpers
---------------------------- */
function $(sel, root = document) {
  return root.querySelector(sel);
}
function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

/* ---------------------------
   Sliders
---------------------------- */
function initHowSlider() {
  const el = $("#how-glide");
  if (!el) return;

  const glide = new Glide("#how-glide", {
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

  glide.mount();

  $("#howPrev")?.addEventListener("click", () => glide.go("<"));
  $("#howNext")?.addEventListener("click", () => glide.go(">"));
}

function initBreakSlider() {
  const el = $("#break-glide");
  if (!el) return;

  const glide = new Glide("#break-glide", {
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

  glide.mount();
}

/* ---------------------------
   Mobile drawer
---------------------------- */
function initDrawer() {
  const toggleBtn = $("#navToggle");
  const drawer = $("#mobileDrawer");
  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add("is-open"));
    toggleBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("is-open");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    window.setTimeout(() => {
      drawer.hidden = true;
    }, 260);
  }

  toggleBtn.addEventListener("click", () => {
    const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
    isOpen ? closeDrawer() : openDrawer();
  });

  drawer.addEventListener("click", (e) => {
    const target = e.target;

    if (
      target instanceof HTMLElement &&
      target.hasAttribute("data-drawer-close")
    ) {
      closeDrawer();
      return;
    }

    if (target instanceof HTMLAnchorElement) {
      closeDrawer();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
}

/* ---------------------------
   Scrollspy
---------------------------- */
function initScrollSpy() {
  const navLinks = $all('a[href^="#"]');
  if (!navLinks.length) return;

  const sections = navLinks
    .map((link) => link.getAttribute("href")?.slice(1))
    .filter(Boolean)
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

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

      if (visible?.target?.id) setActive(visible.target.id);
    },
    {
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0.15,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------------------
   Scroll reveal animations
---------------------------- */
function initReveals() {
  // Only enable "start hidden" styles when JS is active
  document.documentElement.classList.add("js");

  const revealItems = $all(".reveal, .reveal-stagger");
  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
  );

  revealItems.forEach((el) => observer.observe(el));
}

/* ---------------------------
   Boot
---------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  initHowSlider();
  initBreakSlider();
  initDrawer();
  initScrollSpy();
  initReveals();
});
