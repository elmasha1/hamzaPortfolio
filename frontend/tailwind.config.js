/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep-space background anchors
        deep: '#040A18', // near-black navy (page base)
        glow: '#0F2147', // faint blue glow (center-top)

        // Backgrounds — re-tinted to translucent/dark navy surfaces
        base: {
          white: 'rgba(255,255,255,0.04)', // glassy cards
          soft: '#040A18', // page base (deep space)
          indigo: '#0B1B36', // soft sections
          hero: '#0B1B36',
        },
        // Translucent glass surface for cards/panels on the dark bg
        surface: 'rgba(255,255,255,0.04)',
        'surface-2': 'rgba(255,255,255,0.07)',

        // Primary accent — luminous blue
        primary: {
          DEFAULT: '#3B82F6',
          soft: '#5B8DD6', // softer accent / eyebrow
          50: '#1E2A47',
          100: '#23335A',
          300: '#93C5FD', // light blue (text on dark)
          500: '#3B82F6',
          600: '#2563EB',
          700: '#93C5FD', // light blue so `text-primary-700` stays legible on dark
          800: '#1E3A8A',
        },
        // Secondary accent — soft blue (was teal)
        teal: '#5B8DD6',
        secondary: '#5B8DD6',

        // Dark panel (footer / CTA) — blends into deep space
        dark: '#02060F',

        // --- Legacy token names kept so existing components keep working,
        // --- remapped to the cosmic blue palette ---
        sky: '#3B82F6',
        mint: '#5B8DD6',
        coral: '#F87171', // soft red (validation errors on dark)
        amber: '#A9C8EC', // pale blue (decor)
        lavender: '#93C5FD', // light blue (decor)
        pink: '#A9C8EC', // pale blue (decor)

        // Text — light on dark
        heading: '#F8FAFC', // headings
        body: '#94A3B8', // body copy
        muted: '#64748B', // muted captions / labels
        eyebrow: '#5B8DD6', // eyebrow labels

        // Hairline borders — faint white on the dark bg
        line: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        // Body/UI: Inter. Headings & stats: Space Grotesk (geometric grotesk).
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Refined, editorial scale — dialed down ~10–15% for elegance.
        body: ['0.9375rem', { lineHeight: '1.7', letterSpacing: '-0.01em' }], // 15px
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.14em' }], // 11px caps
        h3: ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }], // 20px
        h2: ['1.875rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }], // 30px
        // Fluid hero: 32px → 54px (refined, airier line-height)
        hero: ['clamp(2rem, 4.5vw, 3.375rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        tightish: '-0.02em',
        eyebrow: '0.14em',
      },
      borderRadius: {
        btn: '10px',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        // Deep, soft shadows with a faint blue glow on the dark bg
        soft: '0 10px 34px -12px rgba(2, 6, 16, 0.7), 0 0 0 1px rgba(255,255,255,0.02)',
        'soft-lg': '0 24px 60px -18px rgba(2, 6, 16, 0.8), 0 0 40px -20px rgba(59,130,246,0.25)',
        glow: '0 0 36px rgba(59, 130, 246, 0.35)',
        'glow-teal': '0 0 36px rgba(91, 141, 214, 0.30)',
        // Primary (off-white pill) button depth
        btn: '0 6px 20px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.04)',
        'btn-hover': '0 10px 30px rgba(0, 0, 0, 0.45), 0 0 24px rgba(245,245,240,0.12)',
        'btn-secondary': '0 2px 10px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        // Pulsing "available" dot
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%, 100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        // Diagonal light glare sweeping across a button
        shine: {
          '0%': { transform: 'translateX(-160%) skewX(-20deg)' },
          '100%': { transform: 'translateX(260%) skewX(-20deg)' },
        },
        // Slowly drifting soft gradient mesh background
        mesh: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(3%, -4%, 0) scale(1.08)' },
          '66%': { transform: 'translate3d(-3%, 3%, 0) scale(0.96)' },
        },
        // Text shimmer sweep (footer headline)
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        // Counter "bloom" as a number lands
        bloom: {
          '0%': { textShadow: '0 0 0 rgba(59,130,246,0)' },
          '40%': { textShadow: '0 0 22px rgba(59,130,246,0.55)' },
          '100%': { textShadow: '0 0 0 rgba(59,130,246,0)' },
        },
        // Twinkling star (opacity only)
        twinkle: {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '0.9' },
        },
        // Gentle opacity "breathe" for the glowing arcs
        breathe: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.9' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shine: 'shine 0.85s cubic-bezier(0.22, 1, 0.36, 1)',
        mesh: 'mesh 22s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        bloom: 'bloom 0.9s ease-out',
        twinkle: 'twinkle 3.5s ease-in-out infinite',
        breathe: 'breathe 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
