/* Kianna's portfolio interactions — no framework required */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

$("#year").textContent = new Date().getFullYear();

// Reveal sections gently as they enter the viewport.
const revealItems = $$(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

// Highlight the section currently being viewed.
const navLinks = $$(".nav-link");
const navTargets = navLinks.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
  navTargets.forEach(section => sectionObserver.observe(section));
}

// Project detail pop-up.
const projectInfo = {
  pos: {
    eyebrow: "ACADEMIC SYSTEM PROJECT",
    title: "Beyond the Brew — POS / MIS",
    text: "A coffee shop point-of-sale and management system concept. The goal is to organize order and sales transactions and support day-to-day store operations. Replace this copy with your exact features, modules, and role in the project."
  },
  rental: {
    eyebrow: "DATABASE PROJECT",
    title: "Computer Rental & Sales System",
    text: "A simple system/database project for computer rentals and sales, developed while practicing PHP, MySQL, and WampServer. Update this description with the actual tables, features, and workflows you implemented."
  },
  portfolio: {
    eyebrow: "PERSONAL PROJECT",
    title: "Personal Portfolio Website",
    text: "A responsive website introducing my background, skills, and projects. This version uses HTML, CSS, and JavaScript for the layout, responsive styling, navigation states, and small interactions."
  }
};
const dialog = $("#projectDialog");
$$("[data-project]").forEach(button => {
  button.addEventListener("click", () => {
    const item = projectInfo[button.dataset.project];
    if (!item) return;
    $("#dialogEyebrow").textContent = item.eyebrow;
    $("#dialogTitle").textContent = item.title;
    $("#dialogText").textContent = item.text;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else showToast(item.text);
  });
});
$("#dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

// Toast messages are accessible and replace browser alert pop-ups.
let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
}

// Prevent the sample email from being mistaken for a real contact.
$("#emailLink").addEventListener("click", event => {
  if ($("#emailLink").textContent.includes("example.com")) {
    event.preventDefault();
    showToast("Edit the sample email in index.html before publishing your portfolio.");
  }
});

// Mobile navigation is intentionally kept visible as a horizontal bar in mobile view.
// Keep in-page links smooth and make the selected link easy to see.
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(item => item.classList.remove("active"));
    link.classList.add("active");
  });
});
