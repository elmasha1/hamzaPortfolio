# Portfolio — Design Specification (current state, verified against code)

**Purpose of this document:** hand it to a design-focused agent so it can critique and improve
the visual design. Everything below was read out of the source, not remembered — values are
exact. Where the code contradicts intent, it says so.

**Owner:** EL MASDOUKI Hamza — full-stack engineer (React + Laravel). The site is a personal
portfolio whose job is: *convince a recruiter or a client, in one scroll, that this person ships
production software* — then get them into the contact form.

---

## 1. Technical frame (non-negotiable unless the redesign explicitly says so)

| | |
|---|---|
| Framework | React 18 SPA, Vite 5, `react-router-dom` 6 |
| Styling | Tailwind CSS 3 (config: `frontend/tailwind.config.js`), plus `@layer components` classes in `frontend/src/index.css`. **No CSS modules, no styled-components.** |
| Animation | `framer-motion` 11 (everywhere), `gsap` + `ScrollTrigger` (one pinned horizontal gallery), `lenis` (momentum smooth-scroll) |
| Icons | `lucide-react` wrapped in `src/components/ui/Icons.jsx` with defaults `size 18, strokeWidth 1.75`; brand/tech logos from `react-icons/si` via `src/lib/techIcons.jsx` |
| Fonts | Google Fonts, loaded in `index.html`: **Space Grotesk** 400/500/600/700 (headings) + **Inter** 400/500/600/700 (body/UI), `display=swap` |
| Content | Every string/number is dashboard-driven from a Laravel API (`GET /api/bootstrap` → settings, projects, journey, technologies, pricing, about). Fallback defaults live in `src/context/SettingsContext.jsx`. **The design must survive arbitrary content lengths and missing fields.** |
| Theme | Single permanent dark theme. No light mode, no theme toggle. |
| Rendering | Client-side only (no SSR). First paint is a preloader, not content. |

Redesign output must be expressible as Tailwind classes in the existing JSX files, or as new
tokens in `tailwind.config.js` / `index.css`.

---

## 2. Site map (after a recent consolidation — the site is now almost single-page)

| Route | Content |
|---|---|
| `/` | The whole pitch in one scroll: Hero → Overview (01) → Journey (02) → Selected work (03) → Pricing + FAQ (04) → Contact (05) |
| `/about` | Long-form editorial About: intro (01) → intro video → story + pull-quote (02) → philosophy (03) → technologies (04) → quick facts → CTA |
| `/work/:id` | Project case study (its own chrome — no navbar/footer) |
| `/cv` | Printable CV page + client-side jsPDF download |
| `/admin/*` | Dashboard (separate design language, **out of scope** for the redesign) |
| `/contact`, `/pricing`, `/projects`, `/blog` | Redirects to the matching home section (retired pages) |
| `*` | 404 |

Nav links for Work / Pricing / Contact are anchors (`#projects`, `#pricing`, `#contact`) resolved
through `src/hooks/useSectionNav.js` (smooth-scroll on home, route-home-then-scroll elsewhere).

---

## 3. Design language (what it is trying to be)

Swiss / editorial monochrome. Near-black paper, near-white ink, **zero color** except a red used
only for form validation. Definition comes from **hairline 12%-white borders**, never from
shadows (every shadow token is literally `none`). Big tightly-tracked Space Grotesk display type
against small grey Inter body copy. Numbered section labels (`01 ── Overview`) give it a
printed-portfolio rhythm. Motion is the "premium" layer: masked word-by-word text reveals,
clip-path wipes, momentum scroll, a custom cursor.

Reference feel: agency/awwwards portfolio sites (gianlucagradogna-style), not a SaaS marketing page.

---

## 4. Color tokens (exact — `tailwind.config.js`)

### Actually used
| Token | Value | Role |
|---|---|---|
| `ink` / `base-soft` | `#0D0D0D` | Page background, button text on white, preloader |
| `base-indigo` / `base-hero` | `#141414` | Raised panel — image placeholders, project tile backing |
| `heading` | `#FAFAFA` | Headings, active nav, emphasis |
| `body` | `#8A8A8A` | Paragraph copy |
| `muted` | `#6B6B6B` | Captions, meta, tags, inactive labels |
| `eyebrow` | `#A1A1A1` | The `.eyebrow` caps label color |
| `line` | `rgba(255,255,255,0.12)` | Every hairline border and divider |
| `coral` | `#F87171` | **Only** field errors |
| `primary` / `paper` / `sky` | `#FFFFFF` | The single accent: white |
| `surface` | `rgba(255,255,255,0.03)` | Faint glass fill |
| `surface-2` | `rgba(255,255,255,0.06)` | Slightly stronger fill |

Ad-hoc alpha whites appear inline all over: `white/[0.02]` (hover fill), `white/[0.03]`,
`white/[0.04]`, `white/15` (timeline rail), `white/20`, `white/25`, `white/30`, `white/35`
(hover border), `white/60`, `white/70`.

### Dead tokens (defined, unused or neutralised — safe to delete/redefine)
`deep`, `glow`, `base-white`, `teal`, `secondary`, `dark`, `mint`, `amber`, `lavender`, `pink`
(all collapsed to `#A1A1A1` or `#0D0D0D`), the whole `primary.50/100/300/500/600/700/800` ramp,
and every `boxShadow` token (`soft`, `soft-lg`, `glow`, `glow-teal`, `btn`, `btn-hover`,
`btn-secondary` → all `none`, yet `shadow-soft` is still written in 27 places).

### Contrast audit (vs `#0D0D0D`)
- `heading #FAFAFA` → **18.6 : 1** ✅
- `eyebrow #A1A1A1` → **7.5 : 1** ✅
- `body #8A8A8A` → **5.6 : 1** ✅ AA
- `muted #6B6B6B` → **3.7 : 1** ❌ fails AA for body text; it is used at 10–12px for tags, dates,
  meta, footnotes and the FAQ numbering. **Worth fixing in the redesign.**
- `line rgba(255,255,255,0.12)` on ink → ~**1.3 : 1**; borders are the primary structural device
  yet sit barely above the noise floor on a dim laptop screen.

---

## 5. Typography (exact)

**Families:** `font-heading` = `"Space Grotesk", Inter, system-ui`; `font-sans` = `Inter,
system-ui, -apple-system`. All `h1–h6` are globally forced to `font-heading`, `color: heading`,
`letter-spacing: -0.02em`.

**Body base** (`index.css`): 16px / line-height 1.7 / letter-spacing -0.01em / color `#8A8A8A`,
antialiased, `text-rendering: optimizeLegibility`.

**Display sizes are ad-hoc `clamp()` per component, not tokens.** The full inventory:

| Where | Size | Leading / tracking |
|---|---|---|
| Hero H1 | `clamp(2.5rem, 7vw, 5.75rem)` | 1.02 / -0.03em |
| Footer CTA, About CTA, ProjectDetail H1 | `clamp(2.5rem, 7vw, 5.5rem)` | 1.02 / -0.03em |
| Mobile nav links | `clamp(2.5rem, 9vw, 5.5rem)` | 1.05 / -0.03em |
| About H1 | `clamp(2.25rem, 6vw, 4.75rem)` | 1.03 / -0.03em |
| Contact H2 | `clamp(2.5rem, 6vw, 4.5rem)` | 1.02 / -0.03em |
| Overview / Journey / Pricing H2 | `clamp(2rem, 4.5vw, 3.5rem)` | 1.06 / -0.03em |
| Work / FAQ / Philosophy H2 | `clamp(1.9rem, 4.5vw, 3.25rem)` | 1.05–1.06 / -0.02–0.03em |
| Footer wordmark | `clamp(3.5rem, 17vw, 13rem)` | 0.85 / -0.04em |
| Preloader counter | `clamp(4rem, 17vw, 12rem)` | 0.85 / -0.04em |
| 404 | `clamp(4rem, 16vw, 11rem)` | 1 / -0.03em |
| Pull-quote (About) | `clamp(1.6rem, 3.4vw, 2.6rem)` | 1.15 / -0.02em |
| Quick-fact numbers | `clamp(2.25rem, 5vw, 3.5rem)` | 0.95 / -0.03em |
| Pricing price | `clamp(1.9rem, 3.5vw, 2.75rem)` | 1 / -0.03em |
| Card titles (H3) | `text-xl sm:text-2xl` (20→24px), 600 | -0.01em |
| Paragraphs | `text-[15px]` or `text-base` or `text-lg`, `leading-[1.7]`, `max-w-[42ch]`…`[62ch]` | |
| `.eyebrow` | 11px / 600 / uppercase / `0.14em` / `#A1A1A1` | |
| Meta & tags | `text-xs` (12px) or `text-[10px]`, uppercase, `0.1em`–`0.16em`, `muted` | |

**Tailwind `fontSize` tokens `hero`, `h2`, `h3` are declared and never used (0 occurrences).**

**⚠️ Real bug:** `text-body` is defined as *both* a fontSize (15px) and a color (`#8A8A8A`), so
Tailwind emits two `.text-body` rules and the class silently sets 15px too. Because `.text-base`
is emitted *before* `.text-body` in the stylesheet, `class="text-base … text-body"` renders
**15px, not 16px** — this hits 5 lead paragraphs: `Overview.jsx:36`, `Journey.jsx:64`,
`Pricing.jsx:164`, `Pricing.jsx:236`, `Contact.jsx:146`. (`text-lg text-body` is fine — `.text-lg`
comes after.)

---

## 6. Layout & spacing

- **Container:** `.container-px` = `mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12`
  (max **1280px**; gutters 20 / 32 / 48px). Used by every section; the pinned work gallery and
  full-bleed overlays deliberately escape it.
- **Breakpoints:** Tailwind defaults — `sm 640`, `md 768`, `lg 1024`, `xl 1280`.
- **Section rhythm (inconsistent — see §12):** home sections `py-24 sm:py-32` (96/128px);
  Technologies `py-16 sm:py-24`; work gallery header `pt-24 pb-12`; About page `pt-32 sm:pt-40`
  then `mt-24 sm:mt-36` between blocks; footer `py-16 sm:py-24`.
- **Header→content gaps:** `mt-14 sm:mt-20` (pricing), `mt-16` (journey/technologies), `mt-12`.
- **Radii:** `rounded-full` (all buttons, pills, dots, FABs), `rounded-[4px]` (project tiles,
  overview grid, mobile hero photo), `rounded-[5px]` (tech cells), `rounded-[6px]` (pricing
  cards, skeletons), `rounded-2xl` (contact social squares, toasts — mostly admin). The
  `borderRadius.btn = 10px` token is effectively unused. **Four radii scales for one design.**
- **Elevation:** none. Every `boxShadow` token is `none`; the only glows are inline
  `shadow-[0_0_12px_2px_rgba(255,255,255,0.5)]` (timeline beam) and
  `0 0 14px 3px rgba(255,255,255,0.55)` (active timeline dot).
- **Z-index ladder:** grain 40 → mobile menu overlay 60 → navbar / WhatsApp / scroll-top 70 →
  scroll-progress 80 → preloader 100 → cursor 120 → project-detail curtain 200.

---

## 7. Motion system (`src/lib/motion.js` — the single source of truth)

```
EASE.out   = [0.22, 1, 0.36, 1]     // every fade / slide / reveal
EASE.inOut = [0.76, 0, 0.24, 1]     // clip-path wipes, curtains, masks
DUR = { micro .3, fast .5, reveal .8, mask 1, slow 1.2 }   // seconds
STAGGER = 0.08
SPRING  = { stiffness 180, damping 18, mass 0.6 }
viewportOnce = { once: true, amount: 0.25 }
```

Shared variants: `staggerContainer(step, delay)`, `fadeUp(y = 40, duration = .8)`,
`fadeIn(direction, distance = 60)`.

**Recurring motion patterns**
1. **Masked word reveal** (`ui/SplitTextReveal.jsx`) — each word in an `overflow-hidden` span,
   inner span `y: 115% → 0%`, 0.8s `EASE.out`, stagger 0.045s. Used for nearly every H1/H2.
   Reduced motion → plain fade.
2. **Section stagger** — `staggerContainer` + `fadeUp` on `whileInView`, `once: true`.
3. **Clip-path wipes** — images `inset(100% 0 0 0) → inset(0 0 0 0)` 0.9s `EASE.inOut`; hero photo
   panel `polygon(100% 0,100% 0,100% 100%,100% 100%) → polygon(22% 0,100% 0,100% 100%,0 100%)`
   1.15s; preloader curtain; project-detail `scaleY 1 → 0` from top 0.7s.
4. **Magnetic buttons** (`hooks/useMagnetic.js`) — element follows the cursor at 0.3 strength,
   spring `220 / 16 / 0.5`, `whileTap scale .97`, plus a diagonal shine sweep
   (`animate-shine`, 0.85s) on hover.
5. **Scroll-linked** — hero photo parallax `y 0 → 70px`; timeline beam `scaleY` from
   `useScroll(offset: ['start 85%','end 55%'])` spring `120 / 30`; top progress bar spring
   `120 / 25`; pinned horizontal gallery `scrub: 1`.

**Reduced-effects policy** (`hooks/usePerf.js`): `prefers-reduced-motion` **OR** coarse pointer
**OR** `hardwareConcurrency ≤ 4` **OR** `deviceMemory ≤ 4` ⇒ the horizontal gallery becomes a
vertical grid. Lenis is skipped on touch and reduced-motion. `index.css` also nukes all CSS
animation/transition durations under `prefers-reduced-motion`.

**Unused keyframes still in the config:** `float`, `spin-slow`, `gradient-shift`, `mesh`,
`shimmer`, `bloom`, `twinkle`, `breathe`. Only `marquee` (30s), `pulse-ring` (2s) and `shine` are
actually referenced.

---

## 8. Global chrome

**Preloader** (`components/Preloader.jsx`) — full-screen `#0D0D0D`; top row "EL MASDOUKI Hamza" /
"Full Stack Engineer" in 11px caps; bottom a 1px progress line over an oversized 0→100 counter
(`clamp(4rem,17vw,12rem)`, tabular figures). At 100 a white curtain wipes up
(`inset(0 0 0 0) → inset(0 0 100% 0)`, 0.55s), then the panel exits `y: -100%` 0.8s. Once per
session (`sessionStorage.introSeen`), bypass with `?skipintro`, hard 5s failsafe.

**Custom cursor** (`components/Cursor.jsx`, desktop fine-pointer only) — a 6px white dot at the
exact position + a 96px ring lagging on a spring (`300 / 28 / 0.6`). Ring `scale`: `0.3` idle,
`0.42` over any `a/button/input/textarea` or `data-cursor="hover"`, `1` + solid white fill + black
11px caps label over `data-cursor="view" | "drag" | "open" | "play"`. Native cursor hidden via
`.custom-cursor-active`.

**Grain** (`components/GrainOverlay.jsx`) — fixed inline-SVG fractal-noise tile (160×160),
`opacity .035`, `mix-blend-soft-light`, `z-40`. On the site layout, project detail and 404.

**Scroll progress** — 1px white bar, `origin-left`, top of viewport, `z-80`.

**Navbar** (`components/Navbar.jsx`) — fixed, `z-70`. Transparent at top; past 40px it becomes
`bg-ink/80 + backdrop-blur-md + border-b border-line` and padding tightens `py-5 → py-3`.
Left: wordmark `Hamza®` (® in `muted`). Centre (lg+): Home · About · Work · Pricing · Contact,
14px, `body → heading` on hover, with an underline that grows from 0 to full width (300ms);
active page keeps it full. Right (lg+): a "CV" text button with a download icon (nudges down on
hover) + a `rounded-full border-line` "Get in touch" pill that inverts to white/ink on hover.
Below lg: a "Menu / Close" caps label with a 2-line burger that crosses into an X.

**Mobile menu overlay** — full-screen `bg-ink`, `clip-path inset(0 0 100% 0) → inset(0 0 0 0)`
0.7s `EASE.inOut`; links bottom-aligned, each masked and sliding up (`y 110% → 0`, stagger 0.06s,
`clamp(2.5rem,9vw,5.5rem)`), numbered `01…05` in small sans; footer strip with socials, CV
download and a live local clock.

**Footer** (`components/Footer.jsx`) — top: a 30s marquee strip ("Available for work · Let's work
together · Full-Stack Developer · React · Laravel · EL MASDOUKI Hamza"). Then a huge
"Let's work together" link + 44px arrow. Then 3 columns (Navigate / Find me online / Status) —
socials with icons and a hover arrow that fades in, status with a pulsing availability dot, city,
live clock, email. Then the giant `Hamza®` wordmark as a back-to-top button
(`clamp(3.5rem,17vw,13rem)`, leading 0.85) with a "Back to top ↑" caption. Bottom hairline row:
`© {year} EL MASDOUKI Hamza — All rights reserved.` / `Built with React, Tailwind, GSAP & Laravel`.

**Floating utilities** — WhatsApp FAB (48px, `bottom-6 right-6`, `z-70`, hairline circle,
inverts to white on hover, spring entrance at 1s, tooltip on hover) and a scroll-to-top FAB
(same size at `bottom-[5.25rem]`, appears past 600px).

**Page transition** — opacity-only crossfade (0.35s) between routes; deliberately no transform,
because a transform would create a containing block and break the GSAP pin.

---

## 9. Home page, section by section

### 9.1 Hero (`components/Hero.jsx`) — `min-h-screen`
- **Background:** `HeroBackground.jsx` — a deterministic constellation (seeded PRNG, 40 nodes,
  edges drawn between nodes closer than 19 units on a 100×100 field) in an SVG that
  `preserveAspectRatio="xMidYMid slice"`. Lines white at 7% opacity, nodes twinkle via CSS
  (`heroTwinkle`, 5s, opacity 0.12↔0.5), two labelled markers ("RABAT", "REMOTE") with 2px text.
  The whole map fades + scales `0.85 → 1` over 1.4s on load and parallaxes ±18/12px with the
  cursor on a soft spring (60/20).
- **Readability scrim:** `bg-gradient-to-r from-ink via-ink/85 to-ink/40`, and on lg+
  `via-ink/70 to-transparent`.
- **Right photo panel (lg+ only):** 56% wide (52% at xl), full height, diagonally cut
  `polygon(22% 0, 100% 0, 100% 100%, 0 100%)`, revealed with a clip wipe at 0.45s delay;
  grayscale portrait anchored bottom, parallax `y 0→70px`; a left-edge gradient blends it into
  the background. Missing image → a `#141414` block with a 72px `Code2` glyph.
- **Content column:** a vertical hairline rule that grows `scaleY 0→1`; eyebrow row = pulsing
  availability dot + role label; H1 revealed word-by-word (stagger 0.08, delay 0.35); a
  location line with a pin icon (`hero_location`, e.g. "Rabat ⇄ Remote · Code · Deploy ·
  Maintain"); two CTAs — primary white "Get in touch" (→ `#contact`) and secondary outline
  "View work" (→ `#projects`).
- **Below lg** the portrait stacks under the text: `max-w-sm`, `aspect-[4/5]`, top edge cut
  `polygon(0 7%, 100% 0, 100% 100%, 0 100%)`, with "Based remotely" / year captions.
- **Scroll cue:** a down arrow at `bottom-10`, looping `y: 0 → 8 → 0` (1.6s), sm+ only.

### 9.2 Overview — "01 — Overview / This is what I do."
Intro paragraph (`max-w-[55ch]`), then a hairline grid: `grid gap-px bg-line rounded-[4px]
border border-line sm:grid-cols-2` — the 1px gaps *are* the grid lines. Each card
(`bg-ink p-7 sm:p-9`, hover `bg-white/[0.02]`): a 24px lucide icon (1.5 stroke, `muted →
heading` on hover) top-left, right-aligned pill tags (10px caps, hairline), then title
(`text-xl sm:text-2xl`), a `max-w-[42ch]` description, and a hairline-topped row of tech words
(12px caps, `0.1em`). Renders nothing if the dashboard supplies no items.

### 9.3 Journey — "02 — My Journey / From zero to full-stack."
A `max-w-4xl` vertical timeline. Rail: 1px `white/15`, left-4 on mobile, centred at md+. Over it a
white **progress beam** whose `scaleY` is scroll-linked and spring-smoothed, glowing
`0 0 12px 2px rgba(255,255,255,.5)`. Milestones alternate sides at md+ (`w-1/2` + `pr-14
text-right` / `ml-auto pl-14`), stack right of the rail on mobile. Each: a 14px dot on the rail
that goes from `scale .55` + `white/25` to `scale 1` + solid white with a `0 0 14px 3px` halo
when 60% in view; then date (12px caps `0.16em`), title (masked word reveal, `text-2xl
sm:text-3xl`), description (`max-w-[46ch]`), hairline tag pills — all cascading in toward the
rail with `x ±26px` and a `blur(6px) → blur(0)` clear, 0.1s apart.

### 9.4 Selected work — "03 — Engineering case studies…"
Desktop (non-reduced): a **GSAP-pinned horizontal gallery** — the section pins for
`track.scrollWidth - innerWidth` pixels while the track translates left, `scrub: 1`,
`anticipatePin`, `invalidateOnRefresh`. Track: `h-screen`, `gap-[6vw] px-[8vw]`, `data-cursor="drag"`.
Tiles are `38vw` wide (52vw sm, 80vw base), `aspect-[4/3]`, `rounded-[4px]`, hairline border,
`#141414` backing; the image clip-wipes up on entry then sits **grayscale**, going full colour
and `scale 1.05` over 700ms on hover; an index `01…` sits top-left in `white/70`. Below the
image: title (`text-xl sm:text-2xl`, brightens on hover) + role in `muted`, a 22px `ArrowUpRight`
that nudges up-right, and a row of 12px caps tech tags. Last panel is a CTA
("Next / Let's work together / Start a project →") linking to `#contact`. Clicking a tile routes
to `/work/:id`.
Touch / reduced-motion / low-end: the same tiles in a `sm:grid-cols-2` vertical grid with the CTA
spanning both columns above a hairline.
If the API returns nothing, three placeholder projects are shown (Atlas / Ledger / Pulse), and
missing images become an inline SVG placeholder with the project title on `#141414`.

### 9.5 Pricing — "04 — Pricing / Simple, transparent pricing."
Heading (`max-w-[18ch]`) + optional subline (`max-w-[52ch]`). Then `lg:grid-cols-3` of tier cards
(`rounded-[6px]`, hairline, `p-8 sm:p-10`, hover `bg-white/[0.02]`). A tier flagged
`highlighted` gets `border-white/30`, `bg-white/[0.03]`, is pulled `-my-4` and padded `py-14` at
lg (so it stands taller), and carries a "Most popular" badge floating on its top border
(`-top-3 left-8`, hairline pill, 10px caps `0.16em`). Card body: name (`text-xl`), price
(`clamp(1.9rem,3.5vw,2.75rem)`) + period in 12px caps, description, a hairline-topped feature
list (16px `Check` icon in `heading`, 15px text, staggered), then a full-width CTA — white
primary on the highlighted tier, outline elsewhere — scrolling to `#contact`. An optional
all-caps footnote sits under the grid.
**FAQ** below: a centred `max-w-[46rem]` column — small "FAQ" eyebrow, "Common questions."
heading, optional subline — then a left-aligned hairline accordion. Row: `01` number, question
(`text-lg sm:text-xl`, 500), chevron rotating 180°; answer animates `height 0 → auto` (0.5s),
15px/1.7, indented `pl-10`, `max-w-[60ch]`. First row open by default, one open at a time.
**States:** three `h-[26rem]` skeleton cards while loading (layout never jumps); a hairline error
card with a "Retry" button if the API fails.

### 9.6 Contact — "05 — Get in touch / Let's work together."
`lg:grid-cols-2`, `gap-12`, vertically centred.
**Left:** eyebrow, masked heading, a `max-w-md` paragraph ("Have a project, a role, or an idea in
mind?…"), then 48px social squares — `rounded-2xl`, hairline, `bg-white/[0.04]`, 20px icon,
inverting to white/ink on hover with `scale 1.15, y -4`.
**Right:** a minimal underline form — no boxes. Each field is a transparent input with only a
bottom hairline that turns white on focus, `pt-7 pb-2.5`, 18px text, and a floating label that
travels from 16px `muted` to 11px caps `0.14em` `heading` on focus or when filled (CSS `peer`,
no JS). Fields: name, email, message (textarea, 4 rows, no resize). Submit is the outline button
(`min-w-[15rem]`, full width on mobile, `justify-between`) showing "Send message →" or
"Sending" + spinner. Success: an SVG check that draws itself (circle then tick) + a confirmation
line, auto-resetting after 5s, plus a toast. Errors: 422 field errors render in `coral` under the
field and turn its border `coral`; anything else shows a generic line + error toast.

---

## 10. Other pages

**About** (`pages/AboutPage.jsx`) — `pt-32 sm:pt-40`; 01 intro (H1 `max-w-[20ch]` + `max-w-[52ch]`
subline) → a 16:9 intro video block (clip-wipe reveal, gentle ±28px parallax, muted autoplay when
50% in view, magnetic play button that unmutes, monochrome poster fallback) → 02 story:
`max-w-[62ch]`, 18px/1.75, each paragraph rising from behind a mask, with a pull-quote after the
first (`border-l` hairline, `pl-6`, `clamp(1.6rem,3.4vw,2.6rem)`) → 03 "Coding philosophy":
hairline rows `[3rem_1fr]` (md `[4rem_0.5fr_1fr]`) with `01…` numbers, title and description,
hover `bg-white/[0.02]` → 04 Technologies (shared component: per category a 16px lucide icon +
caps label in a `md:grid-cols-[0.24fr_1fr]` row, items in a 2/3/4-col grid of `rounded-[5px]`
hairline cells with a 20px monochrome brand logo that brightens and lifts `-translate-y-0.5` on
hover) → quick facts (`border-y`, `md:grid-cols-3` with `divide-x`, count-up numbers
`clamp(2.25rem,5vw,3.5rem)` + 12px caps labels) → a "Let's work together." CTA with the primary
button and a CV download button.

**Project detail** (`/work/:id`) — no navbar/footer; its own cursor + grain. Arrives under an ink
curtain that retracts upward (`scaleY 1 → 0`, 0.7s). "← Back to work", masked H1
(`clamp(2.5rem,7vw,5.5rem)`), a hairline meta row (Role / Stack / Live / GitHub links), then
labelled case-study blocks in a `md:grid-cols-[0.4fr_1fr]` grid (eyebrow label left, 18px prose
right), each separated by a hairline. Loading = a `60vh` pulsing block.

**404** — centred: "Error 404" eyebrow, `clamp(4rem,16vw,11rem)` numeral, one grey line, a white
pill "← Back to home".

---

## 11. Behaviour the design must keep working

- **Everything is API-driven.** Titles, prices, features, milestones, tech groups, socials,
  photos — all arbitrary length, all optionally missing. Sections self-hide when their data is
  empty (`if (items.length === 0) return null`).
- **Loading states:** pricing uses fixed-height skeletons; projects render fallback data; the
  timeline and tech grid simply appear when data lands. **Layout must not shift.**
- **Error states:** visible copy + a Retry button (never an endless spinner).
- **Keyboard:** global `:focus-visible` = 2px white outline, 2px offset. The mobile menu closes on
  Escape and locks body scroll (and pauses Lenis) while open.
- **Reduced motion / low-end devices** must get a legible static version of every effect.

---

## 12. Known design debt — the honest list

1. **Three "Let's work together" CTAs on one page** — the work gallery's end panel, the contact
   section heading, and the footer's giant link all say it, within about two screens of each
   other. This is the most visible problem after merging the pages into one scroll.
2. **Two competing numbering systems** — home runs `01…05`, About runs `01…04`; the shared
   Technologies block carries its number as a prop (it defaults to `02` but renders as `04`,
   since About is now its only caller). A visitor sees section numbers restart between pages.
3. **`muted #6B6B6B` fails WCAG AA (3.7:1)** and is used for the smallest text on the site.
4. **Type scale is not a scale** — ~14 distinct `clamp()` display sizes, all hand-written at call
   sites; the `fontSize` tokens in the config are dead. There is no defined step ratio.
5. **Four radius scales** (4 / 5 / 6px, `rounded-2xl`, `rounded-full`) with no rule for which
   applies where.
6. **Spacing rhythm drifts** — `py-24 sm:py-32` vs `py-16 sm:py-24` vs `mt-24 sm:mt-36` vs
   `pt-32 sm:pt-40`, plus one-off `mt-14 / mt-16 / mt-12` header gaps.
7. **`text-base text-body` silently renders 15px** (see §5) — five lead paragraphs are a size
   smaller than intended.
8. **Dead tokens everywhere** — 8 unused keyframes, ~15 neutralised colors, 7 `none` shadows,
   `shadow-soft` written 27 times for no effect, an unused `.glass` and `.pill`.
9. **The hero is the only place with any illustration.** After it, the page is text and hairlines
   for ~4000px — the mid-page (Journey → Pricing) has no visual anchor.
10. **Grayscale-by-default project images** hide the one place real colour could appear; combined
    with the fallback SVG placeholders, an empty portfolio reads as a wireframe.
11. **No light mode**, no `prefers-color-scheme` handling at all.
12. **Motion cost:** preloader + custom cursor + Lenis + GSAP pin + grain overlay all run on
    first paint. The public bundle is ~122 kB gzip core + ~54 kB gzip for GSAP/Lenis.
    A redesign that reduced dependence on JS-driven motion would be welcome, not resisted.
13. **Pricing on a personal portfolio sits oddly between "hire me" and "buy this"** — the tier
    cards are the most SaaS-looking block on an otherwise editorial site.

---

## 13. What a redesign should preserve

- The monochrome discipline and hairline-over-shadow structure — this is the identity.
- Space Grotesk display + Inter body pairing.
- Section numbering as an organising device (even if renumbered).
- Data-driven, self-hiding sections and their loading/error/empty states.
- Reduced-motion and low-end fallbacks.
- Tailwind-expressible output; the admin dashboard is out of scope.

## 14. Files that carry the design

```
frontend/tailwind.config.js          tokens (colors, fonts, keyframes)
frontend/src/index.css               base styles, .container-px, .eyebrow, .btn-*
frontend/src/lib/motion.js           easing / duration / stagger tokens + variants
frontend/src/components/ui/          Button, SectionLabel, SplitTextReveal, Skeleton, Icons
frontend/src/components/             Hero, HeroBackground, Overview, Journey, TimelineItem,
                                     WorkGallery, Pricing, Contact, Technologies, Footer,
                                     Navbar, Cursor, Preloader, GrainOverlay, Marquee, …
frontend/src/pages/                  HomePage, AboutPage
frontend/src/layouts/SiteLayout.jsx  chrome + page transition
frontend/src/ProjectDetail.jsx, CvPage.jsx, NotFound.jsx
```
