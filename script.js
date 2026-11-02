/* ==========================================================================
   KIANNA LIM — PORTFOLIO SCRIPT
   Apple-Style Minimalist Interactions & State
   ========================================================================== */

(function () {
  "use strict";

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  // ==========================================================================
  // 01. DUAL THEME ENGINE (LIGHT / DARK)
  // ==========================================================================
  const themeToggle = $("#themeToggle");
  const themeLabel = $("#themeLabel");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("kiml_theme", theme);
    const metaTheme = $('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", theme === "light" ? "#fbfbfd" : "#000000");
    }
    if (themeLabel) {
      themeLabel.textContent = theme === "light" ? "Light" : "Dark";
    }
  }

  const savedTheme = localStorage.getItem("kiml_theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    applyTheme("light");
  } else {
    applyTheme("dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      triggerToast(`Switched to ${next === "light" ? "Light" : "Dark"} mode.`);
    });
  }

  // ==========================================================================
  // 02. PROJECT FILTERING
  // ==========================================================================
  const filterPills = $$(".filter-pill");
  const projectCards = $$(".project-aesthetic-card");

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const filter = pill.dataset.filter;

      filterPills.forEach((p) => {
        p.classList.remove("active");
        p.setAttribute("aria-pressed", "false");
      });
      pill.classList.add("active");
      pill.setAttribute("aria-pressed", "true");

      projectCards.forEach((card) => {
        const cat = card.dataset.category || "";
        const matches = filter === "all" || cat.includes(filter);

        if (matches) {
          card.style.display = "flex";
          requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          });
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(6px)";
          setTimeout(() => {
            if (card.dataset.category && !card.dataset.category.includes(filter) && filter !== "all") {
              card.style.display = "none";
            }
          }, 180);
        }
      });
    });
  });

  // ==========================================================================
  // 03. INTERACTIVE TOOL PROOF TRAY
  // ==========================================================================
  const toolButtons = $$(".tool-btn");
  const toolDisplayText = $("#toolDisplayText");
  let toolFadeTimer;

  toolButtons.forEach((btn) => {
    const handleActivate = () => {
      if (btn.classList.contains("active")) return;

      toolButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const context = btn.dataset.context;
      if (toolDisplayText && context) {
        clearTimeout(toolFadeTimer);
        toolDisplayText.style.opacity = "0";
        toolFadeTimer = setTimeout(() => {
          toolDisplayText.textContent = context;
          toolDisplayText.style.opacity = "1";
        }, 80);
      }
    };

    btn.addEventListener("click", handleActivate);
    btn.addEventListener("mouseenter", handleActivate);
  });

  // ==========================================================================
  // 04. PROJECT DETAILS MODAL
  // ==========================================================================
  const projectDetails = {
    pos: {
      tag: "ACADEMIC CAPSTONE &bull; MIS",
      title: "Beyond the Brew — POS / Management Information System",
      desc: "A point-of-sale and business management platform designed for coffee shops to coordinate fast-paced order intake, automate discount calculations, and manage beverage inventory through a normalized MySQL database.",
      features: [
        "Real-time ticket calculation with automated discounts and tax computations.",
        "Normalized 3NF relational schema separating orders, line items, and beverages.",
        "Recipe ingredient depletion triggers linking drink orders to bulk inventory.",
        "End-of-day sales auditing and transaction reconciliation reports."
      ],
      tags: ["POS Architecture", "MySQL 8.0", "3NF Schema", "System Analysis"],
      repoUrl: "https://github.com/kanglimchu-create",
      repoLabel: "Inspect on GitHub"
    },
    rental: {
      tag: "DATABASE APPLICATION &bull; PHP & MYSQL",
      title: "Computer Rental & Sales Management System",
      desc: "A transactional database application engineered to manage cybercafé workstation session timers, peripheral equipment loans, and daily transaction ledgers under Apache and WampServer.",
      features: [
        "Dynamic session duration computation engine for active station terminals.",
        "Relational schema enforcing foreign key referential integrity with InnoDB.",
        "Full CRUD operations for station allocations, hardware inventory, and customer sales.",
        "Configured and verified in a local full-stack WampServer environment."
      ],
      tags: ["PHP 8.x", "MySQL", "WampServer", "Session Timers", "CRUD"],
      repoUrl: "https://github.com/kanglimchu-create",
      repoLabel: "Inspect on GitHub"
    },
    portfolio: {
      tag: "WEB CRAFT &bull; TECHNICAL SEO",
      title: "Personal Portfolio Website",
      desc: "An accessible, high-performance personal portfolio built strictly with standard web technologies. Engineered with semantic HTML5, modern CSS custom properties, and zero framework overhead.",
      features: [
        "0 KB external JavaScript frameworks or bloated dependencies.",
        "98+ Google Lighthouse scores across Performance, Accessibility, Best Practices, and SEO.",
        "Dual-theme color system (Light & Dark) with seamless transitions.",
        "Complete Schema.org structured data graph (WebSite, ProfilePage, Person)."
      ],
      tags: ["HTML5", "Modern CSS", "Vanilla JavaScript", "WCAG AA"],
      repoUrl: "https://github.com/kanglimchu-create/portfolio",
      repoLabel: "View Repository on GitHub"
    }
  };

  const projectModal = $("#projectModal");
  const modalTag = $("#modalTag");
  const modalTitle = $("#modalTitle");
  const modalDesc = $("#modalDesc");
  const modalFeatures = $("#modalFeatures");
  const modalTags = $("#modalTags");
  const modalRepoLink = $("#modalRepoLink");
  const modalRepoLabel = $("#modalRepoLabel");
  const modalClose = $("#modalClose");
  const modalDismiss = $("#modalDismiss");

  function openProjectModal(key) {
    const data = projectDetails[key];
    if (!data || !projectModal) return;

    if (modalTag) modalTag.innerHTML = data.tag;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;

    if (modalFeatures) {
      modalFeatures.innerHTML = data.features.map((f) => `<li>${f}</li>`).join("");
    }

    if (modalTags) {
      modalTags.innerHTML = data.tags.map((t) => `<span class="tag">${t}</span>`).join("");
    }

    if (modalRepoLink) {
      modalRepoLink.href = data.repoUrl;
      if (modalRepoLabel) modalRepoLabel.textContent = data.repoLabel;
    }

    if (typeof projectModal.showModal === "function") {
      projectModal.showModal();
    }
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.style.transform = "translateY(12px) scale(0.98)";
    projectModal.style.opacity = "0";
    setTimeout(() => {
      projectModal.close();
      projectModal.style.transform = "";
      projectModal.style.opacity = "";
    }, 180);
  }

  $$("[data-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openProjectModal(btn.dataset.modal);
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeProjectModal);
  if (modalDismiss) modalDismiss.addEventListener("click", closeProjectModal);

  if (projectModal) {
    projectModal.addEventListener("click", (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
    projectModal.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeProjectModal();
    });
  }

  // ==========================================================================
  // 05. COPY EMAIL & TOAST NOTIFICATION
  // ==========================================================================
  const copyEmailBtn = $("#copyEmailBtn");
  const copyLabel = $("#copyLabel");
  const aestheticToast = $("#aestheticToast");
  const toastMsg = $("#toastMsg");
  let toastTimer;

  function triggerToast(message) {
    if (!aestheticToast || !toastMsg) return;
    toastMsg.textContent = message;
    aestheticToast.classList.add("active");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      aestheticToast.classList.remove("active");
    }, 2600);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async () => {
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

        if (copyLabel) copyLabel.textContent = "Copied!";
        triggerToast("Email copied to clipboard: kanglimchu@gmail.com");

        setTimeout(() => {
          if (copyLabel) copyLabel.textContent = "Copy";
        }, 2000);
      } catch (e) {
        triggerToast("Email: kanglimchu@gmail.com");
      }
    });
  }

  // ==========================================================================
  // 06. NAVIGATION SCROLL SPY & DYNAMIC YEAR
  // ==========================================================================
  const navLinks = $$(".nav-link");
  const sections = navLinks.map((link) => {
    const href = link.getAttribute("href");
    return href && href.startsWith("#") ? $(href) : null;
  }).filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
          }
        });
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((sec) => scrollObserver.observe(sec));
  }

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
