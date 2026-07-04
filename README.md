# EL MASDOUKI Hamza — Full-Stack Developer Portfolio

A minimal **black-and-white editorial** (`#0D0D0D` / `#FFFFFF`), Swiss-typography
full-stack developer portfolio with ultra-smooth reference-style motion.

- **Frontend:** React (Vite) + Tailwind CSS + GSAP/ScrollTrigger + Lenis + Framer Motion
- **Backend:** Laravel REST API + Sanctum admin
- **Database:** MySQL (settings, projects, blog posts, contact messages)

**Pages / routes:** `/` (home: hero → Overview "what I do" → My Journey timeline →
Selected work → contact) · `/about` · `/projects` · `/contact` · `/blog` +
`/blog/:slug` · `/playground` · `/work/:id` (case study) · `/cv` · `/admin/*`.

Motion: a counting preloader (with a hard fallback timeout), Lenis smooth scroll,
split-text reveals, clip-path image reveals, looping marquees, a custom cursor
("View" / "Drag"), magnetic buttons, a full-screen menu overlay, and smooth
page transitions — all with `prefers-reduced-motion` + touch fallbacks.

> **Run the frontend on port 5173** (`npm run dev`): the API's CORS allow-list is
> `http://localhost:5173`, so blog posts / projects / settings only load there.

---

## 📁 Project structure

```
EL_MASDOUKI_HAMZA/
├── frontend/                  # React + Vite + Tailwind + Framer Motion
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js     # custom bright color palette
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── .env                   # VITE_API_URL
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── photo.jpg          # ← add YOUR photo here (circular hero slot)
│   │   └── cv.pdf             # ← add YOUR CV here (Download CV button)
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── hooks/
│       │   ├── useMagnetic.js  # cursor-following magnetic motion
│       │   └── useTilt.js      # 3D mouse-tracked tilt + cursor glare
│       ├── lib/
│       │   ├── api.js          # axios client (fetchProjects, sendContactMessage)
│       │   ├── motion.js       # shared Framer Motion variants
│       │   └── smoothScroll.js # Lenis momentum smooth-scroll wrapper
│       └── components/
│           ├── Reveal.jsx          # reusable fade+slide+blur-in wrapper
│           ├── MeshBackground.jsx  # slow drifting gradient mesh
│           ├── ScrollProgress.jsx  # top scroll-progress bar
│           ├── Preloader.jsx       # 0→100% loader + curtain reveal
│           ├── Stickers.jsx        # floating sticker field + shape library
│           ├── ParallaxStickers.jsx# scroll-parallax background stickers
│           ├── Cursor.jsx          # custom animated cursor
│           ├── Navbar.jsx          # glass sticky nav + mobile menu
│           ├── Hero.jsx            # typing effect, photo ring, blobs
│           ├── Stats.jsx           # count-up counters
│           ├── About.jsx           # bio + animated skill bars
│           ├── TechStack.jsx       # colorful tech badges
│           ├── ProjectCard.jsx     # 3D tilt card (+ featured layout)
│           ├── Projects.jsx        # API fetch + featured first + filter tabs
│           ├── Contact.jsx         # animated form → POST /api/contact
│           ├── Footer.jsx          # dark CTA panel
│           ├── WhatsAppButton.jsx  # floating WhatsApp CTA
│           ├── ScrollToTop.jsx     # appears after scrolling
│           ├── BrowserFrame.jsx    # browser mockup around screenshots
│           ├── ProjectModal.jsx    # animated case-study detail view (lazy)
│           └── ui/
│               ├── Button.jsx      # luxury button (magnetic + shine sweep)
│               ├── MagneticButton.jsx  # (legacy helper, still available)
│               └── Icons.jsx       # lucide-react icons + GitHub/LinkedIn marks
│       ├── hooks/usePerf.js        # reduced-motion / low-end / touch detection
│       ├── context/                # Settings, Toast, Auth providers
│       ├── PublicSite.jsx          # the public portfolio (was App)
│       └── admin/                  # /admin dashboard
│           ├── AdminApp.jsx        # admin routes
│           ├── AdminLayout.jsx     # sidebar + topbar + page transitions
│           ├── ProtectedRoute.jsx  # redirects to login if unauthenticated
│           ├── components/ConfirmModal.jsx
│           └── pages/              # Login, Overview, Messages, Projects, Settings
│
└── backend/                   # Laravel API (drop into a fresh Laravel app)
    ├── app/Models/Project.php
    ├── app/Models/Message.php
    ├── app/Http/Controllers/ProjectController.php
    ├── app/Http/Controllers/ContactController.php
    ├── app/Http/Requests/StoreContactRequest.php
    ├── database/migrations/..._create_projects_table.php
    ├── database/migrations/..._create_messages_table.php
    ├── database/seeders/ProjectSeeder.php
    ├── database/seeders/DatabaseSeeder.php
    ├── routes/api.php
    ├── config/cors.php
    ├── bootstrap/app.php
    └── .env.example
```

---

## 🚀 Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Opens at **http://localhost:5173**.

1. Put your portrait at `frontend/public/photo.jpg` (a friendly emoji shows if missing).
2. Put your CV at `frontend/public/cv.pdf`.
3. The API base URL lives in `frontend/.env` (`VITE_API_URL`).

> If the API isn't running, the Projects section gracefully falls back to
> built-in sample projects, so the site always looks complete.

---

## 🛠 Backend setup (Laravel + MySQL)

These files are meant to be dropped into a **fresh Laravel 11** app. Quickest path:

```bash
# 1. Create a fresh Laravel app
composer create-project laravel/laravel backend-app
cd backend-app

# 2. Enable API routing + Sanctum (creates routes/api.php, installs Sanctum,
#    adds the personal_access_tokens migration, wires bootstrap/app.php)
php artisan install:api      # answer "yes" to run migrations if asked

# 3. Copy the files from THIS repo's /backend over the generated app:
#    - app/Models/Project.php, Message.php, Setting.php, User.php
#    - app/Http/Controllers/{Project,Contact,Auth,Setting}Controller.php
#    - app/Http/Controllers/Admin/{Message,Project,Setting}Controller.php
#    - app/Http/Requests/StoreContactRequest.php
#    - database/migrations/*  database/seeders/*
#    - routes/api.php
#    - config/cors.php

# 4. Make uploaded project images publicly servable
php artisan storage:link
```

Then configure the database in `.env` (see `backend/.env.example`):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=portfolio
DB_USERNAME=root
DB_PASSWORD=
```

Create the DB and run migrations + seeders (seeds an **admin user**, default
**settings**, and sample **projects**):

```bash
mysql -u root -e "CREATE DATABASE portfolio;"
php artisan key:generate
php artisan migrate --seed
php artisan serve            # http://localhost:8000
```

**Seeded admin login:** `admin@portfolio.test` / `password` — change it after
first sign-in.

### API endpoints

**Public**

| Method | Endpoint        | Description                              |
|--------|-----------------|------------------------------------------|
| GET    | `/api/projects` | Projects (featured first, then `order`)  |
| GET    | `/api/settings` | Site settings (hero, stats, WhatsApp, …) |
| GET    | `/api/pricing`  | Pricing tiers + FAQ (for `/pricing`)     |
| POST   | `/api/contact`  | Validate + store a contact message       |
| POST   | `/api/login`    | Admin login → returns a Sanctum token    |

**Admin** (require `Authorization: Bearer <token>`)

| Method | Endpoint                         | Description                |
|--------|----------------------------------|----------------------------|
| GET    | `/api/me`, `/api/logout`         | Current admin / sign out   |
| GET    | `/api/admin/messages`            | List messages (+unread count) |
| PATCH  | `/api/admin/messages/{id}`       | Mark read/unread           |
| DELETE | `/api/admin/messages/{id}`       | Delete a message           |
| GET/POST | `/api/admin/projects`          | List / create (image upload) |
| PUT/DELETE | `/api/admin/projects/{id}`   | Update / delete            |
| POST   | `/api/admin/projects/reorder`    | Persist card order         |
| GET/PUT | `/api/admin/settings`           | Read / bulk-update settings |
| GET/PUT | `/api/admin/pricing`            | Read / update pricing (tiers, footnote, FAQ) |

**Managing pricing:** Admin → **Pricing** lets you edit the heading/subline,
the footnote (VAT / retainer note), the three tiers (name, price, delivery,
description, one-feature-per-line checklist, "Highlighted" flag for the
*Most popular* card, CTA label) and the FAQ items. Changes appear on
`/pricing` immediately — no deploy needed.

`POST /api/contact` body:

```json
{ "name": "Jane", "email": "jane@mail.com", "message": "Hi there!" }
```

Validation errors return HTTP **422** with an `errors` object that the forms
display inline. Project image uploads are stored on the `public` disk and
served from `APP_URL/storage/...` (hence `php artisan storage:link`).

### Profile photo (admin upload)

Change your photo in **Admin → Settings → Profile photo**: drag-and-drop or
click to browse (JPG/PNG/WEBP, ≤4 MB, with preview + progress). The server
(`POST /api/admin/profile-photo`, Sanctum-protected) validates the file,
resizes it to ≤1200 px, converts it to **webp** (GD), stores it under
`storage/app/public/profile/` with a timestamped name (so browsers never show
a stale cached image), deletes the previous file, and saves the URL to the
`profile_photo` setting. The **hero**, **About**, and **CV/PDF** all read that
setting, so the photo updates everywhere immediately. "Remove photo" deletes
the file and falls back to the placeholder. Requires `php artisan
storage:link` (already created).

### CV / Resume

Everything on the CV is edited in **Admin → CV / Resume**: personal info +
contact links, tagline, summary, experiences, key projects, education, grouped
skills, languages, certifications. Changes appear on the on-screen `/cv` page
and in the next PDF download immediately (caches bust on save).

**CV photo:** the "CV photo" section uploads a dedicated (more formal) shot to
`cv_photo` — same optimize pipeline as the profile photo (≤1200 px webp,
old-file cleanup). The CV resolves its photo as `cv_photo` → `profile_photo`
→ initials placeholder, and removing the CV photo falls back automatically.
Saving the CV text never touches the hero photo.

**PDF:** "Download CV" buttons generate the PDF client-side (jsPDF) from the
same data — a two-column A4 with real selectable text (ATS-friendly) and the
photo embedded via `GET /api/cv/photo` (base64 data-URI, which sidesteps CORS
on `/storage` files). Server-side PDF (dompdf) wasn't used because Composer
package installation is unavailable in this environment.

### Admin panel performance

Admin reads go through a 2-minute client cache with in-flight de-duplication
(`frontend/src/lib/adminApi.js`), invalidated by any admin write — navigating
between admin pages is instant. The dashboard uses one consolidated
`GET /api/admin/overview` (counts + recent messages) instead of downloading
whole tables; messages are server-paginated (25/page); frequently
filtered/sorted columns are indexed.

### Performance

The public API is cached on both ends:

- **Server:** every public GET (`/bootstrap`, projects, settings, pricing, …)
  is cached for 5 min (`app/Support/PublicCache.php`) and **auto-invalidated by
  any dashboard write**. Responses carry `Cache-Control` + `ETag` (304s on
  repeat visits).
- **Consolidated bootstrap:** the site loads all shared data in ONE request —
  `GET /api/bootstrap` (settings + projects + journey + technologies + pricing
  + about) — instead of 5–6 separate calls.
- **Client:** `frontend/src/lib/api.js` keeps a 5-min in-memory cache with
  in-flight de-duplication, so repeat navigation makes zero requests.

**In production also run:** `php artisan config:cache route:cache`, enable
**OPcache**, set `APP_DEBUG=false`, and serve via a real web server (nginx +
php-fpm) — `php artisan serve` is a single-threaded dev server and adds
~400 ms framework boot per request.

### CORS

`config/cors.php` already allows `http://localhost:5173`. Add your production
origin there before deploying. Laravel 11 applies CORS automatically. Auth is
**token-based** (Sanctum personal access tokens via `Authorization: Bearer`),
so no CSRF cookie / `supports_credentials` is required.

---

## 🔐 Admin dashboard — how to access & log in

A secure, separate area to manage the whole site after deploy — no code changes
needed. **It is intentionally NOT linked anywhere on the public site** (no
button, no footer link) for security; you reach it only by typing the URL.

### Where it lives

| Page              | URL                                    |
|-------------------|----------------------------------------|
| Login             | `https://your-domain.com/admin`        |
| Dashboard (after login) | `https://your-domain.com/admin/dashboard` (Overview) |

Locally that's **http://localhost:5173/admin**. Type it straight into the
address bar. Any unknown `/admin/*` path redirects back to the login page, and
visiting `/admin` while already signed in jumps straight to the dashboard.

> **Login not working? The API must be running.** Start it with
> `cd backend && php artisan serve` (→ http://localhost:8000) and confirm
> `frontend/.env` has `VITE_API_URL=http://localhost:8000/api`. The login page
> now shows the real cause (server unreachable vs. wrong credentials vs. 401).
> Verified end-to-end: `POST /api/login` returns a Sanctum token, which is
> stored and sent as `Authorization: Bearer …` on every admin request;
> `config/cors.php` already allows the Vite origin (token auth, no cookies).

> **Profile photo:** set it from **Dashboard → Settings → Profile photo URL**
> (saved as `profile_photo`). The hero shows it automatically, falling back to
> the local placeholder when blank. You can also drop a file at
> `frontend/public/photo.jpg`.

### Seeded admin credentials

The database seeder creates a single admin account:

```
Email:    admin@portfolio.test
Password: password
```

Auth is **Laravel Sanctum** (bearer token): only this seeded user can log in.
After login you're redirected to the dashboard; if you're not authenticated,
every `/admin/*` route bounces to `/admin` (the login page).

### Run / reset the admin user (seeder)

```bash
cd backend
# Create or reset just the admin account:
php artisan db:seed --class=AdminUserSeeder
# …or run every seeder (admin + settings + sample projects):
php artisan migrate --seed
```

`AdminUserSeeder` uses `updateOrCreate`, so re-running it is safe and will
**reset the admin back to the seeded password**.

### Change the admin email / password

1. Edit `backend/database/seeders/AdminUserSeeder.php` (the `email` and
   `Hash::make('password')` values), then re-run
   `php artisan db:seed --class=AdminUserSeeder`; **or**
2. Update it directly in MySQL / Tinker:
   ```bash
   php artisan tinker
   >>> $u = App\Models\User::where('email','admin@portfolio.test')->first();
   >>> $u->update(['email' => 'me@example.com', 'password' => Hash::make('a-strong-secret')]);
   ```

> Change the password before going to production — and remove the credentials
> hint shown on the local login page if you don't want it visible.

### What you can manage

- **Overview** (`/admin/dashboard`) — counts (messages, unread, projects) +
  recent messages.
- **Messages** (`/admin/messages`) — list + detail panel, mark read/unread,
  delete (confirm modal, toasts).
- **Projects** (`/admin/projects`) — full CRUD with **image upload + live
  preview**, tech-tag input, featured toggle, and **up/down reordering**
  (persisted via `/projects/reorder`). Delete with confirm.
- **Blog** (`/admin/posts`) — full CRUD for journal posts (title, auto-slug,
  cover URL, excerpt, tags, read time, body, published toggle). Public reads via
  `GET /api/posts` + `GET /api/posts/{slug}`.
- **CV / Resume** (`/admin/cv`) — edit every field of the résumé: personal info
  (name, role, tagline, email, phone, location, website, GitHub, LinkedIn,
  photo), summary, experiences, education, **grouped skills**, **key projects**,
  languages and certifications. Saving updates `GET /api/cv`, so both the
  on-screen **`/cv`** page and the **downloaded PDF** always reflect the latest
  data. Every "CV" / "Download CV" button on the site (navbar, footer, about,
  contact page) generates a **professional, ATS-friendly two-column A4 PDF**
  (real selectable text, embedded photo) named `First-Last-CV.pdf`.
  The CV photo reuses the dashboard **`profile_photo`** — set it in the CV editor
  or drop a same-origin file at `frontend/public/assets/cv-photo.jpg`.
  > PDF generation is **client-side** (jsPDF) because `barryvdh/laravel-dompdf`
  > could not be installed in this environment (package registry blocked). It
  > still produces real selectable text — swap in server-side dompdf later if you
  > prefer, without changing the data model or buttons.
- **Settings** (`/admin/settings`) — WhatsApp, hero title/subtitle/**location
  line**/roles, availability, bio, **Overview** capabilities, **My Journey**
  milestones, Technologies groups, Services, stats, testimonials, and socials.

The login token is a **Sanctum bearer token** stored in `localStorage`,
attached on every request; a 401 clears it and returns you to `/admin`.

The **public site reads all of this from `/api/settings`** via
`SettingsContext`, so editing the dashboard updates the live site. Routing is
handled by `react-router-dom`: `/admin` is the login page, `/admin/*` is the
guarded dashboard, and everything else is the public site. The admin bundle is
**code-split** (`React.lazy`) so public visitors never download it.

> **Production note:** the app is an SPA — configure your host to fall back to
> `index.html` for unknown paths (e.g. Nginx `try_files $uri /index.html;`,
> Netlify `/* /index.html 200`) so deep links like `/admin/projects` work.

## ✨ New on the public site

- **WhatsApp**: floating button (bottom-right, pulse + tooltip) opening
  `wa.me/<number>` with a prefilled message; also added to the Contact + Footer
  socials. Number/message come from dashboard settings.
- **Project showcase**: browser-mockup framed screenshots, a featured
  case-study card with an animated gradient border + cursor glare, hover
  overlays (Live / GitHub / View details), and an animated detail **modal**.
  Filters: All / React / Laravel / Full-stack.
- **Icons:** every icon (public site **and** dashboard) is from
  **`lucide-react`** at a consistent size (18–20) / stroke (1.75). The only
  exceptions are the GitHub/LinkedIn brand marks (lucide dropped brand icons)
  and WhatsApp, which uses `MessageCircle` styled green.
- **Light theme only** — the site is permanently the Cool Slate **light**
  theme. The dark/light toggle and all theme logic have been removed.
- **Toasts** for form success/errors, a **scroll-to-top** button, skeleton
  loaders, and richer SEO/Open-Graph meta tags.

---

## ♿ Accessibility & performance

- **GPU-only animation:** continuous animations move `transform`/`opacity`
  only — no animating of layout/paint props on scroll — with `will-change:
  transform` applied **only while actively animating** (and dropped when idle).
- **Reduced motion + low-end auto-detect:** a shared `useReducedEffects` hook
  (`src/hooks/usePerf.js`) cuts heavy loops when the user prefers reduced
  motion **or** is on a touch / low-core / low-RAM device. The custom cursor,
  3D tilt and Lenis smooth-scroll all disable themselves on touch devices.
- **Throttled pointer work:** the custom cursor, magnetic buttons and 3D tilt
  batch their `getBoundingClientRect` / motion-value updates into a single
  `requestAnimationFrame` and drive Framer `useMotionValue`/`useSpring`
  directly, so per-frame mouse moves never trigger React re-renders.
- **Fewer continuous elements:** decorative sticker fields are hard-capped, and
  parallax uses a single shared `useScroll` listener (no per-element scroll
  handlers).
- **Code-splitting & lazy media:** the `/admin` dashboard and the project
  detail modal are `React.lazy` + `Suspense` chunks; project images are
  `loading="lazy"` with explicit dimensions / `aspect-ratio` to avoid layout
  shift; `ProjectCard` is `React.memo`'d so filtering doesn't re-render the grid.
- **Keyboard nav:** all interactive elements are real `<a>`/`<button>`s with
  focus states; the mobile menu traps scroll.
- **Alt text** on the photo and every project screenshot. Fully responsive
  across mobile / tablet / desktop.

---

## 🎨 Design system (configured in `tailwind.config.js`)

**"Cool Slate Tech"** — light, mature, professional; one clear primary CTA color.

**Typography:** Fraunces (elegant serif headings + stats, `-0.02em` tracking) +
Inter (body/UI, 17px / line-height 1.7), from Google Fonts.
`fontFamily: { sans: [Inter…], heading: [Fraunces…] }`. Type scale: hero ~56px,
h2 ~36px, h3 ~22px, body 17px.

| Token              | Hex       | Use                              |
|--------------------|-----------|----------------------------------|
| primary            | `#2563EB` | Royal blue — buttons, links      |
| primary-700        | `#1E40AF` | Deep blue (headings / gradients) |
| teal (`mint`)      | `#0E7490` | Deep teal secondary accent       |
| dark               | `#0F172A` | Footer / CTA panel               |
| heading            | `#0F172A` | Headings                         |
| body               | `#475569` | Body copy                        |
| muted              | `#94A3B8` | Muted captions / labels          |
| line               | `#E2E8F0` | Hairline borders                 |
| base.white         | `#FFFFFF` | Cards                            |
| base.soft          | `#F8FAFC` | Page base background             |
| base.indigo/hero   | `#EEF3FB` | Hero / soft sections             |

**Buttons (depth / affordance):** `.btn-primary` = blue bg, white text, 10px
radius, `shadow-btn` (drop shadow `0 4px 10px rgba(37,99,235,.28)` + inner
`inset 0 1px 0 rgba(255,255,255,.3)` highlight), an icon, magnetic hover +
scale, and `active scale(0.97)`. `.btn-secondary` = white bg, hairline border,
soft shadow. Defined in `src/index.css`, wrapped by `ui/MagneticButton.jsx`.

> Decorative sticker shapes use soft blue/teal tints (`#93C5FD`, `#BFDBFE`,
> `#5EEAD4`) at **40–60% opacity** — present but tasteful. Shadows are
> blue-tinted and low-opacity. Legacy token names (`sky`, `mint`, `coral`,
> `amber`, `lavender`, `pink`) are kept but remapped to this palette, so every
> component updates automatically. All icons are re-exported from
> `lucide-react` (with consistent size/stroke) via `src/components/ui/Icons.jsx`.

**Selected Work** renders the first project as a **Featured** card — wider,
horizontal, with a “★ Featured” badge, an animated gradient border and a
stronger 3D tilt — to anchor the visual hierarchy; the rest fill a staggered
grid.

## ✨ Animation system

- **Lenis momentum smooth-scroll** (`lib/smoothScroll.js`) drives the page; nav
  links scroll through it. A spring-smoothed **scroll-progress bar** sits at the
  top, and a subtle **gradient mesh** drifts behind everything.
- **`<Reveal>`** gives every block the same fade + slide-up + blur-in on scroll.
- **`useMagnetic`** powers the luxury `<Button>` (gradient sheen, layered
  shadow + inner highlight, **shine sweep** on hover, icon micro-motion, and
  `scale(0.97)` press). **`useTilt`** powers project cards (3D mouse-tracked
  tilt + a glare that follows the cursor).
- **Hero**: per-word headline stagger (blur-in), parallaxed photo, a rotating
  ring with **orbiting dots**, and a pulsing “Available for work” pill.
- **Stats** count up and **bloom** as they land. **Contact** has floating
  labels, focus border-glow, and a **success checkmark that draws itself in**.
  **Footer** headline shimmers.
- Everything honors **`prefers-reduced-motion`**: Lenis, magnetic, tilt,
  parallax, shine, shimmer and the mesh all fall back to simple fades / static.
  Transforms/opacity only for 60fps.

Enjoy! ✦
