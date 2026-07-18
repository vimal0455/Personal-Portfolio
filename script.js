const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");
const year = document.querySelector("#year");
const cursorGlow = document.querySelector(".cursor-glow");
const revealItems = document.querySelectorAll(".reveal");
const tiltItems = document.querySelectorAll("[data-tilt]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector(".form-status");
const backToTop = document.querySelector("[data-back-to-top]");
const typingText = document.querySelector("[data-typing-text]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (typingText) {
  const phrase = typingText.dataset.typingText;

  if (prefersReducedMotion.matches) {
    typingText.textContent = phrase;
  } else {
    let index = 0;
    const typeTitle = () => {
      typingText.textContent = phrase.slice(0, index);
      index += 1;

      if (index <= phrase.length) {
        window.setTimeout(typeTitle, 42);
      }
    };

    window.setTimeout(typeTitle, 360);
  }
}

const closeNavigation = () => {
  siteNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
};

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
  }
});

const updateScrollState = () => {
  const isScrolled = window.scrollY > 12;
  header.classList.toggle("is-scrolled", isScrolled);
  backToTop.classList.toggle("is-visible", window.scrollY > 520);
};

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });

if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    document.body.style.setProperty("--pointer-x", `${event.clientX}px`);
    document.body.style.setProperty("--pointer-y", `${event.clientY}px`);
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    cursorGlow.style.opacity = "1";
  });

  window.addEventListener("pointerleave", () => {
    cursorGlow.style.opacity = "0";
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-38% 0px -56% 0px", threshold: 0 }
  );

  sections.forEach((section) => navObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

tiltItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion.matches) return;
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -6;
    const rotateY = ((x / rect.width) - 0.5) * 6;
    item.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Thanks for reaching out. I will respond soon.";
    contactForm.reset();
  });
}

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
