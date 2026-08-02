# Portfolio Landing Page Design Spec

**Date:** 2026-08-02  
**Project path:** `~/Desktop/portfolio-landing-v2`  
**Approach:** Fresh rewrite against the product prompt (not a copy of `portfolio-landing`)

## Goals

Build a dark, single-brand portfolio experience with:

- A full marketing landing page at `/`
- Visually complete placeholder pages at `/work` and `/resume`
- Smooth scroll on home anchors, route transitions between pages
- Stack: React + Vite + TypeScript + Tailwind CSS + GSAP + Framer Motion + hls.js + react-router-dom + tailwindcss-animate

## Non-goals

- Real CMS / backend
- Light mode
- Pixel-perfect mobile QA beyond usable first viewport + nav
- Real resume PDF or authenticated contact form

## Confirmed decisions

| Topic | Decision |
|-------|----------|
| Location | `~/Desktop/portfolio-landing-v2` |
| Routing | Multi-route: `/`, `/work`, `/resume` with page transitions |
| Images | Same Unsplash URLs as existing `portfolio-landing` |
| Subpages | Visually complete layouts with placeholder copy |
| Implementation | Approach 1 — scaffold fresh, implement section-by-section from prompt |

---

## Architecture

### Tech stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`) + `tailwindcss-animate`
- GSAP + ScrollTrigger
- Framer Motion (`AnimatePresence` for loaders, role words, route transitions)
- hls.js for Mux HLS background video
- react-router-dom for routing

### Routes

| Path | Page | Notes |
|------|------|-------|
| `/` | `Index` | Loading overlay + full landing sections |
| `/work` | `Work` | Extended project grid, placeholder copy |
| `/resume` | `Resume` | Experience / Skills / Education placeholders |

### Directory layout

```
src/
  pages/
    Index.tsx
    Work.tsx
    Resume.tsx
  components/
    LoadingScreen.tsx
    Navbar.tsx
    HLSVideo.tsx
    Hero.tsx
    SelectedWorks.tsx
    Journal.tsx
    Explorations.tsx
    Stats.tsx
    Contact.tsx
    SectionHeader.tsx
    GradientBorderButton.tsx   # shared accent-ring hover treatment
  data/
    projects.ts
    journal.ts
    explorations.ts
    resume.ts
  hooks/
    useActiveSection.ts        # home: highlight nav when #home / #works in view
  lib/
    gsap.ts                    # register ScrollTrigger once
    constants.ts               # HLS URL, email, socials
  App.tsx
  main.tsx
  index.css
```

### Shared behaviors

- Forced dark theme; `body` uses `bg-bg text-text-primary`
- Fixed floating Navbar on all routes (outside route exit animation)
- Loading screen only on `/` (Index); `/work` and `/resume` skip it
- Navbar link behavior:
  - **Home** → if already on `/`, smooth-scroll to `#home`; else navigate to `/`
  - **Work** → always navigate to `/work` (does not scroll to Selected Works)
  - **Resume** → always navigate to `/resume`
- Landing section ids: Hero `#home`, Selected Works `#works` (for in-page CTA / future anchors only)
- “Say hi” → `mailto:hello@michaelsmith.com`
- Landing “View all work” → `/work`
- Journal “View all” → `#` placeholder (no journal route in v1)

---

## Design system

### Fonts

Google Fonts: Inter (300–700), Instrument Serif (italic, 400)

- `--font-body` → Tailwind `font-body`
- `--font-display` → Tailwind `font-display`

### CSS variables (HSL channels, no `hsl()` wrapper)

```
--bg: 0 0% 4%;
--surface: 0 0% 8%;
--text: 0 0% 96%;
--muted: 0 0% 53%;
--stroke: 0 0% 12%;
--accent: 0 0% 96%;
```

### Tailwind colors

- `bg`, `surface`, `text-primary`, `muted`, `stroke` mapped via `hsl(var(--*))`

### Accent gradient

`linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)` via `.accent-gradient`  
Used for logo ring, hover borders, progress bars.

### Custom animations (`index.css`)

- `scroll-down` — 1.5s ease-in-out infinite
- `role-fade-in` — 0.4s ease-out
- `gradient-shift` — 6s ease infinite (animated gradient borders)

---

## Landing page (`/`)

### Loading screen

- Full-screen `fixed inset-0 z-[9999] bg-bg`
- rAF counter `000 → 100` over 2700ms
- Top-left “Portfolio” label entrance
- Center rotating words: Design / Create / Inspire (900ms, AnimatePresence `mode="wait"`)
- Bottom-right padded counter in `font-display`
- Bottom accent progress bar with soft blue glow
- On 100: wait 400ms → `onComplete`

### Hero

- HLS: `https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8`
- Video: autoplay, muted, loop, playsInline, cover-centered
- Overlay `bg-black/20` + bottom fade `from-bg`
- Content: COLLECTION '26 · Michael Smith · role cycle · description · CTAs
- Roles every 2s: Creative / Fullstack / Founder / Scholar
- GSAP timeline: `.name-reveal`, `.blur-in` with `power3.out`
- Scroll indicator bottom center

### Navbar

- Fixed top-center pill, blur + `border-white/10` + `bg-surface`
- ScrollY > 100 → stronger shadow
- Logo “JA” circle with accent border (reverses on hover)
- Links: Home, Work, Resume
- “Say hi ↗” with accent hover ring

### Selected Works

- Section header pattern (eyebrow + italic heading + subtext + desktop “View all”)
- Bento `md:grid-cols-12`, spans 7/5/5/7
- Cards: surface, stroke, rounded-3xl, image scale, halftone, hover blur + “View — *Title*”

### Journal

- Same header pattern (“Recent *thoughts*”)
- Four horizontal pills with image, title, read time, date
- “View all” is visual-only (`href="#"`); no `/journal` route in v1

### Explorations

- `min-h-[300vh]` scroll-driven section
- Layer 1: pinned center copy + Dribbble CTA (`pinSpacing: false`)
- Layer 2: two-column parallax of 6 square cards; click opens lightbox
- Cleanup ScrollTrigger on unmount / route leave

### Stats

- Three columns: 20+ Years · 95+ Projects · 200% Satisfied Clients

### Contact / Footer

- Same HLS, vertically flipped (`scale-y-[-1]`), heavier `bg-black/60`
- GSAP marquee: “BUILDING THE FUTURE • ” ×10, `xPercent: -50`, 40s, ease none, repeat -1
- Email CTA with gradient hover ring
- Socials + green pulsing “Available for projects”

---

## Subpages

### `/work`

- Hero: eyebrow “Archive”, heading “All *projects*”, placeholder subtext
- Grid of 6–8 project cards (landing four + placeholders), roughly `md:grid-cols-2`
- Card interactions match Selected Works
- Uses `data/projects.ts`

### `/resume`

- Hero: eyebrow “Profile”, heading “Curriculum *vitae*”
- Blocks: Experience timeline, Skills tag rows, Education
- CTAs: Download CV (`#` placeholder), Say hi mailto
- Uses `data/resume.ts` placeholder content

### Route transitions

- `AnimatePresence mode="wait"` around routed content
- Opacity in/out ~0.4s, ease `[0.25, 0.1, 0.25, 1]`
- Navbar remains mounted outside the exiting tree

---

## Data & media

- Centralize Unsplash URLs and copy in `src/data/*`
- HLS URL and contact constants in `src/lib/constants.ts`
- No local portfolio photography required for v1

## Error handling & lifecycle

- HLS: prefer hls.js when supported; else native HLS `video.src`; destroy instance on unmount
- Autoplay failure must not block UI
- GSAP contexts / ScrollTriggers reverted on unmount to prevent leaks and double-pinning

## Acceptance criteria

1. `npm run dev` works; `npm run build` succeeds
2. Loading → Hero → all landing sections match the prompt visually and motion-wise
3. `/`, `/work`, `/resume` navigate with transitions; Navbar links behave correctly
4. Forced dark theme; Inter + Instrument Serif; accent gradient hovers present
5. Mobile: first viewport and nav usable

## Out of scope follow-ups

- Real CV PDF asset
- CMS-backed projects
- Additional brand personalization beyond Michael Smith placeholders
