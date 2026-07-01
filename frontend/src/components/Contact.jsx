import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendContactMessage } from '../lib/api'
import { staggerContainer, fadeUp, fadeIn, viewportOnce } from '../lib/motion'
import Reveal from './Reveal'
import Button from './ui/Button'
import SectionLabel from './ui/SectionLabel'
import SplitTextReveal from './ui/SplitTextReveal'
import { Send, Linkedin, Github, Mail, Whatsapp } from './ui/Icons'
import { useSettings } from '../context/SettingsContext'
import { useToast } from '../context/ToastContext'

/* Build the social list from dashboard settings (incl. WhatsApp). */
function buildSocials(settings) {
  const s = settings.socials || {}
  const wa = (settings.whatsapp_number || '').replace(/\D/g, '')
  const mono = 'hover:bg-white hover:text-ink'
  const list = []
  if (s.linkedin)
    list.push({ label: 'LinkedIn', Icon: Linkedin, href: s.linkedin, color: mono })
  if (s.github)
    list.push({ label: 'GitHub', Icon: Github, href: s.github, color: mono })
  if (wa)
    list.push({
      label: 'WhatsApp',
      Icon: Whatsapp,
      href: `https://wa.me/${wa}?text=${encodeURIComponent(settings.whatsapp_message || 'Hi!')}`,
      color: mono,
    })
  if (s.email)
    list.push({ label: 'Email', Icon: Mail, href: `mailto:${s.email}`, color: mono })
  return list
}

/* Minimal underline field: transparent bg, 1px bottom border that brightens on
   focus, and a label that floats up to a small wide-tracked caption. */
function Field({ label, name, value, onChange, type = 'text', textarea, error }) {
  const Comp = textarea ? 'textarea' : 'input'
  return (
    <motion.div variants={fadeIn('right')} className="relative">
      <Comp
        id={name}
        name={name}
        type={textarea ? undefined : type}
        value={value}
        onChange={onChange}
        required
        rows={textarea ? 4 : undefined}
        placeholder=" "
        aria-label={label}
        className={`peer w-full border-0 border-b bg-transparent px-0 pb-2.5 pt-7 text-lg text-heading outline-none transition-colors duration-300 placeholder-transparent focus:border-white ${
          textarea ? 'resize-none' : ''
        } ${error ? 'border-coral' : 'border-line'}`}
      />
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-0 top-7 origin-left text-base text-muted transition-all duration-300 peer-focus:top-0 peer-focus:text-[11px] peer-focus:font-medium peer-focus:uppercase peer-focus:tracking-[0.14em] peer-focus:text-heading peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.14em]"
      >
        {label}
      </label>
      {error && <p className="mt-2 text-sm text-coral">{error}</p>}
    </motion.div>
  )
}

/* Success checkmark that draws itself in (circle + tick path length). */
function SuccessCheck() {
  return (
    <svg viewBox="0 0 52 52" className="h-7 w-7 shrink-0">
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
      <motion.path
        d="M16 27l7 7 14-15"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.45, ease: 'easeOut' }}
      />
    </svg>
  )
}

export default function Contact({ num = '05', className = '' }) {
  const { settings } = useSettings()
  const toast = useToast()
  const socials = buildSocials(settings)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [state, setState] = useState('idle') // idle | sending | success | error
  const [errors, setErrors] = useState({})

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setState('sending')
    setErrors({})
    try {
      await sendContactMessage(form)
      setState('success')
      setForm({ name: '', email: '', message: '' })
      toast.success("Message sent — I'll be in touch soon!")
      setTimeout(() => setState('idle'), 5000)
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
        toast.error('Please fix the highlighted fields.')
      } else {
        toast.error('Something went wrong. Please try again.')
      }
      setState('error')
    }
  }

  return (
    <section id="contact" className={`relative overflow-hidden py-24 sm:py-32 ${className}`}>

      <div className="container-px relative z-10 grid items-center gap-12 lg:grid-cols-2">
        {/* Left — intro + socials */}
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <SectionLabel num={num}>Get in touch</SectionLabel>
          <SplitTextReveal
            as="h2"
            text="Let's work together."
            amount={0.3}
            className="mt-3 font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-heading"
          />
          <motion.p variants={fadeUp()} className="mt-6 max-w-md text-base text-body">
            Have a project, a role, or an idea in mind? I'm available for freelance
            and full-time work — I usually reply within a day.
          </motion.p>

          <motion.div variants={fadeUp()} className="mt-8 flex flex-wrap gap-3">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                whileHover={{ scale: 1.15, y: -4 }}
                whileTap={{ scale: 0.9 }}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-white/[0.04] text-heading shadow-soft transition-colors ${s.color}`}
              >
                <s.Icon size={20} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — form */}
        <Reveal as="form" onSubmit={handleSubmit} delay={0.1}>
          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="relative space-y-9"
          >
            <Field
              label="Your name"
              name="name"
              value={form.name}
              onChange={onChange}
              error={errors.name?.[0]}
            />
            <Field
              label="Your email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              error={errors.email?.[0]}
            />
            <Field
              label="Tell me about your project..."
              name="message"
              textarea
              value={form.message}
              onChange={onChange}
              error={errors.message?.[0]}
            />

            <motion.div variants={fadeUp()} className="pt-2">
              <Button
                type="submit"
                variant="secondary"
                disabled={state === 'sending'}
                className="w-full justify-between px-7 py-4 text-base disabled:opacity-60 sm:w-auto sm:min-w-[15rem]"
              >
                {state === 'sending' ? (
                  <>
                    Sending
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  </>
                ) : (
                  <>
                    Send message
                    <Send size={18} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </motion.div>

            {/* Animated status messages */}
            <AnimatePresence>
              {state === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 font-medium text-heading"
                >
                  <SuccessCheck />
                  Message sent — I'll get back to you soon.
                </motion.div>
              )}
              {state === 'error' && Object.keys(errors).length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-medium text-coral"
                >
                  Something went wrong. Please try again.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}
