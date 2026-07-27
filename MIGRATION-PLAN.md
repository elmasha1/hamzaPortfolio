# Portfolio v2 — Migration Plan

**Status: awaiting approval. No implementation has started.**

---

## 0. Sources of truth

| Source | Role |
|---|---|
| `Portfolio v2 - Screens.dc.html` | **Visual source of truth.** 5 screens drawn at 1440: Hero, Selected work, Anchors, Ways to work together, Contact + footer. |
| `Design Evolution Plan.dc.html` | **Written source of truth** for everything not drawn: audit, IA, section-by-section specs, design system v2 (colour/type/spacing/radius), motion v2, responsive, a11y, perf, file impact, priority. |
| `DESIGN-SPEC.md` | My audit of the *current* build (what we are migrating from). |

**Drawn vs written — worth knowing before we start.** These are specified in prose but have no
1440 screen: *What I do + metrics rule*, *How I work*, *Journey*, *About*, *Case study*, the
*navbar scrolled state / menu overlay*, and **every mobile and tablet breakpoint**. §4 and §7 of
the Evolution Plan describe them precisely enough to build, and I will implement that prose
literally — no invention. Where prose runs out (exact mobile spacing, the journey `kind` chip
styling, the case-study index rail) I will reuse the drawn screens' own patterns and flag each
spot in the PR rather than design something new. If you prefer, ask Claude Design to draw those
screens first and I will build to them instead.

---

## 1. Existing application — what is actually there

**Architecture.** React 18 SPA, Vite 5, `react-router-dom` 6, Tailwind 3. Two halves code-split
at the router: public site (`SiteLayout` + pages) and `/admin/*` (`AdminApp`). Every route is
`React.lazy`.

**Data flow (this is the part most at risk and it must survive untouched).**
`SettingsProvider` fires **one** `GET /api/bootstrap` during its first *render* — before any child
mounts — and its response seeds the per-endpoint cache keys. `lib/api.js` holds a 5-minute TTL
in-memory cache **plus** in-flight de-duplication: a section calling `fetchProjects()` while
`/bootstrap` is still in flight *awaits bootstrap* instead of firing its own request (this also
absorbs StrictMode double-mounts). Admin writes call `clearPublicCache()`, which also broadcasts
via `localStorage` so another open tab drops its cache. Consumers: `fetchProjects`,
`fetchProject(id)`, `fetchSettings`, `fetchJourney`, `fetchTechnologies`, `fetchPricing`,
`fetchAbout`, `fetchCv`, `sendContactMessage`.

**Backend (Laravel + Sanctum).** Public: `/bootstrap`, `/projects`, `/projects/{id}`, `/settings`,
`/services`, `/posts`, `/journey`, `/about`, `/technologies`, `/pricing`, `/cv`, `/cv/photo`,
`POST /contact`. Auth: `POST /login`, `/me`, `/logout`. Admin (Sanctum): overview, settings,
projects, journey, technologies, pricing, about, cv, posts, messages, profile/cv photo.
`PublicCacheHeaders` middleware + a `PublicCache` layer busted on every write.

**Schema — better than the design assumes.** `projects` already has `title`, `description`,
**`problem`**, `architecture_notes`, `key_features` (json), `challenges`, **`outcome`**, `image`,
`tech_tags` (json), `live_url`, `github_url`, `featured`, `order`, `role`.
`journey_milestones` has `order`, `date_label`, `title`, `description`, `tags` (json).
`settings` is a **key → JSON value store**, and `PUT /api/admin/settings` validates only
`settings: array` — so *any new settings key needs no migration and no controller change*.
`pricing` is the exception: it is one setting key with its own admin controller and **strict
field-by-field validation**.

**Auth.** `AuthContext` (token in localStorage), `ProtectedRoute`, `adminApi` axios instance with
auth + 401 interceptors. **The public redesign does not touch any of this.**

**States already implemented.** Pricing: fixed-height skeletons → error card with Retry.
Projects: fallback data + inline-SVG placeholder images. Journey/Technologies/Overview: self-hide
when empty (`return null`). Contact: 422 field errors in coral, generic error line, toasts,
self-drawing success check. All must survive.

**Responsive.** Tailwind breakpoints; `WorkGallery` currently branches on *device capability*
(`usePerf`: reduced-motion OR coarse pointer OR ≤4 cores OR ≤4 GB) into a second layout.

---

## 2. New design — what changes at system level

- **Identity kept:** near-black paper, near-white ink, hairlines instead of shadows, Space
  Grotesk over Inter, numbered sections, API-driven self-hiding sections.
- **Added:** a third **monospace voice** (JetBrains Mono) for all metadata; a real 9-token type
  scale; 8 measured colour tokens renamed `ink-*` / `paper*` / `rule*`; two rule weights (20%
  structural / 10% interior); two radii (`0` and `full`); four spacing tokens; a 12-column grid
  with an optional footer-toggled overlay; three mid-page anchors; colour as a *reward* (grayscale
  at rest → full colour on the active work row, one full-bleed colour crop, colour case studies).
- **Removed:** Preloader, Lenis, GSAP + ScrollTrigger, the marquee, the duplicate CTAs, the blur-in
  cascade, the shine sweep, 8 unused keyframes, ~30 dead tokens, the `usePerf` device branch.
- **IA reordered** so proof arrives second:
  `Hero → 01 What I do (+ metrics rule) → 02 Selected work → 03 How I work (+ statement band) →
  04 Journey → 05 Ways to work together (+ full-bleed crop) → 06 Contact (+ FAQ)`.
- **Numbering gains scope:** `HOME / 02 — SELECTED WORK`, `ABOUT / 02 — STORY`.

---

## A. New design → existing component mapping

| New design element | Existing component | Verdict |
|---|---|---|
| Hero — 4 bands (utility rail / H1 / split + portrait / proof strip) | `Hero.jsx` | **Rebuild** (keep photo-error fallback + settings wiring) |
| Labelled request-path diagram (CLIENT→API→QUEUE→DB→CI/CD→MONITORING) | `HeroBackground.jsx` | **Adapt** — keep seeded PRNG SVG, add labels + sequenced CSS pulse, drop cursor parallax to ±8px |
| Proof strip (4 mono cells) | — | **New** `MetricsRule.jsx` (also reused as the anchor-1 band) |
| 01 What I do — hairline-gap cells, mono index, no pill tags | `Overview.jsx` | **Adapt** (cut one information level, `pad` token) |
| 02 Selected work — vertical index + sticky colour preview | `WorkGallery.jsx` | **Replace** → `WorkIndex.jsx` + `WorkPreview.jsx` |
| Statement band (~70vh, full-bleed) | — | **New** `Statement.jsx` (uses existing `SplitTextReveal`) |
| 03 How I work — 4 rows scope/build/ship/maintain + artefact | — | **New** `Process.jsx` |
| 04 Journey — single column, year-grouped, loud dates | `Journey.jsx` + `TimelineItem.jsx` | **Rebuild** (keep the fetch + fallback logic) |
| Full-bleed 21:9 colour crop (anchor 3) | — | **New** `BleedImage.jsx` |
| 05 Ways to work together — rows, expand in place, no cards | `Pricing.jsx` | **Replace** → `Engagement.jsx` (accordion pattern lifted from current FAQ) |
| FAQ moved under the form, retitled "Before you write" | FAQ inside `Pricing.jsx` | **Extract** → `Faq.jsx` |
| 06 Contact — form unchanged, new frame | `Contact.jsx` | **Adapt** (frame + a11y only; form internals kept) |
| "What happens next" 3 mono steps | — | **New** `WhatsNext.jsx` |
| Mono label primitive (`HOME / 02 — SELECTED WORK`, tags, captions) | `ui/SectionLabel.jsx` | **Adapt** + **New** `ui/Meta.jsx` |
| Navbar — mono links, availability dot, 44px targets | `Navbar.jsx` | **Adapt** |
| Footer — marquee out, email as display type, GRID toggle | `Footer.jsx` | **Adapt** + **New** `GridOverlay.jsx` |
| Cursor — dot always, labelled disc over media only, no idle ring | `Cursor.jsx` | **Adapt** (simplify) |
| Case study — spec table, 01–07, index rail, colour bleed, navbar | `ProjectDetail.jsx` | **Rebuild** |
| About — "How I decide", video as figure, facts removed | `pages/AboutPage.jsx` | **Adapt** |
| Buttons — 3 variants, 0.15 magnetic, no shine | `ui/Button.jsx`, `hooks/useMagnetic.js` | **Adapt** |

## B. Reused as-is (zero or near-zero change)

`lib/api.js` (whole cache/dedupe layer) · `context/SettingsContext.jsx` · `context/ToastContext.jsx`
· `context/AuthContext.jsx` · `ProtectedRoute.jsx` · `lib/adminApi.js` · the entire `admin/` tree
· `CvPage.jsx` + `lib/pdf.js` + `hooks/useCvDownload.js` · `lib/techIcons.jsx` +
`components/Technologies.jsx` (About only) · `components/ui/Icons.jsx` ·
`components/ui/SplitTextReveal.jsx` (duration retuned only) · `components/ui/Skeleton.jsx` ·
`components/GrainOverlay.jsx` · `components/LocalTime.jsx` · `components/WhatsAppButton.jsx` ·
`components/AboutVideo.jsx` (repositioned, not rewritten) · `NotFound.jsx` (token pass only) ·
**the contact form's entire submit/validation/toast logic**.

## C. Replaced (deleted and rewritten)

| Delete | Replaced by |
|---|---|
| `components/WorkGallery.jsx` | `WorkIndex.jsx` + `WorkPreview.jsx` |
| `components/Pricing.jsx` | `Engagement.jsx` + `Faq.jsx` |
| `components/TimelineItem.jsx` | folded into the new `Journey.jsx` grid |
| `components/Preloader.jsx` | nothing — hero's own 900ms reveal is the intro |
| `components/Marquee.jsx` | nothing |
| `lib/smoothScroll.js` (Lenis + GSAP) | native scroll + `scroll-behavior` + `scroll-margin-top` |
| `hooks/usePerf.js` device branch | a single reduced-motion boolean |
| `hooks/useScrollProgressBeam.js` | simplified 1px beam (or dropped with the rail change) |

## D. Adapted (kept, reworked)

`Hero.jsx`, `HeroBackground.jsx`, `Overview.jsx`, `Journey.jsx`, `Contact.jsx`, `Navbar.jsx`,
`Footer.jsx`, `Cursor.jsx`, `ScrollToTop.jsx` (Lenis call → native), `ui/Button.jsx`,
`ui/SectionLabel.jsx`, `useMagnetic.js`, `useSectionNav.js` (Lenis → native smooth scroll),
`layouts/SiteLayout.jsx` (preloader gate + ScrollTrigger refresh removed, deep-link hash scroll
kept), `pages/HomePage.jsx` (new section order), `pages/AboutPage.jsx`, `ProjectDetail.jsx`,
`lib/motion.js` (DUR.reveal .8→.6, STAGGER .08→.06, fadeUp y 40→24, add `revealPreview`, delete
blur variants), `index.css`, `tailwind.config.js`, `index.html` (JetBrains Mono + preload).

## E. Functionality that must be preserved — acceptance checklist

1. `/api/bootstrap` single-request boot, cache seeding, in-flight dedupe, 5-min TTL, cross-tab bust.
2. Every existing fetcher keeps its signature; no component fetches twice.
3. Contact form: POST, 422 field errors in `signal`, generic error, success check, toasts, reset.
4. Case study `/work/:id` renders from `fetchProject(id)`, sets `document.title`, handles not-found.
5. CV: `fetchCv` + lazy `jspdf` import on click, loading flag, error toast, `/cv` page intact.
6. Admin: login, Sanctum token, 401 handling, every editor, `clearPublicCache()` after writes.
7. Self-hiding sections: no data → `return null`; numbering rendered from the **filtered** list.
8. Loading: pricing/engagement skeletons, project fallbacks, no layout shift.
9. Errors: visible copy + Retry, never an endless spinner.
10. Empty: fallback projects + `NO PREVIEW` plate; the design must survive an empty database.
11. Anchor navigation + retired-route redirects + `/#contact` deep links keep working.
12. Reduced motion: opacity-only, 0.2s, no transforms, instant preview switch.
13. Focus-visible outline, Escape-closes-menu, body-scroll lock, 44px targets.

## F. Routes

**No route is added or removed.** Changes are internal:

| Route | Change |
|---|---|
| `/` | New section order + new anchor ids |
| `/about` | Content re-cut (03 → "How I decide"), facts removed |
| `/work/:id` | **Navbar + footer restored** (currently bare) — a LinkedIn visitor can reach the site |
| `/cv`, `/admin/*`, `*` | Unchanged (token pass only) |
| `/contact` `/pricing` `/projects` `/blog` | Redirects stay; targets updated if ids are renamed |

**Anchor-id decision needed (see §Decisions):** design labels the sections *Selected work* and
*Ways to work together*. Renaming `#projects → #work` and `#pricing → #engagement` is cleaner but
invalidates any shared `/#pricing` link. Default recommendation: **keep `#projects` and `#pricing`
as the ids**, label them per the design. Zero broken links, no visual difference.

## G. Dependencies

**Remove** — `gsap` (~86 kB), `lenis` (~13 kB), and two already-dead deps found in the audit:
`lottie-react` and `react-intersection-observer` (zero imports anywhere).
**Add** — none via npm. JetBrains Mono 400/500 joins the existing Google Fonts link
(latin subset, ~14 kB) with `preload` for the two hero faces.
**Keep** — `framer-motion` (only motion lib; imported through `LazyMotion` + `domAnimation`),
`axios`, `react-router-dom`, `lucide-react`, `react-icons` (About tech logos), `jspdf` (CV, already
lazy-loaded on click).
**Net:** ≈ **−54 kB gzip** of JS.

## H. Files affected

**New (11):** `components/WorkIndex.jsx`, `components/WorkPreview.jsx`, `components/Engagement.jsx`,
`components/Faq.jsx`, `components/Process.jsx`, `components/Statement.jsx`,
`components/MetricsRule.jsx`, `components/BleedImage.jsx`, `components/WhatsNext.jsx`,
`components/GridOverlay.jsx`, `components/ui/Meta.jsx`.

**Modified (24):** `tailwind.config.js`, `index.html`, `src/index.css`, `src/lib/motion.js`,
`src/lib/api.js` (only if new fetchers are added), `src/hooks/useSectionNav.js`,
`src/hooks/useMagnetic.js`, `src/hooks/usePerf.js`, `src/layouts/SiteLayout.jsx`, `src/App.jsx`,
`src/pages/HomePage.jsx`, `src/pages/AboutPage.jsx`, `src/ProjectDetail.jsx`, `src/NotFound.jsx`,
`src/CvPage.jsx`, `components/Hero.jsx`, `HeroBackground.jsx`, `Overview.jsx`, `Journey.jsx`,
`Contact.jsx`, `Navbar.jsx`, `Footer.jsx`, `Cursor.jsx`, `ScrollToTop.jsx`, `ui/Button.jsx`,
`ui/SectionLabel.jsx`, `ui/SplitTextReveal.jsx`.

**Deleted (7):** `components/WorkGallery.jsx`, `components/Pricing.jsx`, `components/TimelineItem.jsx`,
`components/Preloader.jsx`, `components/Marquee.jsx`, `lib/smoothScroll.js`,
`hooks/useScrollProgressBeam.js`.

**Admin (token-compat only, no redesign):** every file under `src/admin/` uses `text-heading`,
`text-muted`, `border-line`, `rounded-xl`, `shadow-soft`. See decision D2.

**Backend / admin editors (only if we adopt the new content fields):**
`Admin/PricingController.php` (validation for the engagement shape),
`admin/pages/Pricing.jsx` (tier editor → engagement editor),
`admin/pages/Settings.jsx` (new fields), optionally a `kind` column on `journey_milestones`
and a short `outcome_metric` on `projects`.

---

## 3. Content model — what the new design needs from the API

| Field | Where it lives | Migration? |
|---|---|---|
| `settings.statement` (statement band) | settings JSON | **No** — key/value store |
| `settings.metrics[]` `{value,label}` (proof strip / metrics rule) | settings JSON | **No** |
| `settings.response_time`, `settings.availability` | settings JSON | **No** |
| `settings.process[]` `{title,body,artifact}` (How I work) | settings JSON | **No** |
| `engagement[]` `{title,best_for,deliverables[],timeline,price_from,period,cta}` | replaces `pricing.tiers` | **Controller validation change** |
| `projects.problem`, `projects.outcome` | **already exist** ✅ | No |
| Short outcome figure ("−38% dispatch time") | currently only long `outcome` text | Recommend new `outcome_metric` column (P2) or reuse `outcome` with a length rule |
| `projects.architecture[]` (case-study diagram) | `architecture_notes` text exists | Optional, P2 |
| Journey `kind` chip (EDUCATION / FREELANCE / …) | not present | New column **or** derive from the first `tags[]` entry (P2) |

Everything above is optional at the consumer: each section keeps its `null` guard and self-hides,
so the site never breaks while the dashboard is being filled in.

---

## 4. Execution phases (follows the design's own P0/P1/P2)

**P0 — foundation.** Token pass in `tailwind.config.js` + `index.css` (colours → `ink-*`, 9 type
tokens, 2 radii, 4 spacing tokens, delete dead tokens/keyframes/shadows, `color-scheme: dark`,
`scroll-margin-top`, tabular-nums on mono); JetBrains Mono loaded; delete Preloader + Lenis + GSAP
and rewire `useSectionNav` / `SiteLayout` / `ScrollToTop` / `Navbar` to native scroll; retune
`lib/motion.js`; contact-form a11y (real `<label>`, `aria-describedby`, `aria-live`,
`autocomplete`). **Ships the fix for debt items 3–8 and −54 kB, with the old layout still intact.**

**P1 — the level change.** `WorkIndex` + `WorkPreview`; hero rebuild + labelled diagram + proof
strip; `Engagement` + `Faq`; `MetricsRule` + `Statement`; IA reorder + scoped numbering in
`SectionLabel`; `Overview` tightened.

**P2 — signature.** Case study 01–07 + spec table + index rail + restored navbar; `Journey` re-cut;
About "How I decide"; footer email display type + `GridOverlay`; cursor reduction; `BleedImage`;
`LazyMotion`; image `loading`/`width`/`height` pass.

Each phase ends with: `npm run build` clean, a manual pass over §E's 13 checks, and a bundle-size
diff in the commit message. Phases are independently revertable.

---

## 5. Risks

| Risk | Mitigation |
|---|---|
| Token rename touches ~40 files incl. admin | Keep `heading/body/muted/line` as **aliases** to the new `ink-*` values during migration; admin keeps rendering identically; aliases deleted only after a full visual pass |
| Removing Lenis changes anchor-scroll timing | `useSectionNav` switches to `scrollIntoView({behavior:'smooth'})` + `scroll-margin-top` on section ids; the retired-route redirects and `/#contact` deep links are re-tested explicitly |
| Removing the preloader changes `SiteLayout`'s `loaded` gate | The deep-link hash effect currently depends on it — it will key off mount + data-ready instead |
| Engagement shape breaks the admin pricing editor | Backend accepts **both** shapes for one release; `Engagement.jsx` falls back to mapping legacy `tiers[]` → rows, so nothing goes blank if the dashboard hasn't been updated |
| Work preview needs real screenshots | Grayscale-at-rest still works with the existing images; the `NO PREVIEW` mono plate replaces the fake-image SVG placeholder |
| Undrawn breakpoints | Built from §4/§7 prose; every judgement call flagged in the PR for your review |

---

## 6. Decisions I need from you before starting

**D1 — Scope of this pass.** All three phases (P0+P1+P2), or P0+P1 now and P2 after you have
reviewed the new home page live?

**D2 — Admin dashboard.** Confirm it stays visually as-is (I only keep the colour aliases so it
doesn't break). The design docs never cover it.

**D3 — Anchor ids.** Keep `#projects` / `#pricing` (no broken shared links, recommended), or rename
to `#work` / `#engagement` and update the redirects?

**D4 — Content fields.** Do you want me to add the admin editors for `statement`, `metrics[]`,
`process[]`, `response_time` and the engagement rows in this pass (so you can actually fill them),
or ship the frontend reading them with seeded defaults and wire the dashboard after?

**D5 — Journey `kind` + `outcome_metric`.** Add the two small backend columns (a migration + two
admin inputs), or derive both from existing fields for now?

**D6 — Undrawn screens.** Build from the written spec (my default), or pause and have Claude Design
draw *What I do*, *How I work*, *Journey*, *About*, *Case study* and the mobile set first?

**D7 — Branch.** Work on a `redesign/v2` branch with one commit per phase (recommended), or
straight onto `main`?
