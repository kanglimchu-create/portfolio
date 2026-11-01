/* ==========================================================================
   Kianna Lim — Personal IT Portfolio Script
   Design Philosophy: Emil Kowalski Micro-Interactions & Impeccable Motion
   - Fluid segmented control indicator (Linear/Vercel magic move)
   - Dynamic card border spotlight (cursor light reflection)
   - Scroll-triggered reveal orchestrator (sub-320ms spring physics)
   - Morphing copy button state with Sonner spring toast
   - Polished modal dialog with animated entrance and exit
   ========================================================================== */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// ==========================================================================
// 00. Minimalist Editorial Entrance Curtain (Human Craft, Zero AI Slop)
// ==========================================================================
const entranceCurtain = $("#entranceCurtain");
const curtainContent = $("#curtainContent");

function playEntrance() {
  if (!entranceCurtain) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    entranceCurtain.style.display = "none";
    return;
  }

  entranceCurtain.style.display = "flex";
  entranceCurtain.classList.remove("dismissed");
  if (curtainContent) curtainContent.classList.remove("fade-out");

  // Editorial wordmark presence (380ms) -> Silky curtain lift (550ms inertia)
  setTimeout(() => {
    if (curtainContent) curtainContent.classList.add("fade-out");
    setTimeout(() => {
      entranceCurtain.classList.add("dismissed");
      setTimeout(() => {
        entranceCurtain.style.display = "none";
      }, 600);
    }, 100);
  }, 380);
}

// Instant dismiss on click/tap
if (entranceCurtain) {
  entranceCurtain.addEventListener("click", () => {
    entranceCurtain.classList.add("dismissed");
    setTimeout(() => {
      entranceCurtain.style.display = "none";
    }, 550);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", playEntrance);
} else {
  playEntrance();
}

// Brand badge "K." in header replays it anytime
const brandBadge = $(".brand-badge");
if (brandBadge) {
  brandBadge.style.cursor = "pointer";
  brandBadge.setAttribute("title", "Replay entrance");
  brandBadge.addEventListener("click", (e) => {
    e.preventDefault();
    playEntrance();
  });
}

// ==========================================================================
// 01. Mouse Spotlight Tracker (CSS Variables)
// ==========================================================================
const spotlight = $("#cursorSpotlight");
if (spotlight && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (e) => {
    document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
  }, { passive: true });
}

// ==========================================================================
// 02. Card Border Spotlight Reflection (Linear / Raycast Style)
// ==========================================================================
const spotlightCards = $$(".spotlight-card");
if (window.matchMedia("(pointer: fine)").matches) {
  spotlightCards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--card-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--card-y", `${e.clientY - rect.top}px`);
    }, { passive: true });
  });
}

// ==========================================================================
// 03. Scroll-Triggered Reveal Orchestrator
// ==========================================================================
const revealElements = $$(".reveal-on-scroll");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("revealed"));
}

// ==========================================================================
// 04. Fluid Segmented Control Indicator (Magic Move)
// ==========================================================================
const filterTabs = $$(".filter-tab");
const filterIndicator = $("#filterIndicator");
const projectCards = $$(".project-card");

function moveIndicator(tab, immediate = false) {
  if (!filterIndicator || !tab) return;
  if (immediate) {
    filterIndicator.style.transition = "none";
  } else {
    filterIndicator.style.transition = "";
  }
  filterIndicator.style.transform = `translateX(${tab.offsetLeft}px)`;
  filterIndicator.style.width = `${tab.offsetWidth}px`;
  filterIndicator.classList.add("ready");
}

// Initialize on the active tab
const initialTab = $(".filter-tab.active");
if (initialTab) {
  requestAnimationFrame(() => moveIndicator(initialTab, true));
  if (document.fonts) {
    document.fonts.ready.then(() => {
      const active = $(".filter-tab.active");
      if (active) moveIndicator(active, true);
    });
  }
  window.addEventListener("resize", () => {
    const active = $(".filter-tab.active");
    if (active) moveIndicator(active, true);
  });
}

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.filter;
    filterTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    moveIndicator(tab, false);

    projectCards.forEach((card) => {
      const category = card.dataset.category || "all";
      const matches = filter === "all" || category.includes(filter);

      if (matches) {
        card.style.display = "";
        requestAnimationFrame(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0) scale(1)";
        });
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(8px) scale(0.98)";
        setTimeout(() => {
          if (!matches) card.style.display = "none";
        }, 180);
      }
    });
  });
});

// ==========================================================================
// 05. Navigation Scroll Spy & Dynamic Year
// ==========================================================================
const navLinks = $$(".nav-link");
const sections = navLinks.map((link) => {
  const href = link.getAttribute("href");
  return href.startsWith("#") ? $(href) : null;
}).filter(Boolean);

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });

  sections.forEach((sec) => navObserver.observe(sec));
}

const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ==========================================================================
// 06. Rich Project Details Modal (Smooth Open & Exit Animation)
// ==========================================================================
const projectData = {
  pos: {
    category: "Academic Capstone &bull; MIS",
    title: "Beyond the Brew — POS / MIS",
    desc: "A point-of-sale and management information system tailored for coffee shop service operations, real-time inventory deduction, sales ledger computation, and end-of-day auditing.",
    features: [
      "Real-time order calculation with automated discounts and tax computations",
      "Normalized MySQL relational tables (orders, line items, beverage inventory, cashiers)",
      "Automated stock depletion tracking and low-inventory threshold triggers",
      "Comprehensive end-of-day sales auditing and transaction reconciliation reports"
    ],
    tags: ["POS Architecture", "System Analysis", "MySQL Relational Schema", "UI/UX Flow"]
  },
  rental: {
    category: "Database Application",
    title: "Computer Rental & Sales System",
    desc: "A database-driven application engineered to coordinate computer rental terminal station timers, peripheral inventory supplies, transaction billings, and customer profiles.",
    features: [
      "Dynamic hourly rate computation engine for active station terminals",
      "Relational schema maintaining foreign key referential integrity in InnoDB",
      "CRUD operations for terminal availability, hardware inventory, and customer records",
      "Configured and verified under Apache, PHP 8, and MySQL via WampServer"
    ],
    tags: ["PHP 8.x", "MySQL Relational Design", "WampServer", "CRUD Architecture"]
  },
  portfolio: {
    category: "Web Engineering",
    title: "Personal Portfolio & Creative Showcase",
    desc: "An accessible, high-performance personal portfolio engineered with semantic HTML5, modern CSS, Schema.org JSON-LD, and zero heavy third-party framework overhead.",
    features: [
      "100% valid Schema.org ProfilePage, Person, WebSite & ItemList JSON-LD graph",
      "94% image weight optimization via modern 2x retina WebP with explicit dimensions",
      "Tactile Emil Kowalski inspired micro-interactions and Sonner toast notification",
      "Fully responsive mobile dock navigation with active scroll observation"
    ],
    tags: ["HTML5", "Modern CSS", "Vanilla JavaScript", "Technical SEO"]
  }
};

const modal = $("#projectModal");
const modalTag = $("#modalTag");
const modalTitle = $("#modalTitle");
const modalDesc = $("#modalDesc");
const modalFeatures = $("#modalFeatures");
const modalTags = $("#modalTags");
const modalClose = $("#modalClose");

function closeModal() {
  if (!modal) return;
  modal.style.transform = "scale(0.95)";
  modal.style.opacity = "0";
  setTimeout(() => {
    modal.close();
    modal.style.transform = "";
    modal.style.opacity = "";
  }, 180);
}

$$("[data-project]").forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.dataset.project;
    const data = projectData[key];
    if (!data) return;

    if (modalTag) modalTag.innerHTML = data.category;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;

    if (modalFeatures && data.features) {
      modalFeatures.innerHTML = data.features.map((f) => `<li style="margin-bottom:6px;">&bull; ${f}</li>`).join("");
      modalFeatures.style.display = "block";
    }

    if (modalTags && data.tags) {
      modalTags.innerHTML = data.tags.map((t) => `<span class="tag-badge">${t}</span>`).join("");
      modalTags.style.display = "flex";
    }

    if (modal && typeof modal.showModal === "function") {
      modal.showModal();
    }
  });
});

if (modalClose && modal) {
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  modal.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeModal();
  });
}

// ==========================================================================
// 07. Morphing Copy Button & Emil Kowalski Sonner Spring Toast
// ==========================================================================
let toastTimer;
let copyResetTimer;
const sonnerToast = $("#sonnerToast");
const toastMsg = $("#toastMsg");
const copyBtn = $("#copyEmailBtn");
const copyLabel = $("#copyLabel");

function triggerSonner(message) {
  if (!sonnerToast) return;
  if (toastMsg) toastMsg.textContent = message;
  sonnerToast.classList.add("active");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    sonnerToast.classList.remove("active");
  }, 2400);
}

if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const email = "kanglimchu@gmail.com";
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const input = document.createElement("input");
        input.value = email;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }

      // Morph button state (clipboard -> spring checkmark)
      copyBtn.classList.add("copied");
      if (copyLabel) copyLabel.textContent = "Copied";
      triggerSonner("Email copied to clipboard: kanglimchu@gmail.com");

      clearTimeout(copyResetTimer);
      copyResetTimer = setTimeout(() => {
        copyBtn.classList.remove("copied");
        if (copyLabel) copyLabel.textContent = "Copy";
      }, 2000);
    } catch (e) {
      triggerSonner("Email: kanglimchu@gmail.com");
    }
  });
}

// ==========================================================================
// 08. Interactive Capabilities Tech Proof Tray
// ==========================================================================
const techTiles = $$(".tech-tile");
const techContextText = $("#techContextText");
let techFadeTimer;

if (techTiles.length && techContextText) {
  techTiles.forEach((tile) => {
    const activate = () => {
      if (tile.classList.contains("active")) return;
      techTiles.forEach((t) => t.classList.remove("active"));
      tile.classList.add("active");

      const context = tile.dataset.context;
      if (context) {
        clearTimeout(techFadeTimer);
        techContextText.style.opacity = "0";
        techFadeTimer = setTimeout(() => {
          techContextText.textContent = context;
          techContextText.style.opacity = "1";
        }, 90);
      }
    };

    tile.addEventListener("mouseenter", activate);
    tile.addEventListener("focus", activate);
    tile.addEventListener("click", activate);
  });
}

