/** @type {import('tailwindcss').Config} */

/* ============================================================
   DESIGN SYSTEM v2
   Eight measured colours, nine type tokens, two radii, one
   section rhythm. Ratios are against `paper` (#0D0D0D).

   LEGACY BLOCK: the tokens under "legacy aliases" exist only so
   the admin dashboard (out of scope for the redesign) keeps
   rendering exactly as before. Do not use them in new public
   code — and note `ink` (no suffix) is the LEGACY near-black
   page colour, while `ink-100…700` is the v2 text ramp. New
   code writes `bg-paper` / `text-ink-100`.
   ============================================================ */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* ---- v2: surfaces ---- */
        paper: '#0D0D0D', // page
        'paper-2': '#141414', // bands, media plates

        /* ---- v2: text ramp (contrast vs paper) ---- */
        ink: {
          DEFAULT: '#0D0D0D', // LEGACY page colour — see note above
          100: '#F5F5F4', // 17.6:1 — headings
          300: '#A8A5A0', // 7.4:1  — body
          500: '#7E7B76', // 5.3:1  — meta (smallest text in the system)
          700: '#3A3835', // never text — dividers on media, disabled marks
        },

        /* ---- v2: rules (two weights) ---- */
        rule: 'rgba(255,255,255,0.20)', // structural: sections, frames, outlines
        'rule-soft': 'rgba(255,255,255,0.10)', // interior: grid gaps, list separators

        /* ---- v2: the one non-mono colour ---- */
        signal: '#F87171', // form errors only

        /* ---- legacy aliases (admin dashboard only) ---- */
        line: 'rgba(255,255,255,0.12)',
        heading: '#FAFAFA',
        body: '#8A8A8A',
        muted: '#6B6B6B',
        coral: '#F87171',
        teal: '#A1A1A1',
        dark: '#000000',
        paperwhite: '#FFFFFF',
        primary: {
          DEFAULT: '#FFFFFF',
          300: '#FFFFFF',
        },
        base: {
          soft: '#0D0D0D',
          indigo: '#141414',
        },
      },

      fontFamily: {
        // Inter explains, Space Grotesk states, JetBrains Mono annotates.
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      /* Nine tokens on a ~1.28 desktop ratio. Line-height and tracking are
         baked in, so call sites never write clamp() again.
         NOTE: there is deliberately NO `body` size token — body copy is the
         base <body> style. A `body` entry here would collide with the `body`
         colour and silently resize every `text-body` call site. */
      fontSize: {
        display: ['clamp(3.5rem, 10vw, 8rem)', { lineHeight: '0.90', letterSpacing: '-0.04em' }],
        h1: ['clamp(2.75rem, 6.2vw, 5.25rem)', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
        h2: ['clamp(2rem, 4.2vw, 3.25rem)', { lineHeight: '1.04', letterSpacing: '-0.03em' }],
        h3: ['clamp(1.375rem, 1.9vw, 1.75rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        lead: ['clamp(1.0625rem, 1.4vw, 1.375rem)', { lineHeight: '1.55', letterSpacing: '-0.011em' }],
        small: ['0.9375rem', { lineHeight: '1.6' }],
        meta: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        eyebrow: ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.09em' }],
      },

      letterSpacing: {
        tightish: '-0.02em',
        eyebrow: '0.09em',
      },

      spacing: {
        // The single section rhythm token — one value for the whole site.
        section: 'clamp(6rem, 9vw, 8.5rem)',
      },

      /* Two radii: 0 for everything structural, full for pills/dots/FABs.
         Tailwind's defaults stay available for the admin dashboard only. */
      borderRadius: {
        none: '0px',
      },

      keyframes: {
        // Pulsing "available" dot
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%, 100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        // Hero systems diagram — nodes light up in sequence
        'node-pulse': {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'node-pulse': 'node-pulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
