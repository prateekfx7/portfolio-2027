# Prateekfx — Portfolio Recreation

This repository contains the exact, 1:1 reverse-engineered recreation of [prateekfxx.framer.website](https://prateekfxx.framer.website). Every page, section, typography style, responsive breakpoint, media asset, and interaction has been reconstructed from scratch to production quality.

---

## Architecture & Reverse Engineering Process

The recreation utilized REA (Reverse Engineering Anything) principles and static asset analysis:

1. **Manifest & Route Recovery**:
   - Recovered Framer site ID and route table from `script_main.mjs`:
     - Home route `/` (`augiA20Il`)
     - 404 route `/404` (`sbJLtFq_L`)
2. **Component Source Reconstruction**:
   - Recovered all 55 unminified source files from cloud source maps, reconstructing component definitions for:
     - `ShowReelPlayer` (`Kt8hQnCC0`)
     - `ServicesCard` (`jYitroU4p`)
     - `WorkCard` (`FZfwaRY3L`)
     - `StatsCard` (`tFlEVO4wA`)
     - `ReviewCard` (`VXRQNwaSB`)
     - `PricingCard` (`KUZgwdVYi`)
     - `FAQAccordion` (`fkTc1AxeP`)
     - `Ticker` (`Ticker.js`)
     - `SocialLink` (`VjwbbzSFg`)
3. **Asset Mirroring & Self-Contained Storage**:
   - Downloaded and mapped all 14 MP4 high-resolution videos into `/public/assets/videos/`.
   - Downloaded and mapped all 18 PNG/SVG brand and testimonial images into `/public/assets/images/`.
   - Extracted and localized 4 Lottie JSON animation files into `/public/assets/lottie/`.
   - Localized `Instrument Serif` and `Inter` font assets in `/public/assets/fonts/`.
4. **Interactive Behaviors**:
   - **FAQ Accordion**: Smooth click-to-expand with animated chevron icon rotation and custom styling.
   - **Showreel Player**: Interactive play overlay with hover state; clicking plays the showreel video with audio, with click-to-pause support.
   - **Infinite Logo Ticker**: Continuous, smooth 60fps marquee animation looping 5 partner brand logos.
   - **Showcase Video Autoplay**: IntersectionObserver automates seamless playback of muted looping video reels as they enter the viewport.
   - **Navigation & CTAs**: Smooth scrolling to section anchors (`#services-section`, `#selected-work-section`, `#pricing-section`) and Calendly booking links (`https://calendly.com/prateekmaurya862/30min`).

---

## Project Structure

```
├── .reverse-engineering/     # Raw dumps, AST sources, and extracted component files
├── dist/                     # Optimized production build ready for deployment
├── public/
│   ├── assets/
│   │   ├── fonts/            # Instrument Serif & Inter woff2 font files
│   │   ├── images/           # Brand, testimonial, and badge PNG/SVG assets
│   │   ├── js/               # lottie.min.js
│   │   ├── lottie/           # Lottie JSON animations
│   │   └── videos/           # 14 MP4 portfolio and showreel videos
│   ├── css/
│   │   ├── fonts.css         # Font family definitions & web font fallback
│   │   ├── breakpoints.css   # Responsive layout media query rules
│   │   ├── layout.css        # Main page styles & component CSS
│   │   ├── layout-404.css    # 404 page layout CSS
│   │   └── custom.css        # Interactive overrides, animations, and marquee
│   └── js/
│       └── main.js           # Client interactions (accordion, video, lottie, smooth scroll)
├── index.html                # Home page (100% exact layout)
├── 404.html                  # 404 Not Found page
├── package.json              # Scripts & Vite setup
└── vite.config.js            # Build configuration
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

