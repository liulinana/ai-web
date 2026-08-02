# Mostar City Cinematic Scroll — Design Spec

**Date:** 2026-08-02  
**Project path:** `/Users/admin/Desktop/portfolio-landing-v2`  
**Approach:** Fresh Vue 3 + Vite + TypeScript rewrite that 100% recreates the “Mostar city” prompt (visuals, DOM order, CSS values, scroll math). Replaces the prior React portfolio landing direction for this repo.

## Goals

- Single standalone cinematic scroll page titled **Mostar city**
- Pixel/behavior fidelity to the provided prompt (verbatim CSS variables, scroll segments, slider logic)
- Tech showcase stack: **TypeScript + Vite + Vue 3**
- All images and the display font loaded from the **remote URLs in the prompt** (no local binary assets)

## Non-goals

- Multi-route app / CMS / backend
- Real i18n (language switcher is visual-only)
- Tailwind, GSAP, Framer Motion, or other animation libraries
- Approximating prompt values — numbers, copy, and URLs must match exactly
- Continuing the previous Michael Smith portfolio React design in this repo

## Confirmed decisions

| Topic | Decision |
|-------|----------|
| Repo scope | **A** — full replace; prior portfolio design/plan docs are obsolete |
| Animation engine | **A** — `useCinemaScroll` composable with prompt-faithful rAF + CSS custom properties on `document.documentElement` |
| Styles | **A** — single global `src/styles.css` verbatim port of prompt CSS (+ `@font-face` for Ogg Medium) |
| Architecture | **Approach 1** — one `CinemaScroll.vue` owning the exact DOM tree; data-driven sight cards; composable for motion |

---

## Architecture

### Tech stack

- Vue 3 (Composition API + `<script setup lang="ts">`)
- Vite
- TypeScript
- Plain CSS (one global stylesheet)
- No UI / motion libraries

### Directory layout

```
portfolio-landing-v2/
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  src/
    main.ts
    App.vue
    styles.css
    assets.ts
    data/
      sights.ts
    components/
      CinemaScroll.vue
    composables/
      useCinemaScroll.ts
  docs/superpowers/specs/
    2026-08-02-mostar-cinema-scroll-design.md
```

Prior portfolio landing design/plan docs for this repo have been removed.

### Module responsibilities

| Unit | Responsibility | Depends on |
|------|----------------|------------|
| `index.html` | `lang`, charset, viewport, title, description, empty favicon `data:,`, `#app` mount | Vite entry |
| `main.ts` | createApp, mount, import global CSS | `App.vue`, `styles.css` |
| `App.vue` | Render only `<CinemaScroll />` | `CinemaScroll.vue` |
| `CinemaScroll.vue` | Exact prompt DOM tree and source/paint order; template refs for section/track/controls/nav | `sights.ts`, `assets.ts`, `useCinemaScroll` |
| `useCinemaScroll.ts` | Scroll distance, mouse parallax, rAF `update()`, CSS variable writes, infinite slider setup/normalize | DOM refs |
| `styles.css` | Prompt `:root`, layout, layers, media queries, reduced-motion; `@font-face` `"Ogg Medium"` | remote font URL |
| `assets.ts` | Scene image URLs + font URL constants | — |
| `sights.ts` | Five sight-card records (aria-label, kicker, h3, p, pin URL) | icon URLs |

---

## Remote assets (only allowed sources)

**Font — family name must be `"Ogg Medium"`**

`https://dcym8fthxf5uu.cloudfront.net/fonts/247a073c-29f5-4a89-aa3a-741020f346fc/OggText-Medium.woff2`

**Scene photographs**

| Role | Class / usage | URL |
|------|---------------|-----|
| Sky | `.sky-img` | `https://raft-blast-61784561.figma.site/_assets/v11/16b5007d9c93971e26ffe4e0e3e37946f6bd538c.png` |
| Back four glow | `.back-four` | `https://raft-blast-61784561.figma.site/_assets/v11/8a7f8af50e0ce92ec2e228e7b0b4112178c51cf1.png` |
| Bazaar mid-back | `.back-bazaar` | `https://raft-blast-61784561.figma.site/_assets/v11/864afe00e41e2fa20a5aa546e15cb807e0f81384.png` |
| Splitframe LEFT | `.splitframe-left` | `https://raft-blast-61784561.figma.site/_assets/v11/7536d7b60a1fce482cf6edf3f0bffd3bad5d0f8a.png` |
| Splitframe RIGHT | `.splitframe-right` | `https://raft-blast-61784561.figma.site/_assets/v11/392db6a6a6b98e868bd7f8d3f55bb719d51e5028.png` |
| Bridge | `.bridge-img` | `https://raft-blast-61784561.figma.site/_assets/v11/c6a6d8ef49bca43f708aa852692942c45ec950d4.png` |
| Frame-two river | `.frame-two-img` | `https://raft-blast-61784561.figma.site/_assets/v11/ba75252bab2b1c510987b74837770f7bc8a6b2d4.png` |

**Sight pin icons**

| Icon | URL |
|------|-----|
| icon1 | `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_230438_d526b8b6-8a2e-4e3b-9993-3908acae03a7.png` |
| icon2 | `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_230442_140bc25b-b165-4249-904a-f708bff6970e.png` |
| icon3 | `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_230448_825949c9-ccdb-4857-b4a6-e349eccc9010.png` |

Card → pin mapping: 1→icon1, 2→icon2, 3→icon3, 4→icon1, 5→icon2.

Favicon: `<link rel="icon" href="data:," />`

---

## DOM contract

Source order **is** paint order for equal z-index. `CinemaScroll.vue` must emit this tree (class names and landmarks unchanged):

```
main.site-shell
└─ section.cinema-scroll#cinema  [aria-label="Mostar cinematic scroll story"]
   └─ div.stage
      ├─ div.world
      │  ├─ img.scene-img.sky-img
      │  ├─ header.site-header
      │  ├─ div.back-stack
      │  │  ├─ img.back-four
      │  │  ├─ section.sights-slider → div.sights-track → sight cards
      │  │  └─ img.back-bazaar
      │  ├─ div.sights-controls → prev / next
      │  ├─ h1.hero-title "MOSTAR"
      │  ├─ img.splitframe-left / img.splitframe-right
      │  ├─ img.bridge-img
      │  ├─ img.frame-two-img
      │  └─ div.shade
      ├─ section.intro-copy
      ├─ section.story-panel.story-panel-bridge
      └─ section.story-panel.story-panel-bazaar
```

All `img.scene-img` use `alt=""`.

**Sight cards (initial five, then cloned ×3 in JS):** each  
`span.sight-kicker` → `img.sight-pin` → `h3` → `p`, with `tabindex="0"` `role="button"`.

Copy for intro, story panels, facts, note button, and the five sights must match the prompt verbatim.

---

## CSS contract

- Port the prompt’s `:root` block and every positioning / media-query rule into `src/styles.css` without value drift.
- Add `@font-face { font-family: "Ogg Medium"; src: url(<remote woff2>) format("woff2"); font-weight: 500; font-style: normal; font-display: swap; }` (or equivalent that still exposes the family name `"Ogg Medium"` for logo, title, panel headings, fact `dt`).
- Import from `main.ts` (or `App.vue`) so styles are global — not scoped.

---

## Animation engine (`useCinemaScroll`)

### Inputs

Template refs: `.cinema-scroll` section, `.sights-track`, `.sights-controls`, `.sight-prev`, `.sight-next`, and the **original** `.sight-card` list before cloning (or the five seed cards from data).

### Helpers (exact)

`clamp`, `smoothstep`, `lerp`, `segmentInOut`, `getScrollDistance` — same formulas as the prompt.

### Per-frame behavior

- Smooth scroll toward target (`lerp` 0.14) unless reduced-motion or first frame
- Mouse parallax (`lerp` 0.12) unless reduced-motion (`--mx`/`--my` forced to `0`)
- Segment windows: frame2 `560–1620`, frame3 `1760–2700`, sights enter `2760–3560`, controls `3360–3660`, intro exit `90–650`, progress `/2700`
- Write every listed CSS custom property with the same expressions and string formatting as the prompt
- Re-request rAF while scroll/mouse deltas exceed thresholds; `rafPending` guard

### Slider

- `setupSightSlider`: 3 identical sets (15 cards), `activeSight = originalCount`, click / Enter / Space, `transitionend` → `normalizeSightSlider`
- `updateSightSlider` / `moveSightSlider` / `selectSightCard` / `jumpSightSlider` / `normalizeSightSlider` — exact prompt behavior including `.is-jumping`

### Lifecycle

- Mount: setup slider, listeners (`scroll`/`resize`/`pointermove` passive where specified), `requestTick`
- Unmount: remove listeners, cancel rAF

---

## Choreography acceptance criteria

Scrubbing ~3700px through the sticky stage must produce, in order:

1. **0–650px:** `MOSTAR` rises `-210px`, scales to `0.92`, fades; intro + 3 cream pills sink `+90px` and fade; pointer parallax on sky/back/bridge/splitframes.
2. **560–1620px:** bridge widens `67.2vw → 105vw`, bottom `5vh → -8vh`, then launches `-760px` with scale `+0.46`; splitframes part ∓`46vw` (`enter^1.5`), rise `-180px`, scale `+0.74`; frame-two fades in; blur `14px`, brightness drop ~25.5%, shade alphas `0.465 / 0.42 / 0.51`; bridge story panel at `top:60%` with `+58px → -86px` slide.
3. **1760–2700px:** bazaar saturation `+0.18`; bazaar panel at `top:29%` with same slide + note pill.
4. **2760–3560px:** sights fly in from `420vw` (`enter^1.55`); visible past `0.01`; scale `1/backScale`; top solved to screen `clamp(innerHeight*0.19, 112, 220) - 50`.
5. **3360–3660px:** ← → fade in at `left:48px`; clickable only past `0.98`; 640ms cubic-bezier track + seamless 3-set loop.
6. **`prefers-reduced-motion`:** no scroll inertia / parallax; layer CSS transitions disabled; scrub still works.

---

## Error handling & a11y

- Remote asset failures: no custom fallback UI required; broken images must not break scroll math.
- Landmarks, aria-labels, and keyboard activation for sight cards follow the prompt.
- Reduced-motion media query honored in both CSS and JS.

## Testing

- Manual choreography scrub against acceptance criteria (desktop + narrow breakpoints 1500 / 1100 / 640).
- Optional: unit-test pure helpers (`clamp`, `smoothstep`, `lerp`, `segmentInOut`) if added in a tiny `math.ts` extract — not required for v1 if helpers stay private inside the composable.

## Implementation notes

- Vue is a thin shell: DOM structure and CSS/JS math stay prompt-identical.
- Do not rewrite motion as Vue reactive style bindings; keep imperative CSS variable writes.
- Sight seed markup may use `v-for` over `sights.ts`, but after `setupSightSlider` the track contents are the cloned set managed by the composable (same as vanilla `replaceChildren`).
