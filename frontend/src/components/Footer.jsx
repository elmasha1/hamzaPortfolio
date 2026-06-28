import { motion } from 'framer-motion'
import { COLORS, shapes } from './Stickers'
import { Linkedin, Github, Mail, Whatsapp, ArrowRight } from './ui/Icons'
import Button from './ui/Button'
import { scrollToSelector } from '../lib/smoothScroll'
import { useSettings } from '../context/SettingsContext'

const FOOTER_STICKERS = [
  { shape: 'star', color: COLORS.indigo, size: 26, top: '24%', left: '8%' },
  { shape: 'sparkle', color: COLORS.mint, size: 22, top: '62%', left: '88%' },
  { shape: 'circle', color: COLORS.sky, size: 16, top: '34%', left: '70%' },
  { shape: 'plus', color: COLORS.indigo, size: 18, top: '70%', left: '20%' },
]

function buildSocials(settings) {
  const s = settings.socials || {}
  const wa = (settings.whatsapp_number || '').replace(/\D/g, '')
  const list = []
  if (s.linkedin) list.push({ label: 'LinkedIn', Icon: Linkedin, href: s.linkedin })
  if (s.github) list.push({ label: 'GitHub', Icon: Github, href: s.github })
  if (wa)
    list.push({
      label: 'WhatsApp',
      Icon: Whatsapp,
      href: `https://wa.me/${wa}?text=${encodeURIComponent(settings.whatsapp_message || 'Hi!')}`,
    })
  if (s.email) list.push({ label: 'Email', Icon: Mail, href: `mailto:${s.email}` })
  return list
}

export default function Footer() {
  const { settings } = useSettings()
  const SOCIALS = buildSocials(settings)

  const toContact = (e) => {
    e.preventDefault()
    scrollToSelector('#contact')
  }

  return (
    <footer className="relative overflow-hidden bg-dark text-white">
      {/* Subtle decorative stickers (low opacity on dark) */}
      {FOOTER_STICKERS.map((s, i) => {
        const Shape = shapes[s.shape]
        return (
          <motion.div
            key={i}
            className="absolute opacity-30"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
            animate={{ y: [0, -12, 0], rotate: [0, 20, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 24 24" width="100%" height="100%">
              {Shape(s.color)}
            </svg>
          </motion.div>
        )
      })}

      {/* CTA */}
      <div className="container-px relative z-10 flex flex-col items-center gap-7 py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-3xl font-semibold tracking-tightish text-white sm:text-4xl"
        >
          Let's build something{' '}
          {/* Shimmering accent that continuously sweeps light across the word */}
          <span
            className="bg-clip-text text-transparent motion-safe:animate-shimmer"
            style={{
              backgroundImage:
                'linear-gradient(110deg, #BFDBFE 20%, #FFFFFF 40%, #5EEAD4 55%, #BFDBFE 80%)',
              backgroundSize: '200% auto',
            }}
          >
            remarkable.
          </span>
        </motion.h2>

        <p className="max-w-md text-slate-300">
          Have a project, a role, or an idea in mind? I'd love to hear about it.
        </p>

        <Button as="a" href="#contact" onClick={toContact} className="px-7 py-3.5">
          Start a conversation
          <ArrowRight className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
        </Button>

        {/* Socials */}
        <div className="mt-2 flex gap-3">
          {SOCIALS.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              whileHover={{ y: -4, scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            >
              <s.Icon size={20} />
            </motion.a>
          ))}
        </div>

        <div className="mt-6 flex w-full flex-col items-center gap-2 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:justify-between">
          <a href="#home" className="font-heading text-base text-white">
            &lt;Hamza/&gt;
          </a>
          <p>
            © {new Date().getFullYear()} EL MASDOUKI Hamza. Built with React,
            Tailwind, Framer Motion & Laravel.
          </p>
        </div>
      </div>
    </footer>
  )
}
