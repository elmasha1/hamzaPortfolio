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
      className="group fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full border border-[#25D366]/40 bg-white/[0.05] text-[#34E27E] shadow-[0_0_24px_-4px_rgba(37,211,102,0.5)] backdrop-blur-md"
    >
      {/* Pulse ring (accent glow) */}
      {!reduce && (
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 motion-safe:animate-pulse-ring" />
      )}
      {/* Gentle float */}
      <motion.span
        className="relative flex"
        animate={reduce ? {} : { y: [0, -3, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MessageCircle size={26} />
      </motion.span>

      {/* Tooltip */}
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="pointer-events-none absolute right-[120%] whitespace-nowrap rounded-xl bg-dark px-3 py-1.5 text-xs font-medium text-white shadow-soft"
          >
            Chat on WhatsApp
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  )
}
