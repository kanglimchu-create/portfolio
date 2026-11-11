/* ==========================================================================
   KIANNA LIM — PORTFOLIO SCRIPT
   "Skymage" interactions: colourways, card tilt, deal-in reveals, sparks.
   Vanilla JS only — no dependencies.
   ========================================================================== */

(function () {
  "use strict";

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ==========================================================================
  // 01. INTERFACE MODE ENGINE (MINIMAL / SKYMAGE) + COLOURWAYS
  // ==========================================================================
  const VARIANTS = ["azure", "rose", "amethyst"];
  const VARIANT_THEME_COLOURS = { azure: "#05081a", rose: "#0e0510", amethyst: "#07051a" };
  const variantButtons = $$(".variant-gem");
  const variantSwitcher = $("#variantSwitcher");
  const modeButtons = $$(".mode-btn");
  const footerCode = $("#footerCode");

  let currentMode = "skymage";
  let currentVariant = "azure";

  function syncThemeColour() {
    const metaTheme = $('meta[name="theme-color"]');
    if (!metaTheme) return;
    metaTheme.setAttribute(
      "content",
      currentMode === "minimal" ? "#fbfbfd" : VARIANT_THEME_COLOURS[currentVariant]
    );
  }

  function applyVariant(variant, announce) {
    currentVariant = VARIANTS.includes(variant) ? variant : "azure";

    document.documentElement.setAttribute("data-variant", currentVariant);

    try {
      localStorage.setItem("kiml_variant", currentVariant);
    } catch (e) {
      /* storage may be blocked — the visual switch still works */
    }

    variantButtons.forEach((btn) => {
      const active = btn.dataset.variant === currentVariant;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    syncThemeColour();

    if (announce && currentMode === "skymage") {
      triggerToast(`${currentVariant.charAt(0).toUpperCase() + currentVariant.slice(1)} cardistry variant equipped.`);
    }
  }

  const MODE_FOOTER = {
    skymage: "// Skymage · Cardistry Edition",
    minimal: "// Minimal · Editorial Edition"
  };

  function applyMode(mode, announce) {
    currentMode = mode === "minimal" ? "minimal" : "skymage";
    document.documentElement.setAttribute("data-mode", currentMode);

    try {
      localStorage.setItem("kiml_mode", currentMode);
    } catch (e) {
      /* ignore */
    }

    modeButtons.forEach((btn) => {
      const active = btn.dataset.mode === currentMode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    // Colourways only exist in the cardistry skin.
    if (variantSwitcher) variantSwitcher.hidden = currentMode === "minimal";

    if (footerCode) footerCode.textContent = MODE_FOOTER[currentMode];

    // Reset any pointer-driven tilt so nothing is left frozen mid-perspective.
    $$("[data-tilt]").forEach((card) => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });

    syncThemeColour();

    if (announce) {
      triggerToast(
        currentMode === "minimal"
          ? "Minimal interface — editorial mode engaged."
          : "Skymage interface — cardistry mode engaged."
      );
    }
  }

  let savedMode = null;
  let savedVariant = null;
  try {
    savedMode = localStorage.getItem("kiml_mode");
    savedVariant = localStorage.getItem("kiml_variant");
  } catch (e) {
    savedMode = null;
    savedVariant = null;
  }

  applyVariant(savedVariant || "azure", false);
  applyMode(savedMode || "skymage", false);

  variantButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("active")) return;
      applyVariant(btn.dataset.variant, true);
    });
  });

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("is-active")) return;
      applyMode(btn.dataset.mode, true);
    });
  });

  // ==========================================================================
  // 02. DEAL-IN REVEALS
  // ==========================================================================
  const revealTargets = $$(
    ".project-aesthetic-card, .skill-category-card, .skills-proof-tray, .about-aesthetic-card, .contact-aesthetic-card"
  );

  const groupCounters = new Map();
  revealTargets.forEach((el) => {
    el.classList.add("reveal");
    const parent = el.parentElement;
    const index = groupCounters.get(parent) || 0;
    groupCounters.set(parent, index + 1);
    el.dataset.revealIndex = String(index);
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-dealt"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = Math.min(Number(el.dataset.revealIndex || 0), 6) * 75;
          window.setTimeout(() => el.classList.add("is-dealt"), delay);
          revealObserver.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  // ==========================================================================
  // 03. CARD TILT + CURSOR FOIL
  // ==========================================================================
  if (hasFinePointer && !prefersReducedMotion) {
    $$("[data-tilt]").forEach((card) => {
      const maxTilt = parseFloat(card.dataset.tiltMax || "6");
      let frame = 0;

      card.addEventListener("pointermove", (event) => {
        if (currentMode !== "skymage") return;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const rect = card.getBoundingClientRect();
          const px = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
          const py = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);

          card.style.setProperty("--rx", ((0.5 - py) * maxTilt).toFixed(2) + "deg");
          card.style.setProperty("--ry", ((px - 0.5) * maxTilt).toFixed(2) + "deg");
          card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
          card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        });
      });

      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  // ==========================================================================
  // 04. PROJECT FILTERING (re-deal the hand)
  // ==========================================================================
  const filterPills = $$(".filter-pill");
  const projectCards = $$(".project-aesthetic-card");
  const projectsGrid = $(".projects-grid");

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const filter = pill.dataset.filter || "all";

      filterPills.forEach((p) => {
        p.classList.remove("active");
        p.setAttribute("aria-pressed", "false");
      });
      pill.classList.add("active");
      pill.setAttribute("aria-pressed", "true");

      if (projectsGrid) projectsGrid.dataset.filter = filter;

      projectCards.forEach((card) => {
        const category = card.dataset.category || "";
        const matches = filter === "all" || category.includes(filter);

        if (matches) {
          card.removeAttribute("hidden");
          // Force a reflow so the incoming transition replays after a filter swap.
          void card.offsetWidth;
          card.classList.remove("is-out");
        } else {
          card.classList.add("is-out");
          window.setTimeout(() => {
            if (card.classList.contains("is-out")) card.setAttribute("hidden", "");
          }, 220);
        }
      });
    });
  });

  // ==========================================================================
  // 05. INTERACTIVE TOOL PROOF TRAY
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
        toolFadeTimer = window.setTimeout(() => {
          toolDisplayText.textContent = context;
          toolDisplayText.style.opacity = "1";
        }, 80);
      }
    };

    btn.addEventListener("click", handleActivate);
    btn.addEventListener("mouseenter", handleActivate);
  });

  // ==========================================================================
  // 06. PROJECT DETAILS MODAL
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
      title: "Computer Rental &amp; Sales Management System",
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
        "Three collectible colourways (Azure, Rose, Amethyst) driven by CSS custom properties.",
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
    } else {
      projectModal.setAttribute("open", "");
    }
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.style.transform = "translateY(14px) scale(0.98)";
    projectModal.style.opacity = "0";
    window.setTimeout(() => {
      projectModal.close();
      projectModal.style.transform = "";
      projectModal.style.opacity = "";
    }, 180);
  }

  $$("[data-modal]").forEach((btn) => {
    btn.addEventListener("click", () => openProjectModal(btn.dataset.modal));
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
  // 07. COPY EMAIL & TOAST
  // ==========================================================================
  const copyEmailBtn = $("#copyEmailBtn");
  const copyLabel = $("#copyLabel");
  const aestheticToast = $("#aestheticToast");
  const toastMsg = $("#toastMsg");
  const emailBox = copyEmailBtn ? copyEmailBtn.closest(".email-box") : null;
  let toastTimer;

  function triggerToast(message) {
    if (!aestheticToast || !toastMsg) return;
    toastMsg.textContent = message;
    aestheticToast.classList.add("active");

    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      aestheticToast.classList.remove("active");
    }, 2800);
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

        if (copyLabel) copyLabel.textContent = "Copied";
        if (emailBox) emailBox.classList.add("is-copied");
        triggerToast("Card drawn — email copied: kanglimchu@gmail.com");

        window.setTimeout(() => {
          if (copyLabel) copyLabel.textContent = "Copy";
          if (emailBox) emailBox.classList.remove("is-copied");
        }, 1600);
      } catch (e) {
        triggerToast("Email: kanglimchu@gmail.com");
      }
    });
  }

  // ==========================================================================
  // 08. CURSOR STAR DUST
  // ==========================================================================
  if (hasFinePointer && !prefersReducedMotion) {
    const glyphs = ["✦", "✧", "·"];
    let lastTime = 0;
    let lastX = -100;
    let lastY = -100;

    document.addEventListener(
      "pointermove",
      (event) => {
        if (currentMode !== "skymage") return;
        const now = performance.now();
        const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
        if (now - lastTime < 75 || distance < 26) return;

        lastTime = now;
        lastX = event.clientX;
        lastY = event.clientY;

        const spark = document.createElement("span");
        spark.className = "spark-trail";
        spark.setAttribute("aria-hidden", "true");
        spark.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        spark.style.left = event.clientX + "px";
        spark.style.top = event.clientY + "px";
        document.body.appendChild(spark);

        const driftX = (Math.random() * 26 - 13).toFixed(0);
        const driftY = (-18 - Math.random() * 18).toFixed(0);
        const spin = (Math.random() * 140 - 70).toFixed(0);

        const animation = spark.animate(
          [
            { opacity: 0.85, transform: "translate(-50%, -50%) scale(1) rotate(0deg)" },
            {
              opacity: 0,
              transform: `translate(-50%, -50%) translate(${driftX}px, ${driftY}px) scale(0.2) rotate(${spin}deg)`
            }
          ],
          { duration: 820, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        );

        if (animation && animation.finished) {
          animation.finished.then(() => spark.remove()).catch(() => spark.remove());
        } else {
          window.setTimeout(() => spark.remove(), 900);
        }
      },
      { passive: true }
    );
  }

  // ==========================================================================
  // 09. NAVIGATION SCROLL SPY & YEAR
  // ==========================================================================
  const navLinks = $$(".nav-link");
  const sections = navLinks
    .map((link) => {
      const href = link.getAttribute("href");
      return href && href.startsWith("#") ? $(href) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((section) => scrollObserver.observe(section));
  }

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
