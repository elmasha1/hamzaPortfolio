import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUp, ArrowUpRight, Github, Linkedin, Mail, Whatsapp } from './ui/Icons'
import Marquee from './Marquee'
import LocalTime from './LocalTime'
import { scrollToTop } from '../lib/scroll'
import { useSettings } from '../context/SettingsContext'
import useSectionNav from '../hooks/useSectionNav'

// Work / pricing / contact are sections of the home scroll, not routes.
const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Work', to: '/', hash: '#projects' },
  { label: 'Pricing', to: '/', hash: '#pricing' },
  { label: 'Contact', to: '/', hash: '#contact' },
]

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Footer() {
  const { settings } = useSettings()
  const goToSection = useSectionNav()

  const s = settings.socials || {}
  const wa = (settings.whatsapp_number || '').replace(/\D/g, '')
  const available = settings.available !== false
  const location = settings.location || ''
  const year = new Date().getFullYear()

  const socials = [
    s.github && { label: 'GitHub', href: s.github, Icon: Github },
    s.linkedin && { label: 'LinkedIn', href: s.linkedin, Icon: Linkedin },
    s.email && { label: 'Email', href: `mailto:${s.email}`, Icon: Mail },
    wa && { label: 'WhatsApp', href: `https://wa.me/${wa}`, Icon: Whatsapp },
  ].filter(Boolean)

  return (
    <footer className="relative border-t border-line">
      {/* Looping name / role marquee */}
      <div className="overflow-hidden border-b border-line py-4">
        <Marquee
          items={['Available for work', "Let's work together", 'Full-Stack Developer', 'React · Laravel', 'EL MASDOUKI Hamza']}
          className="font-heading text-sm uppercase tracking-[0.14em] text-muted"
        />
      </div>

      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="container-px py-16 sm:py-24"
      >
        {/* Closing CTA */}
        <p className="eyebrow">Have a project in mind?</p>
        <Link
          to="/#contact"
          onClick={(e) => goToSection('#contact', e)}
          data-cursor="hover"
          className="group mt-5 inline-flex items-center gap-4 font-heading text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-heading"
        >
          Let&rsquo;s work together
          <ArrowRight
            size={44}
            className="shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-2"
          />
        </Link>

        {/* Columns */}
        <div className="mt-16 grid gap-10 border-t border-line pt-12 sm:grid-cols-3">
          {/* Navigate */}
          <div>
            <p className="eyebrow mb-5">Navigate</p>
            <ul className="space-y-2.5">
              {NAV.map((n) => (
                <li key={n.label}>
                  <Link
                    to={n.hash ? n.to + n.hash : n.to}
                    onClick={n.hash ? (e) => goToSection(n.hash, e) : undefined}
                    data-cursor="hover"
                    className="group inline-flex items-center gap-1.5 text-body transition-colors hover:text-heading"
                  >
                    {n.label}
                    <ArrowUpRight size={13} className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Find me online */}
          <div>
            <p className="eyebrow mb-5">Find me online</p>
            <ul className="space-y-2.5">
              {socials.map((soc) => (
                <li key={soc.label}>
                  <a href={soc.href} target="_blank" rel="noreferrer" data-cursor="hover" className="group inline-flex items-center gap-2.5 text-body transition-colors hover:text-heading">
                    <soc.Icon size={16} className="shrink-0" />
                    {soc.label}
                    <ArrowUpRight size={13} className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Status / meta */}
          <div className="space-y-3">
            <p className="eyebrow mb-5">Status</p>
            <div className="flex items-center gap-2.5 text-body">
              <span className="relative flex h-2 w-2">
                {available && <span className="absolute inline-flex h-full w-full rounded-full bg-white/60 motion-safe:animate-pulse-ring" />}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${available ? 'bg-white' : 'bg-muted'}`} />
              </span>
              {available ? 'Available for work' : 'Currently booked'}
            </div>
            {location && <p className="text-body">{location}</p>}
            <LocalTime className="block text-body" />
            {s.email && (
              <a href={`mailto:${s.email}`} data-cursor="hover" className="block text-body transition-colors hover:text-heading">
                {s.email}
              </a>
            )}
          </div>
        </div>

        {/* Oversized wordmark → back to top */}
        <button
          onClick={scrollToTop}
          data-cursor="hover"
          aria-label="Back to top"
          className="group mt-16 flex w-full items-end justify-between gap-6 text-left"
        >
          <span className="font-heading text-[clamp(3.5rem,17vw,13rem)] font-semibold leading-[0.85] tracking-[-0.04em] text-heading">
            Hamza<span className="text-muted">®</span>
          </span>
          <span className="mb-3 hidden shrink-0 items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted transition-colors group-hover:text-heading sm:inline-flex">
            Back to top
            <ArrowUp size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </span>
        </button>

        {/* Bottom meta */}
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <span>© {year} EL MASDOUKI Hamza — All rights reserved.</span>
          <span>Built with React, Tailwind, GSAP &amp; Laravel</span>
        </div>
      </motion.div>
    </footer>
  )
}
