# Portfolio Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark Michael Smith portfolio at `~/Desktop/portfolio-landing-v2` with landing `/`, `/work`, `/resume`, matching the approved design spec.

**Architecture:** Fresh Vite + React + TS app. Design tokens and motion live in `index.css` + shared UI helpers. Landing sections are focused components; content comes from `src/data/*`. Router wraps page content in Framer Motion transitions while Navbar stays mounted. GSAP/ScrollTrigger used for hero entrance, explorations pin/parallax, and contact marquee, always cleaned up on unmount.

**Tech Stack:** React 19, Vite, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), tailwindcss-animate, GSAP + ScrollTrigger, Framer Motion, hls.js, react-router-dom, Vitest + Testing Library (logic/helpers), oxlint optional.

## Global Constraints

- Project path: `/Users/admin/Desktop/portfolio-landing-v2` (already has git + design spec commits)
- Spec: `docs/superpowers/specs/2026-08-02-portfolio-landing-design.md`
- Forced dark theme only — no light mode toggle
- HLS source: `https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8`
- Contact email: `hello@michaelsmith.com`
- Images: Unsplash URLs listed in Task 2 (same as prior `portfolio-landing`)
- Navbar: Home → `/` or `#home`; Work → `/work`; Resume → `/resume`
- LoadingScreen only on Index (`/`)
- Journal “View all” → `href="#"` (no journal route)
- Landing Selected Works section id: `#works`
- Accent gradient: `linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)`
- Fonts: Inter 300–700 + Instrument Serif italic via Google Fonts in `index.html`
- Commit frequently after each task; do not push unless asked

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
  vitest.config.ts
  public/favicon.svg
  src/
    main.tsx
    App.tsx
    index.css
    lib/
      constants.ts
      gsap.ts
      loading.ts
      nav.ts
    data/
      projects.ts
      journal.ts
      explorations.ts
      resume.ts
    components/
      HLSVideo.tsx
      LoadingScreen.tsx
      Navbar.tsx
      GradientBorderButton.tsx
      SectionHeader.tsx
      Hero.tsx
      SelectedWorks.tsx
      Journal.tsx
      Explorations.tsx
      Stats.tsx
      Contact.tsx
      ProjectCard.tsx
    pages/
      Index.tsx
      Work.tsx
      Resume.tsx
    test/
      setup.ts
  docs/superpowers/... (existing)
```

---

### Task 1: Scaffold Vite app + design system

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig*.json`, `vitest.config.ts`, `index.html`, `public/favicon.svg`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/test/setup.ts`
- Keep existing: `docs/**`, `.git`

**Interfaces:**
- Produces: runnable Vite app with Tailwind tokens / fonts / keyframes from spec

- [ ] **Step 1: Scaffold in the existing repo directory without wiping docs**

Run from parent Desktop (or inside project carefully):

```bash
cd /Users/admin/Desktop/portfolio-landing-v2
npm create vite@latest . -- --template react-ts
```

If create-vite refuses non-empty dir, scaffold to a temp folder then copy app files in (do **not** delete `docs/` or `.git`).

Then install deps:

```bash
npm install
npm install gsap framer-motion hls.js react-router-dom tailwindcss-animate
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom jsdom @types/node
```

- [ ] **Step 2: Configure Vite + Vitest**

`vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
});
```

`src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Add to `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Write `index.html` fonts + title**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <title>Michael Smith — Portfolio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Write design system `src/index.css`**

```css
@import "tailwindcss";
@plugin "tailwindcss-animate";

:root {
  --bg: 0 0% 4%;
  --surface: 0 0% 8%;
  --text: 0 0% 96%;
  --muted: 0 0% 53%;
  --stroke: 0 0% 12%;
  --accent: 0 0% 96%;
}

@theme {
  --font-body: "Inter", sans-serif;
  --font-display: "Instrument Serif", serif;

  --color-bg: hsl(var(--bg));
  --color-surface: hsl(var(--surface));
  --color-text-primary: hsl(var(--text));
  --color-muted: hsl(var(--muted));
  --color-stroke: hsl(var(--stroke));
  --color-accent: hsl(var(--accent));

  --animate-scroll-down: scroll-down 1.5s ease-in-out infinite;
  --animate-role-fade-in: role-fade-in 0.4s ease-out;
  --animate-gradient-shift: gradient-shift 6s ease infinite;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background-color: hsl(var(--bg));
  color: hsl(var(--text));
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.font-body {
  font-family: var(--font-body);
}

.font-display {
  font-family: var(--font-display);
}

.accent-gradient {
  background: linear-gradient(90deg, #89aacc 0%, #4e85bf 100%);
}

.gradient-border-animated {
  background: linear-gradient(90deg, #89aacc, #4e85bf, #89aacc);
  background-size: 200% 100%;
  animation: gradient-shift 6s ease infinite;
}

@keyframes scroll-down {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(200%);
  }
}

@keyframes role-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
```

- [ ] **Step 5: Minimal `main.tsx` + placeholder `App.tsx`**

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

```tsx
// src/App.tsx
export default function App() {
  return (
    <main className="min-h-screen bg-bg font-body text-text-primary">
      <p className="p-8 font-display italic text-4xl">Portfolio scaffold</p>
    </main>
  );
}
```

- [ ] **Step 6: Verify scaffold**

Run: `npm run build`  
Expected: build succeeds.

Run: `npm run dev` briefly and confirm dark bg + Instrument Serif italic text.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.ts vitest.config.ts tsconfig*.json index.html public src
git commit -m "chore: scaffold Vite React app with design tokens"
```

---

### Task 2: Constants, GSAP register, and data modules

**Files:**
- Create: `src/lib/constants.ts`, `src/lib/gsap.ts`, `src/lib/loading.ts`, `src/lib/nav.ts`
- Create: `src/data/projects.ts`, `src/data/journal.ts`, `src/data/explorations.ts`, `src/data/resume.ts`
- Create: `src/lib/loading.test.ts`, `src/lib/nav.test.ts`, `src/data/projects.test.ts`

**Interfaces:**
- Produces:
  - `HLS_SRC`, `EMAIL`, `SOCIAL_LINKS` from `constants.ts`
  - `registerGsap()` from `gsap.ts`
  - `loadingProgress(elapsedMs: number, durationMs?: number): number`
  - `resolveHomeTarget(pathname: string): "/" | "#home"`
  - `featuredProjects`, `allProjects`, `journalEntries`, `explorationItems`, `resumeData`

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/loading.test.ts
import { describe, expect, it } from "vitest";
import { loadingProgress } from "./loading";

describe("loadingProgress", () => {
  it("returns 0 at start", () => {
    expect(loadingProgress(0, 2700)).toBe(0);
  });
  it("returns 100 at or after duration", () => {
    expect(loadingProgress(2700, 2700)).toBe(100);
    expect(loadingProgress(5000, 2700)).toBe(100);
  });
  it("returns mid value during load", () => {
    expect(loadingProgress(1350, 2700)).toBe(50);
  });
});
```

```ts
// src/lib/nav.test.ts
import { describe, expect, it } from "vitest";
import { resolveHomeTarget } from "./nav";

describe("resolveHomeTarget", () => {
  it("scrolls when already on home", () => {
    expect(resolveHomeTarget("/")).toBe("#home");
  });
  it("navigates home from other routes", () => {
    expect(resolveHomeTarget("/work")).toBe("/");
    expect(resolveHomeTarget("/resume")).toBe("/");
  });
});
```

```ts
// src/data/projects.test.ts
import { describe, expect, it } from "vitest";
import { allProjects, featuredProjects } from "./projects";

describe("projects data", () => {
  it("has exactly 4 featured projects for the bento", () => {
    expect(featuredProjects).toHaveLength(4);
    expect(featuredProjects.map((p) => p.title)).toEqual([
      "Automotive Motion",
      "Urban Architecture",
      "Human Perspective",
      "Brand Identity",
    ]);
  });
  it("exposes at least 6 projects for /work", () => {
    expect(allProjects.length).toBeGreaterThanOrEqual(6);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npm test`  
Expected: FAIL (modules missing).

- [ ] **Step 3: Implement modules**

```ts
// src/lib/constants.ts
export const HLS_SRC =
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

export const EMAIL = "hello@michaelsmith.com";
export const MAILTO = `mailto:${EMAIL}`;

export const SOCIAL_LINKS = [
  { label: "Twitter", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
  { label: "GitHub", href: "https://github.com" },
] as const;

export const LOADING_DURATION_MS = 2700;
export const LOADING_COMPLETE_DELAY_MS = 400;
```

```ts
// src/lib/gsap.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
```

```ts
// src/lib/loading.ts
export function loadingProgress(elapsedMs: number, durationMs = 2700): number {
  if (elapsedMs <= 0) return 0;
  if (elapsedMs >= durationMs) return 100;
  return Math.round((elapsedMs / durationMs) * 100);
}
```

```ts
// src/lib/nav.ts
export function resolveHomeTarget(pathname: string): "/" | "#home" {
  return pathname === "/" ? "#home" : "/";
}
```

```ts
// src/data/projects.ts
export type Project = {
  title: string;
  image: string;
  span: string;
  aspect: string;
  featured: boolean;
};

export const allProjects: Project[] = [
  {
    title: "Automotive Motion",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]",
    featured: true,
  },
  {
    title: "Urban Architecture",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    span: "md:col-span-5",
    aspect: "aspect-[4/5]",
    featured: true,
  },
  {
    title: "Human Perspective",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    span: "md:col-span-5",
    aspect: "aspect-[4/5]",
    featured: true,
  },
  {
    title: "Brand Identity",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]",
    featured: true,
  },
  {
    title: "Editorial Systems",
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
    span: "md:col-span-6",
    aspect: "aspect-[16/10]",
    featured: false,
  },
  {
    title: "Product Atmospheres",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    span: "md:col-span-6",
    aspect: "aspect-[16/10]",
    featured: false,
  },
  {
    title: "Spatial Interfaces",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    span: "md:col-span-6",
    aspect: "aspect-[16/10]",
    featured: false,
  },
  {
    title: "Type Experiments",
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80",
    span: "md:col-span-6",
    aspect: "aspect-[16/10]",
    featured: false,
  },
];

export const featuredProjects = allProjects.filter((p) => p.featured);
```

```ts
// src/data/journal.ts
export type JournalEntry = {
  title: string;
  image: string;
  readTime: string;
  date: string;
};

export const journalEntries: JournalEntry[] = [
  {
    title: "The Future of Design Systems",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=200&q=80",
    readTime: "5 min read",
    date: "Jun 12, 2026",
  },
  {
    title: "Building with Intent",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&q=80",
    readTime: "8 min read",
    date: "May 28, 2026",
  },
  {
    title: "Motion as Language",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80",
    readTime: "6 min read",
    date: "May 15, 2026",
  },
  {
    title: "Crafting Digital Experiences",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=80",
    readTime: "4 min read",
    date: "Apr 30, 2026",
  },
];
```

```ts
// src/data/explorations.ts
export type ExplorationItem = {
  image: string;
  rotation: number;
  column: 0 | 1;
};

export const explorationItems: ExplorationItem[] = [
  {
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
    rotation: -6,
    column: 0,
  },
  {
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
    rotation: 4,
    column: 0,
  },
  {
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80",
    rotation: -3,
    column: 0,
  },
  {
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80",
    rotation: 5,
    column: 1,
  },
  {
    image:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80",
    rotation: -4,
    column: 1,
  },
  {
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80",
    rotation: 3,
    column: 1,
  },
];
```

```ts
// src/data/resume.ts
export const resumeData = {
  experience: [
    {
      role: "Principal Designer",
      company: "Northstudio",
      period: "2022 — Present",
      summary: "Leading product systems and motion language across web platforms.",
    },
    {
      role: "Product Engineer",
      company: "Lattice & Co",
      period: "2018 — 2022",
      summary: "Shipped fullstack experiences from concept through launch.",
    },
    {
      role: "Founder",
      company: "Independent Practice",
      period: "2014 — 2018",
      summary: "Built brand and digital products for culture and commerce clients.",
    },
  ],
  skills: [
    "Product Design",
    "Design Systems",
    "React",
    "TypeScript",
    "Motion",
    "Creative Direction",
  ],
  education: [
    {
      school: "School of the Art Institute of Chicago",
      degree: "BFA, Visual Communication",
      period: "2010 — 2014",
    },
  ],
};
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `npm test`  
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib src/data
git commit -m "feat: add constants, helpers, and portfolio data modules"
```

---

### Task 3: App shell — router, Navbar, transitions

**Files:**
- Create: `src/components/Navbar.tsx`, `src/components/GradientBorderButton.tsx`
- Create: `src/pages/Index.tsx`, `src/pages/Work.tsx`, `src/pages/Resume.tsx` (stubs)
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `resolveHomeTarget`, `MAILTO`
- Produces: `Navbar`, routed pages with opacity transitions; Navbar outside exiting tree

- [ ] **Step 1: Implement `GradientBorderButton`**

```tsx
// src/components/GradientBorderButton.tsx
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
} & ComponentPropsWithoutRef<"a">;

export function GradientBorderButton({
  children,
  className = "",
  innerClassName = "",
  ...props
}: Props) {
  return (
    <a className={`group relative inline-flex ${className}`} {...props}>
      <span
        aria-hidden
        className="pointer-events-none absolute opacity-0 transition-opacity duration-300 group-hover:opacity-100 accent-gradient rounded-full"
        style={{ inset: -2 }}
      />
      <span
        className={`relative inline-flex items-center rounded-full bg-surface backdrop-blur-md ${innerClassName}`}
      >
        {children}
      </span>
    </a>
  );
}
```

- [ ] **Step 2: Implement `Navbar`**

Behavior:
- Fixed top center pill
- Logo “JA” with accent ring (hover reverse gradient via `scale-x-[-1]` or `background` direction swap)
- Links: Home / Work / Resume
- Home uses `resolveHomeTarget(pathname)`; if `#home`, `preventDefault` + `document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })`
- Work → `/work`, Resume → `/resume` via `Link`
- Active styles: current route OR (on `/` + Home) active
- Say hi → `GradientBorderButton` mailto
- `scrollY > 100` → `shadow-md shadow-black/10`

```tsx
// src/components/Navbar.tsx — key structure
// fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4
// inner: inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2
```

Implement full file with `useLocation`, `useState`/`useEffect` for scroll shadow, and `Link` from react-router-dom.

- [ ] **Step 3: Stub pages + wire `App.tsx`**

```tsx
// src/pages/Index.tsx
export function Index() {
  return <div id="home" className="min-h-screen pt-24 px-6">Home stub</div>;
}

// src/pages/Work.tsx
export function Work() {
  return <div className="min-h-screen pt-24 px-6">Work stub</div>;
}

// src/pages/Resume.tsx
export function Resume() {
  return <div className="min-h-screen pt-24 px-6">Resume stub</div>;
}
```

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { Index } from "./pages/Index";
import { Work } from "./pages/Work";
import { Resume } from "./pages/Resume";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/work" element={<Work />} />
          <Route path="/resume" element={<Resume />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg font-body text-text-primary">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}
```

- [ ] **Step 4: Manual verify**

Run: `npm run dev`  
Check: Navbar persists across `/` → `/work` → `/resume`; opacity transition; Home from `/work` returns to `/`.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/Navbar.tsx src/components/GradientBorderButton.tsx src/pages
git commit -m "feat: add router shell, navbar, and page transitions"
```

---

### Task 4: HLSVideo + LoadingScreen

**Files:**
- Create: `src/components/HLSVideo.tsx`, `src/components/LoadingScreen.tsx`
- Modify: `src/pages/Index.tsx` (mount LoadingScreen)

**Interfaces:**
- Consumes: `HLS_SRC`, `loadingProgress`, `LOADING_DURATION_MS`, `LOADING_COMPLETE_DELAY_MS`
- Produces: `<HLSVideo src flipped? className? overlayClassName? />`, `<LoadingScreen onComplete={() => void} />`

- [ ] **Step 1: Implement `HLSVideo`**

```tsx
// src/components/HLSVideo.tsx
import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { HLS_SRC } from "../lib/constants";

type Props = {
  src?: string;
  flipped?: boolean;
  className?: string;
  overlayClassName?: string;
  bottomFade?: boolean;
};

export function HLSVideo({
  src = HLS_SRC,
  flipped = false,
  className = "",
  overlayClassName = "bg-black/20",
  bottomFade = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    void video.play().catch(() => {
      /* autoplay may be blocked; UI continues */
    });

    return () => {
      hls?.destroy();
    };
  }, [src]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        className={`absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover ${
          flipped ? "scale-y-[-1]" : ""
        }`}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className={`absolute inset-0 ${overlayClassName}`} />
      {bottomFade && (
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Implement `LoadingScreen`**

Requirements from spec:
- `fixed inset-0 z-[9999] bg-bg`
- rAF from 0→100 over 2700ms using `loadingProgress`
- Top-left “Portfolio”
- Center words cycle every 900ms: Design / Create / Inspire with AnimatePresence
- Bottom-right `padStart(3,"0")` counter
- Progress bar `.accent-gradient` `scaleX(count/100)` + glow shadow
- At 100: wait 400ms then `onComplete`

```tsx
// outline — full implementation required in code
export function LoadingScreen({ onComplete }: { onComplete: () => void }) { ... }
```

Use `framer-motion` for label + word transitions.

- [ ] **Step 3: Wire into Index**

```tsx
import { useState } from "react";
import { LoadingScreen } from "../components/LoadingScreen";

export function Index() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div id="home" className="min-h-screen" />
    </>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run dev`  
Expected: counter reaches 100, overlay dismisses; `/work` has no loader.

- [ ] **Step 5: Commit**

```bash
git add src/components/HLSVideo.tsx src/components/LoadingScreen.tsx src/pages/Index.tsx
git commit -m "feat: add HLS video helper and loading screen"
```

---

### Task 5: Hero section

**Files:**
- Create: `src/components/Hero.tsx`
- Modify: `src/pages/Index.tsx`

**Interfaces:**
- Consumes: `HLSVideo`, `registerGsap`/`gsap`, role list, CTAs
- Produces: full-viewport Hero with id `home`

- [ ] **Step 1: Implement Hero**

Must include:
- Full viewport section `id="home" relative overflow-hidden`
- Background `HLSVideo` with `bottomFade`
- Centered content z-10:
  - Eyebrow `COLLECTION '26` class `blur-in`
  - Name `Michael Smith` class `name-reveal` font-display italic sizes per prompt
  - Role line cycling every 2s through `["Creative","Fullstack","Founder","Scholar"]` with `animate-role-fade-in` and `key={roleIndex}`
  - Description max-w-md
  - CTAs: “See Works” (scroll to `#works` or Link behavior → `#works`), “Reach out...” mailto — both rounded-full, hover scale + accent ring patterns from prompt
- GSAP timeline on mount (`power3.out`) for `.name-reveal` and `.blur-in`
- Scroll indicator bottom center with `.animate-scroll-down`
- Cleanup gsap context on unmount

- [ ] **Step 2: Mount Hero in Index after loader state**

```tsx
{isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
<Hero />
```

Prefer running GSAP entrance after loading completes (either mount Hero only when `!isLoading`, or gate timeline). **Required:** Hero mounts after loading finishes so entrance is visible:

```tsx
{!isLoading && <Hero />}
```

If other sections should be in DOM for SEO/scroll, keep them mounted but gate Hero animation — simplest correct approach: render all sections always, but only start Hero GSAP when `!isLoading` via prop `animate={true}`.

Use:

```tsx
<Hero ready={!isLoading} />
```

and only create timeline when `ready` becomes true.

- [ ] **Step 3: Manual verify**

Loader finishes → name/blur entrance plays; video plays muted; roles cycle; SCROLL visible; CTAs work.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.tsx src/pages/Index.tsx
git commit -m "feat: add hero with HLS background and GSAP entrance"
```

---

### Task 6: SectionHeader, ProjectCard, SelectedWorks

**Files:**
- Create: `src/components/SectionHeader.tsx`, `src/components/ProjectCard.tsx`, `src/components/SelectedWorks.tsx`
- Modify: `src/pages/Index.tsx`

**Interfaces:**
- Consumes: `featuredProjects`, Framer Motion whileInView
- Produces: bento grid section `id="works"`; “View all work” → `/work`

- [ ] **Step 1: `SectionHeader`**

Props:

```ts
type SectionHeaderProps = {
  eyebrow: string;
  heading: React.ReactNode;
  subtext: string;
  actionLabel?: string;
  actionHref?: string;
  actionDesktopOnly?: boolean; // default true for landing pattern
};
```

Animation: whileInView opacity 0→1, y 30→0, duration 1, ease `[0.25,0.1,0.25,1]`, viewport once margin `-100px`.
Eyebrow row: `w-8 h-px bg-stroke` + uppercase muted label.
Action button: rounded-full gradient hover ring + right arrow; `hidden md:inline-flex` when `actionDesktopOnly`.

- [ ] **Step 2: `ProjectCard`**

Props: `title`, `image`, `className` (span + aspect).
Structure:
- `group relative overflow-hidden rounded-3xl border border-stroke bg-surface`
- Image `object-cover transition-transform duration-500 group-hover:scale-105`
- Halftone overlay: `radial-gradient(circle, #000 1px, transparent 1px)` backgroundSize `4px 4px`, opacity-20 mix-blend-multiply
- Hover veil `bg-bg/70 opacity-0 group-hover:opacity-100 backdrop-blur-lg`
- Center pill: animated gradient border, white bg, `View — ` + italic title

- [ ] **Step 3: `SelectedWorks`**

```tsx
<section id="works" className="bg-bg py-12 md:py-16">
  <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
    <SectionHeader
      eyebrow="Selected Work"
      heading={<>Featured <span className="font-display italic">projects</span></>}
      subtext="A selection of projects I've worked on, from concept to launch."
      actionLabel="View all work"
      actionHref="/work"
    />
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
      {featuredProjects.map((p) => (
        <ProjectCard key={p.title} {...p} className={`${p.span} ${p.aspect}`} />
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 4: Add to Index + verify + commit**

```bash
git add src/components/SectionHeader.tsx src/components/ProjectCard.tsx src/components/SelectedWorks.tsx src/pages/Index.tsx
git commit -m "feat: add selected works bento section"
```

---

### Task 7: Journal + Stats

**Files:**
- Create: `src/components/Journal.tsx`, `src/components/Stats.tsx`
- Modify: `src/pages/Index.tsx`

**Interfaces:**
- Consumes: `journalEntries`
- Produces: Journal pills + 3-column stats

- [ ] **Step 1: Journal**

- Header: eyebrow Journal / “Recent *thoughts*” / subtext / View all → `#`
- Entries: `rounded-[40px] sm:rounded-full flex items-center gap-6 p-4 bg-surface/30 hover:bg-surface border border-stroke`
- Show image thumb, title, readTime, date

- [ ] **Step 2: Stats**

```tsx
const STATS = [
  { value: "20+", label: "Years Experience" },
  { value: "95+", label: "Projects Done" },
  { value: "200%", label: "Satisfied Clients" },
];
```

`bg-bg py-16 md:py-24`, 3-column grid, large display numbers.

- [ ] **Step 3: Mount, verify, commit**

```bash
git add src/components/Journal.tsx src/components/Stats.tsx src/pages/Index.tsx
git commit -m "feat: add journal and stats sections"
```

---

### Task 8: Explorations parallax gallery

**Files:**
- Create: `src/components/Explorations.tsx`
- Modify: `src/pages/Index.tsx`

**Interfaces:**
- Consumes: `explorationItems`, `registerGsap`, `gsap`, `ScrollTrigger`
- Produces: `min-h-[300vh]` section with pin + dual-column parallax + lightbox

- [ ] **Step 1: Implement structure**

- Outer section `relative min-h-[300vh]`
- Layer 1 `h-screen` pinned via `ScrollTrigger.create({ trigger: section, pin: contentRef, pinSpacing: false, start: "top top", end: "bottom bottom" })`
  - Eyebrow Explorations
  - Heading Visual *playground*
  - Subtext + Dribbble button (`https://dribbble.com`)
- Layer 2 absolute `z-20` grid 2 cols, items split by `column`
- Cards: `aspect-square max-w-[320px]`, inline `rotate(${rotation}deg)`, click sets lightbox src
- Parallax: col1 yPercent positive / col2 opposite scrubbed to scroll
- Lightbox: fixed overlay, click backdrop to close, show full image
- `gsap.context` + revert on cleanup; call `registerGsap()` first

- [ ] **Step 2: Manual verify**

Scroll through section: center copy pins; columns move at different rates; click opens lightbox; navigate away to `/work` and back — no duplicate pins / console errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Explorations.tsx src/pages/Index.tsx
git commit -m "feat: add explorations parallax gallery with lightbox"
```

---

### Task 9: Contact / Footer

**Files:**
- Create: `src/components/Contact.tsx`
- Modify: `src/pages/Index.tsx`

**Interfaces:**
- Consumes: `HLSVideo` flipped, `MAILTO`, `SOCIAL_LINKS`, gsap marquee
- Produces: contact section + footer bar

- [ ] **Step 1: Implement Contact**

- `bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden relative`
- Flipped HLS with `overlayClassName="bg-black/60"`
- Marquee track: `"BUILDING THE FUTURE • ".repeat(10)` duplicated for seamless loop; gsap `xPercent: -50`, duration 40, ease `"none"`, repeat `-1`
- Email CTA using gradient hover ring → `MAILTO`
- Footer: social links + green pulsing dot + “Available for projects”
- Cleanup tween on unmount

- [ ] **Step 2: Assemble full Index**

```tsx
export function Index() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <Hero ready={!isLoading} />
      <SelectedWorks />
      <Journal />
      <Explorations />
      <Stats />
      <Contact />
    </>
  );
}
```

- [ ] **Step 3: Verify full landing scroll + commit**

```bash
git add src/components/Contact.tsx src/pages/Index.tsx
git commit -m "feat: add contact footer with marquee and assemble landing"
```

---

### Task 10: Work + Resume pages

**Files:**
- Modify: `src/pages/Work.tsx`, `src/pages/Resume.tsx`
- Reuse: `SectionHeader`, `ProjectCard`, `resumeData`, `allProjects`

**Interfaces:**
- Produces: visually complete placeholder pages per spec

- [ ] **Step 1: Work page**

- Top spacing under navbar
- Header: eyebrow Archive, heading All *projects*, placeholder subtext
- Grid `grid-cols-1 md:grid-cols-2 gap-5 md:gap-6` of `allProjects` (use `aspect-[16/10]` for archive uniformity; ignore bento spans)
- whileInView fade on header

- [ ] **Step 2: Resume page**

- Header: Profile / Curriculum *vitae*
- CTAs: Download CV `href="#"` + Say hi mailto (GradientBorderButton)
- Experience timeline from `resumeData.experience`
- Skills as tag pills
- Education block
- Same dark surface/stroke language

- [ ] **Step 3: Verify nav + transitions + commit**

```bash
git add src/pages/Work.tsx src/pages/Resume.tsx
git commit -m "feat: add work archive and resume placeholder pages"
```

---

### Task 11: Final QA + build gate

**Files:**
- Modify only if bugs found

- [ ] **Step 1: Run unit tests**

Run: `npm test`  
Expected: PASS

- [ ] **Step 2: Production build**

Run: `npm run build`  
Expected: success, no TS errors

- [ ] **Step 3: Acceptance checklist (manual against spec)**

1. Loading 000→100, words cycle, progress bar, dismisses
2. Hero video, entrance, roles, CTAs, scroll indicator
3. Works bento 7/5/5/7 + hover labels; View all → `/work`
4. Journal pills; View all is `#`
5. Explorations pin/parallax/lightbox; cleanup on route change
6. Stats values correct
7. Contact flipped video, marquee, mailto, socials, available pulse
8. `/work` and `/resume` visually complete; transitions work
9. Forced dark; fonts; accent gradient hovers
10. Mobile: nav + hero usable

- [ ] **Step 4: Commit fixes if any, else final chore commit only when files changed**

```bash
git add -A
git status
# commit only if there are changes:
git commit -m "fix: address final QA polish"
```

---

## Spec coverage checklist (self-review)

| Spec item | Task |
|-----------|------|
| Design tokens / fonts / animations | Task 1 |
| Data + constants | Task 2 |
| Router / Navbar / transitions | Task 3 |
| HLS + Loading | Task 4 |
| Hero + GSAP entrance | Task 5 |
| Selected Works bento | Task 6 |
| Journal + Stats | Task 7 |
| Explorations parallax | Task 8 |
| Contact marquee/footer | Task 9 |
| Work + Resume pages | Task 10 |
| Acceptance / build | Task 11 |
| Loading only on `/` | Task 4 + 3 |
| Journal View all `#` | Task 7 |
| Nav Home/Work/Resume rules | Task 3 |

## Execution notes

- Prefer implementing against this plan, not copying old `portfolio-landing` wholesale; old project may be referenced for motion tuning only.
- When GSAP fights React StrictMode double-mount in dev, use `gsap.context` and idempotent setup.
- Do not add light mode, CMS, or real PDF.
