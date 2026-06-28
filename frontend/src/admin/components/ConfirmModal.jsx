import { AnimatePresence, motion } from 'framer-motion'

/**
 * ConfirmModal — a small animated confirmation dialog for destructive actions.
 */
export default function ConfirmModal({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[115] flex items-center justify-center bg-dark/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="w-full max-w-sm rounded-3xl border border-line bg-white/[0.04] p-6 shadow-soft-lg"
          >
            <h3 className="font-heading text-lg font-semibold text-heading">
              {title}
            </h3>
            <p className="mt-2 text-sm text-body">{message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="rounded-xl border border-line px-4 py-2 text-sm font-medium text-body transition hover:bg-base-indigo"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-coral px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
              >
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
