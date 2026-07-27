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
   focus, and a real <label> that floats up to a small mono caption. */
function Field({ label, name, value, onChange, type = 'text', textarea, error, autoComplete }) {
  const Comp = textarea ? 'textarea' : 'input'
  const errorId = `${name}-error`
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
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`peer w-full border-0 border-b bg-transparent px-0 pb-2.5 pt-7 text-lg text-ink-100 outline-none transition-colors duration-300 placeholder-transparent focus:border-ink-100 ${
          textarea ? 'resize-none' : ''
        } ${error ? 'border-signal' : 'border-rule'}`}
      />
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-0 top-7 origin-left text-base text-ink-500 transition-all duration-300 peer-focus:top-0 peer-focus:font-mono peer-focus:text-eyebrow peer-focus:font-medium peer-focus:uppercase peer-focus:text-ink-100 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:font-mono peer-[:not(:placeholder-shown)]:text-eyebrow peer-[:not(:placeholder-shown)]:uppercase"
      >
        {label}
      </label>
      {error && (
        <p id={errorId} className="mt-2 font-mono text-meta text-signal">
          {error}
        </p>
      )}
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
    <section id="contact" className={`section-y relative overflow-hidden ${className}`}>

      <div className="container-px relative z-10 grid items-center gap-12 lg:grid-cols-2">
        {/* Left — intro + socials */}
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <SectionLabel num={num}>Contact</SectionLabel>
          <SplitTextReveal
            as="h2"
            text="Tell me what you're building."
            amount={0.3}
            className="mt-3 max-w-[16ch] font-heading text-h2 font-semibold text-ink-100"
          />
          <motion.p variants={fadeUp()} className="mt-6 max-w-[42ch] text-lead text-ink-300">
            Product builds, rescue work and full-stack roles — React and Laravel,
            remote from Rabat or on-site. If it ships and someone has to maintain
            it, it&rsquo;s the right message.
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
              autoComplete="name"
              value={form.name}
              onChange={onChange}
              error={errors.name?.[0]}
            />
            <Field
              label="Your email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={onChange}
              error={errors.email?.[0]}
            />
            <Field
              label="What are you building?"
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
                aria-label="Send message"
                className="w-full justify-between disabled:opacity-60 sm:w-auto sm:min-w-[16rem]"
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

            {/* Animated status messages — announced to assistive tech */}
            <div aria-live="polite" role="status">
              <AnimatePresence>
                {state === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 font-medium text-ink-100"
                  >
                    <SuccessCheck />
                    Message sent — I&rsquo;ll get back to you soon.
                  </motion.div>
                )}
                {state === 'error' && Object.keys(errors).length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-medium text-signal"
                  >
                    Something went wrong. Please try again.
                  </motion.div>
                )}
                {state === 'error' && Object.keys(errors).length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-meta text-signal"
                  >
                    Please fix the highlighted fields above.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}
