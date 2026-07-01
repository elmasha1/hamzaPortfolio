/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Editorial monochrome base — near-black ink + white paper.
        ink: '#0D0D0D',
        paper: '#FFFFFF',
        deep: '#0D0D0D',
        glow: '#0D0D0D',

        base: {
          white: 'rgba(255,255,255,0.03)', // faint glass card
          soft: '#0D0D0D', // page base
          indigo: '#141414', // slightly raised panel
          hero: '#141414',
        },
        surface: 'rgba(255,255,255,0.03)',
        'surface-2': 'rgba(255,255,255,0.06)',

        // "Primary" is now monochrome white — a single, disciplined accent.
        // (Token name kept so existing components keep working.)
        primary: {
          DEFAULT: '#FFFFFF',
          soft: '#A1A1A1',
          50: '#1A1A1A',
          100: '#202020',
          300: '#FFFFFF',
          500: '#FFFFFF',
          600: '#E5E5E5',
          700: '#FFFFFF',
          800: '#FFFFFF',
        },
        teal: '#A1A1A1',
        secondary: '#A1A1A1',

        dark: '#000000',

        // Legacy decorative names neutralised to mono.
        sky: '#FFFFFF',
        mint: '#A1A1A1',
        coral: '#F87171', // validation errors only
        amber: '#A1A1A1',
        lavender: '#A1A1A1',
        pink: '#A1A1A1',

        // Text — white on near-black, Swiss contrast.
        heading: '#FAFAFA',
        body: '#8A8A8A',
        muted: '#6B6B6B',
        eyebrow: '#A1A1A1',

        // Hairline borders.
        line: 'rgba(255,255,255,0.12)',
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
        // Flat, gallery-like — definition comes from hairline borders, not shadows.
        soft: 'none',
        'soft-lg': 'none',
        glow: 'none',
        'glow-teal': 'none',
        btn: 'none',
        'btn-hover': 'none',
        'btn-secondary': 'none',
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
        // Looping marquee strip (the track is duplicated; move by 50%).
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
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
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
