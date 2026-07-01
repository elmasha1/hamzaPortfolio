import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { MessageCircle } from './ui/Icons'
import { useSettings } from '../context/SettingsContext'

/**
 * WhatsAppButton — floating button at the bottom-right on the public site.
 * Number + prefilled message come from dashboard settings. Gentle float +
 * pulse ring, and a tooltip on hover.
 */
export default function WhatsAppButton() {
  const reduce = useReducedMotion()
  const { settings } = useSettings()
  const [hover, setHover] = useState(false)

  const number = (settings.whatsapp_number || '').replace(/\D/g, '')
  if (!number) return null

  const text = encodeURIComponent(
    settings.whatsapp_message || 'Hi, I saw your portfolio…'
  )
  const href = `https://wa.me/${number}?text=${text}`

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 16 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      data-cursor="hover"
      className="group fixed bottom-6 right-6 z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-line bg-ink text-heading transition-colors hover:bg-white hover:text-ink"
    >
      <span className="relative flex">
        <MessageCircle size={22} />
      </span>

      {/* Tooltip */}
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="pointer-events-none absolute right-[125%] whitespace-nowrap border border-line bg-ink px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-heading"
          >
            WhatsApp
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  )
}
