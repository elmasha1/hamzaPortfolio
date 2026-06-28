import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendContactMessage } from '../lib/api'
import { staggerContainer, fadeUp, fadeIn, viewportOnce } from '../lib/motion'
import StickerField from './Stickers'
import Reveal from './Reveal'
import Button from './ui/Button'
import { Send, Linkedin, Github, Mail, Whatsapp } from './ui/Icons'
import { useSettings } from '../context/SettingsContext'
import { useToast } from '../context/ToastContext'

/* Build the social list from dashboard settings (incl. WhatsApp). */
function buildSocials(settings) {
  const s = settings.socials || {}
  const wa = (settings.whatsapp_number || '').replace(/\D/g, '')
  const list = []
  if (s.linkedin)
    list.push({ label: 'LinkedIn', Icon: Linkedin, href: s.linkedin, color: 'hover:bg-primary hover:text-white' })
  if (s.github)
    list.push({ label: 'GitHub', Icon: Github, href: s.github, color: 'hover:bg-dark hover:text-white' })
  if (wa)
    list.push({
      label: 'WhatsApp',
      Icon: Whatsapp,
      href: `https://wa.me/${wa}?text=${encodeURIComponent(settings.whatsapp_message || 'Hi!')}`,
      color: 'hover:bg-[#25D366] hover:text-white',
    })
  if (s.email)
    list.push({ label: 'Email', Icon: Mail, href: `mailto:${s.email}`, color: 'hover:bg-teal hover:text-white' })
  return list
}

/* A floating-label field with a focus border-glow. The label floats up when
   the field is focused or filled (CSS peer + placeholder-shown trick). */
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
        rows={textarea ? 5 : undefined}
        placeholder=" "
        aria-label={label}
        className={`peer w-full rounded-2xl border bg-white/[0.04] px-4 pb-2 pt-6 text-heading outline-none transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/15 ${
          textarea ? 'resize-none' : ''
        } ${error ? 'border-coral' : 'border-line'}`}
      />
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-4 top-4 origin-left text-muted transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
      {error && <p className="mt-1 text-sm text-coral">{error}</p>}
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
        stroke="#5B8DD6"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
      <motion.path
        d="M16 27l7 7 14-15"
        fill="none"
        stroke="#5B8DD6"
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

export default function Contact() {
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
    <section id="contact" className="relative overflow-hidden py-24">
      <StickerField density={0.7} />

      <div className="container-px relative z-10 grid items-center gap-12 lg:grid-cols-2">
        {/* Left — intro + socials */}
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.span variants={fadeUp()} className="eyebrow mb-4">
            Get in touch
          </motion.span>
          <motion.h2
            variants={fadeUp()}
            className="section-title mt-3"
          >
            Let's build something{' '}
            <span className="gradient-text">awesome</span> together.
          </motion.h2>
          <motion.p variants={fadeUp()} className="mt-5 max-w-md text-lg text-body">
            Have a project in mind, a question, or just want to say hi? Drop me a
            message — I usually reply within a day.
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
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="relative space-y-5 rounded-3xl border border-line bg-white/[0.04] p-8 shadow-soft-lg"
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

            <motion.div variants={fadeUp()}>
              <Button
                type="submit"
                disabled={state === 'sending'}
                className="w-full px-6 py-3.5 disabled:opacity-60"
              >
                {state === 'sending' ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send message
                    <Send className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </motion.div>

            {/* Animated status messages */}
            <AnimatePresence>
              {state === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 rounded-2xl bg-teal/10 px-4 py-3 font-medium text-teal"
                >
                  <SuccessCheck />
                  Message sent! I'll get back to you soon.
                </motion.div>
              )}
              {state === 'error' && Object.keys(errors).length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl bg-coral/10 px-4 py-3 font-medium text-coral"
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
