# Kianna Ivan Marie Lim — Portfolio

> A cinematic, card-inspired web developer portfolio built with zero framework overhead — enchanted-card art direction, editorial serif typography, and tactile micro-interactions.

Live at: [https://kanglimchu.netlify.app/](https://kanglimchu.netlify.app/)

---

## ✦ The "Skymage" Aesthetic

Two complete interface personalities, switchable live from the header and remembered in `localStorage`:

### 1 · Skymage — enchanted cardistry (default)

- **Aeris-inspired art direction** — a deep navy void, cyan rim light, hairline etched frames, and four-point star motifs. Every motif is original CSS/SVG; no third-party game assets are used.
- **Three collectible colourways** — **Azure**, **Rose**, and **Amethyst** — driven by CSS custom properties.
- **Player-card hero** with cursor-tracked foil, subtle parallax tilt, and a slow floating stage.
- **Cardistry interactions**: dealt-in section reveals, a re-dealing project filter, pointer-tracked sheen and 3D tilt on project cards, engraved plaques, and a cursor star-dust trail.

### 2 · Minimal — quiet editorial

- **Paper-white canvas**, single blue accent, hairline rules, and pure Inter typography (Bodoni is dropped entirely).
- **No arcana**: no nebula, no grain, no glow, no tilt, no dust — the portrait becomes a plain captioned frame and motion reduces to opacity fades.
- **Editorial section indices** (01 – 04) and generous whitespace replace the arcane furniture.

### Shared

- **Typography**: **Bodoni Moda** display, **Inter** body, **JetBrains Mono** metadata (Minimal mode drops the display face).
- **Motion safety**: honours `prefers-reduced-motion`; all effects are CSS transforms plus a small vanilla JS layer.
- **Performance & Standards**:
  - 0 KB external framework runtime (pure semantic HTML5, CSS3, and vanilla JS).
  - Lighthouse **100 / 100 / 100** (Accessibility, Best Practices, SEO) in both modes.
  - Full Schema.org JSON-LD structured data graph.
  - WCAG AA contrast in both skins, visible focus states, and keyboard-operable controls.

---

## ✦ Projects

1. **Beyond the Brew — POS / Management Information System**
   - Coffee shop point-of-sale platform coordinating orders, discounts, and real-time inventory through a normalized MySQL database.
2. **Computer Rental & Sales Management System**
   - Database application managing workstation session timers, peripheral inventory, and customer sales via PHP 8 & MySQL on WampServer.
3. **Personal Portfolio Website**
   - High-performance, accessible portfolio built with modern CSS custom properties, three selectable colourways, responsive design, and native card-tilt interactions.

---

## ✦ Local Development

Run with any local HTTP server:
```bash
python -m http.server 8000
```
Open `http://localhost:8000` in your browser.

---

## ✦ Colophon

- **Developer**: Kianna Ivan Marie Lim
- **College**: Data Center College of the Philippines (DCCP) &bull; Baguio City
- **Degree**: Bachelor of Science in Information Technology (BSIT)
- **License**: MIT
