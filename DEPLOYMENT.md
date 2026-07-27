# Deployment — Vercel (frontend) + Railway (API + database)

Media lives on Cloudinary. Nothing is served off the app server, which is what
makes this fast and what makes Railway viable at all: its filesystem is wiped
on every deploy, so uploads written to `storage/` would vanish.

---

## 0. Rotate the Cloudinary secret first

The `CLOUDINARY_URL` you sent contains the API secret in plain text. Anywhere
that string has been pasted — chat, notes, a screenshot — should be treated as
public.

Cloudinary Console → Settings → Access Keys → **generate a new key**, disable
the old one, and use the new value everywhere below. It takes a minute and it
is the difference between a private account and one anybody can upload to.

`backend/.env` is git-ignored and the secret is **not** in the repository —
verified. It never goes in `.env.example`, `vercel.json` or any frontend
variable (anything prefixed `VITE_` is compiled into the public bundle).

---

## 1. Railway — API + database

**Create the service**
1. New Project → Deploy from GitHub → pick this repo.
2. Settings → **Root Directory: `backend`**.
3. Add a **MySQL** database to the same project.

`railway.json` and `nixpacks.toml` are already committed, so Railway will:
- `composer install --no-dev --optimize-autoloader` at build,
- run `migrate --force` plus `config:cache`, `route:cache`, `view:cache` as the
  **pre-deploy** step — a failed migration stops the release instead of
  half-deploying it,
- serve `public/` through its own nginx + php-fpm.

**Variables** (Settings → Variables):

```
APP_NAME=PortfolioAPI
APP_ENV=production
APP_DEBUG=false
APP_KEY=            # see below
APP_URL=https://<service>.up.railway.app

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

CACHE_STORE=database
SESSION_DRIVER=database
QUEUE_CONNECTION=sync
LOG_LEVEL=error

FRONTEND_URL=https://<your-project>.vercel.app
CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud>
CLOUDINARY_FOLDER=portfolio
```

`APP_KEY`: run `php artisan key:generate --show` locally and paste the
`base64:…` value. Without it every encrypted value and signed URL breaks.

**Seed the first admin user** — Railway shell:
```bash
php artisan tinker --execute="\App\Models\User::create(['name'=>'Hamza','email'=>'you@example.com','password'=>bcrypt('a-strong-password')]);"
```

---

## 2. Vercel — frontend

1. New Project → same repo → **Root Directory: `frontend`**.
2. Framework preset: Vite (already declared in `vercel.json`).
3. Environment variable:

```
VITE_API_URL=https://<service>.up.railway.app/api
```

Set it for Production **and** Preview, then redeploy — Vite inlines env values
at build time, so changing it later needs a rebuild, not just a restart.

`vercel.json` handles the rest: SPA rewrites so `/work/12` and `/about` resolve
on a hard refresh, immutable caching on the fingerprinted `/assets/*` bundles,
and the usual security headers.

---

## 3. After the first deploy

- [ ] `https://<api>/api/bootstrap` returns JSON.
- [ ] The site loads, and the browser console shows no CORS error. If it does,
      `FRONTEND_URL` doesn't match the origin exactly (scheme, no trailing slash).
- [ ] Log into `/admin`, upload one image — the returned URL should start with
      `https://res.cloudinary.com/`. If it starts with `/storage/`, Railway
      isn't seeing `CLOUDINARY_URL`.
- [ ] Upload a case-study video on a project, open `/work/<id>`: the poster
      frame paints immediately and the clip plays silently on loop.
- [ ] Hard-refresh a deep link like `/work/1` — it must not 404.
- [ ] Replace the `your-domain.com` placeholders in `frontend/index.html`
      (canonical + `og:url`), `public/robots.txt` and `public/sitemap.xml`.

---

## 4. Where the speed comes from

| | |
|---|---|
| Images | Uploaded once, delivered through `f_auto,q_auto` — AVIF/WebP where supported — with a `srcset` per layout slot, so a phone fetches ~640px instead of 2400px. |
| Case-study video | `f_auto,q_auto` picks the codec and bitrate per browser; the poster is derived from frame 0 of the video itself (`so_0`), so the first paint is the exact frame playback starts on and there is no visible swap. `preload="metadata"` keeps the initial request small. |
| Bundles | Route-level code splitting; `LazyMotion` ships only the animation features used (main chunk 110 kB gzip); GSAP, Lenis and the preloader were removed entirely (−51 kB gzip). |
| Layout stability | Every image and video reserves its aspect ratio before it loads, so nothing shifts. |
| Caching | Fingerprinted assets are immutable for a year; the API sends cache headers via `PublicCacheHeaders` and serves the whole site from one `/bootstrap` request. |

---

## 5. Local development

```bash
cd backend  && php artisan serve          # http://localhost:8000
cd frontend && npm run dev                # http://localhost:5173
```

`CLOUDINARY_URL` may be left blank locally — uploads fall back to
`storage/app/public` and everything keeps working (run `php artisan
storage:link` once).

### If you DO want Cloudinary uploads to work locally

Your Windows PHP has no CA bundle configured, so every outbound HTTPS call from
PHP fails with:

```
cURL error 60: SSL certificate ... unable to get local issuer certificate
```

This is a local PHP setup gap, not a code or credentials problem — Railway's
Linux image has a system CA store and is unaffected. To fix it:

1. Download <https://curl.se/ca/cacert.pem>
2. Save it next to `php.ini`:
   `C:\Users\lyrvm\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe\cacert.pem`
3. Add both lines to that `php.ini` (the file already exists, the settings are
   currently empty):

```ini
curl.cainfo = "C:\Users\lyrvm\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe\cacert.pem"
openssl.cafile = "C:\Users\lyrvm\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe\cacert.pem"
```

4. Restart `php artisan serve`.

Until then, local uploads land on the local disk and only deployed uploads
reach Cloudinary.
