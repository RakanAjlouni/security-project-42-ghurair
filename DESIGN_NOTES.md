# Ghurir — Blue × Terracotta UI Redesign

This visual redesign keeps the original three safe security simulations, while upgrading the layout, responsive design and usability.

## What changed

- A light aqua / mist-blue / soft violet design with no dark page or code backgrounds.
- New landing-page hero illustration made with HTML/CSS/SVG (no remote assets needed).
- Refined navigation and unified styling across all three security labs.
- Sticky in-page navigation for six sections on desktop, compact navigation on mobile.
- Light code panels with highlighted vulnerable/fixed lines and Copy code buttons.
- Subtle floating illustration, hover interactions, reveal-on-scroll and reading progress indicator.
- Respect for `prefers-reduced-motion` and visible keyboard focus indicators.
- Corrected Clickjacking page CSS, home, and JavaScript paths.

## Open it

Open `index.html` in a browser, or run a local server from this folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 .

## Files edited

- `index.html`
- `labs/clickjacking.html`
- `labs/origin-validation.html`
- `labs/prototype-pollution.html`
- `assets/css/style.css`
- `assets/js/ui.js` (new, purely visual enhancements)

The original lab behavior scripts (`main.js`, `clickjacking.js`, `origin-validation.js`, `prototype-pollution.js`) are unchanged.

## Palette

- Page background `#EAF2F5`
- Cards `#F4F9F9`
- Soft panels `#DCEEF1`
- Primary accent `#1595A1`
- Violet accent `#8C84D2`
- Text `#294654`
- Vulnerability `#BA606C`
- Fixed/success `#368B78`

All illustrations are HTML/CSS/SVG; no external fonts, images or packages are required.
