import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X, Info } from '../components/ui/Icons'

/**
 * ToastContext — animated toast notifications. Call `toast.success(msg)` /
 * `toast.error(msg)` / `toast.info(msg)` anywhere under the provider.
 */
const ToastContext = createContext({ push: () => {} })

let idCounter = 0

const ICONS = { success: Check, error: X, info: Info }
const STYLES = {
  success: 'border-teal/30 text-teal',
  error: 'border-coral/30 text-coral',
  info: 'border-primary/30 text-primary',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback(
    (id) => setToasts((t) => t.filter((x) => x.id !== id)),
    []
  )

  const push = useCallback(
    (message, type = 'info', duration = 3500) => {
      const id = ++idCounter
      setToasts((t) => [...t, { id, message, type }])
      setTimeout(() => remove(id), duration)
    },
    [remove]
  )

  // Convenience helpers
  const toast = {
    push,
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error'),
    info: (m) => push(m, 'info'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast viewport (top-right) */}
      <div className="pointer-events-none fixed right-4 top-4 z-[120] flex w-[min(92vw,22rem)] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className={`pointer-events-auto flex items-center gap-3 rounded-2xl border bg-white/[0.04] px-4 py-3 text-sm font-medium shadow-soft-lg ${STYLES[t.type]}`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${STYLES[t.type]}`}
              >
                {(() => {
                  const Icon = ICONS[t.type]
                  return <Icon size={14} strokeWidth={2.5} />
                })()}
              </span>
              <span className="text-heading">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
