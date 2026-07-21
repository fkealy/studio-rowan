import { gsap } from "gsap";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Signal that JS is in control — CSS uses this to set the pre-reveal state,
// so the page degrades gracefully (fully visible) if the script never runs.
document.documentElement.classList.add("js-ready");

const loader = document.getElementById("loader");
const loaderNum = document.getElementById("loaderNum");
const loaderFill = document.getElementById("loaderFill");

let booted = false;

// No-animation reveal. Safety fallback for cases where the entrance never
// runs — e.g. the page is opened in a background tab (requestAnimationFrame,
// and therefore gsap's ticker, is paused) or gsap fails to load. gsap.set is
// synchronous and needs no ticker, so this always lands the final state.
function showInstant() {
  if (booted) return;
  booted = true;
  loader.style.display = "none";
  gsap.set(".line__inner", { clearProps: "transform" });
  gsap.set("[data-reveal]", { opacity: 1, y: 0 });
}

function intro() {
  if (booted) return;
  booted = true;

  // Hide the lockup now (the loader still covers the screen), then reveal it.
  const lines = document.querySelectorAll(".line__inner");
  gsap.set(lines, { yPercent: 110 });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (!reduceMotion) {
    tl.to(loader, { yPercent: -100, duration: 1.0, ease: "power4.inOut" });
  } else {
    gsap.set(loader, { display: "none" });
  }

  tl.to(lines, {
    yPercent: 0,
    duration: 1.2,
    stagger: 0.14,
    clearProps: "transform",
  }, reduceMotion ? 0 : "-=0.55")
    .to("[data-reveal]", {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.08,
    }, "-=0.7");
}

function runLoader() {
  if (reduceMotion) {
    loaderNum.textContent = "100";
    loaderFill.style.width = "100%";
    intro();
    return;
  }
  const state = { v: 0 };
  gsap.to(state, {
    v: 100,
    duration: 1.6,
    ease: "power2.inOut",
    onUpdate() {
      const val = Math.round(state.v);
      loaderNum.textContent = val;
      loaderFill.style.width = val + "%";
    },
    onComplete: intro,
  });
}

// Kick off once fonts are ready so the reveal lands on final type.
if (document.fonts && document.fonts.ready) {
  Promise.race([
    document.fonts.ready,
    new Promise((r) => setTimeout(r, 1200)),
  ]).then(runLoader);
} else {
  window.addEventListener("load", runLoader);
}

// Safety net: a timer (which fires even in a background tab) guarantees the
// page is never left stuck on the loader if the animated entrance can't run.
setTimeout(showInstant, 6000);
