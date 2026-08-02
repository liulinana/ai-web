# Mostar Cinema Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Vue 3 + Vite + TypeScript single page that 100% recreates the Mostar cinematic scroll prompt (DOM, CSS, scroll math, infinite slider).

**Architecture:** Thin Vue shell (`App` → `CinemaScroll`) owns the exact DOM tree. Global `styles.css` ports prompt CSS verbatim. `useCinemaScroll` drives rAF + CSS custom properties on `document.documentElement` and the 3-set sight slider — same formulas as the product prompt.

**Tech Stack:** Vue 3, Vite, TypeScript, plain CSS. No Tailwind/GSAP/Framer.

## Global Constraints

- Project path: `/Users/admin/Desktop/portfolio-landing-v2`
- Spec: `docs/superpowers/specs/2026-08-02-mostar-cinema-scroll-design.md`
- Title: `Mostar city`; description: `A cinematic three-screen scroll story for Mostar city.`
- Favicon: `data:,`
- Font family name: `"Ogg Medium"` from the CloudFront woff2 URL in the spec
- All scene/icon URLs exactly as listed in the spec (remote only)
- CSS `:root` variables and media queries must match the product prompt verbatim
- Animation segment windows and variable write expressions must match the product prompt verbatim
- Cinema scroll height: `calc(100vh + 3700px)`
- No multi-route, no i18n logic, no animation libraries

---

## File Structure

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
    vite-env.d.ts
    data/sights.ts
    components/CinemaScroll.vue
    composables/useCinemaScroll.ts
```

---

### Task 1: Scaffold Vite + Vue 3 + TS

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.ts`, `src/App.vue`, `src/vite-env.d.ts`

**Interfaces:**
- Produces: runnable `npm run dev` / `npm run build` with Vue mount on `#app`

- [ ] **Step 1: Create Vite Vue-TS scaffold in repo root**

Use official template files (vue-ts). `index.html` head must include:

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="data:," />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mostar city</title>
    <meta name="description" content="A cinematic three-screen scroll story for Mostar city." />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 2: Install deps and verify build**

Run: `npm install && npm run build`  
Expected: build succeeds (placeholder App ok).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig*.json index.html src/main.ts src/App.vue src/vite-env.d.ts
git commit -m "chore: scaffold Vue 3 + Vite + TypeScript app"
```

---

### Task 2: Assets + sights data

**Files:**
- Create: `src/assets.ts`, `src/data/sights.ts`

**Interfaces:**
- Produces: `SCENE`, `FONT_OGG_MEDIUM`, `ICONS`, `SightCard`, `sights: SightCard[]`

- [ ] **Step 1: Write `src/assets.ts`** with exact remote URLs from the spec (font + 7 scenes + 3 icons).

- [ ] **Step 2: Write `src/data/sights.ts`** with the five cards (ariaLabel, kicker, title, body, pin) matching the prompt table.

- [ ] **Step 3: Commit**

```bash
git commit -m "feat: add Mostar remote asset and sight card data"
```

---

### Task 3: Global styles.css

**Files:**
- Create: `src/styles.css`
- Modify: `src/main.ts` to `import './styles.css'`

**Interfaces:**
- Consumes: font URL from `assets` (inlined in `@font-face` in CSS)
- Produces: full visual system for CinemaScroll classes

- [ ] **Step 1: Port product-prompt CSS sections 4–6 verbatim into `src/styles.css`**, plus:

```css
@font-face {
  font-family: "Ogg Medium";
  src: url("https://dcym8fthxf5uu.cloudfront.net/fonts/247a073c-29f5-4a89-aa3a-741020f346fc/OggText-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
```

Apply `"Ogg Medium"` to `.site-logo`, `.hero-title`, `.story-panel h2`, `.facts dt` as in the prompt.

- [ ] **Step 2: Import CSS from `main.ts`.**

- [ ] **Step 3: Commit**

```bash
git commit -m "feat: add Mostar cinematic scroll global styles"
```

---

### Task 4: useCinemaScroll composable

**Files:**
- Create: `src/composables/useCinemaScroll.ts`

**Interfaces:**
- Consumes: `Ref<HTMLElement | null>` for section, track, controls, prev, next
- Produces: `useCinemaScroll(opts)` — mounts listeners + slider; cleans up on unmount

- [ ] **Step 1: Implement helpers and rAF engine** matching product prompt §7 (clamp/smoothstep/lerp/segmentInOut/getScrollDistance, all CSS variable writes).

- [ ] **Step 2: Implement infinite slider** matching product prompt §8 (3 sets, normalize jump, is-jumping).

- [ ] **Step 3: Wire `onMounted` / `onUnmounted` for scroll, resize, pointermove, button clicks, cancelAnimationFrame.

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: add cinema scroll animation and sight slider composable"
```

---

### Task 5: CinemaScroll.vue + App wiring

**Files:**
- Create: `src/components/CinemaScroll.vue`
- Modify: `src/App.vue`

**Interfaces:**
- Consumes: `SCENE`, `sights`, `useCinemaScroll`
- Produces: exact DOM tree from spec

- [ ] **Step 1: Build template** with prompt source order; seed five `.sight-card` via `v-for`; bind template refs.

- [ ] **Step 2: Call `useCinemaScroll` with refs in setup.**

- [ ] **Step 3: `App.vue` renders only `<CinemaScroll />`.**

- [ ] **Step 4: `npm run build` + manual choreography check via `npm run dev`.**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: assemble Mostar cinema scroll page"
```

---

## Self-review

1. Spec coverage: scaffold, assets, CSS, composable, DOM component — all mapped.
2. No TBD placeholders.
3. Types: `SightCard`, `useCinemaScroll` refs consistent across tasks.
