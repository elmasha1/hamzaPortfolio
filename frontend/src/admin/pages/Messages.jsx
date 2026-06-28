import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { messagesApi } from '../../lib/adminApi'
import { useToast } from '../../context/ToastContext'
import { Check, Mail, Trash2 } from '../../components/ui/Icons'
import ConfirmModal from '../components/ConfirmModal'

export default function Messages() {
  const toast = useToast()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    messagesApi
      .list()
      .then((res) => setMessages(res.data))
      .catch(() => toast.error('Could not load messages.'))
      .finally(() => setLoading(false))
  }
  useEffect(load, []) // eslint-disable-line react-hooks/exhaustive-deps

  const openMessage = async (m) => {
    setSelected(m)
    if (!m.read) {
      try {
        await messagesApi.setRead(m.id, true)
        setMessages((list) =>
          list.map((x) => (x.id === m.id ? { ...x, read: true } : x))
        )
      } catch {
        /* non-critical */
      }
    }
  }

  const toggleRead = async (m, e) => {
    e.stopPropagation()
    try {
      const next = !m.read
      await messagesApi.setRead(m.id, next)
      setMessages((list) =>
        list.map((x) => (x.id === m.id ? { ...x, read: next } : x))
      )
      toast.success(next ? 'Marked as read.' : 'Marked as unread.')
    } catch {
      toast.error('Update failed.')
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await messagesApi.remove(toDelete.id)
      setMessages((list) => list.filter((x) => x.id !== toDelete.id))
      if (selected?.id === toDelete.id) setSelected(null)
      toast.success('Message deleted.')
      setToDelete(null)
    } catch {
      toast.error('Delete failed.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      {/* List */}
      <div className="rounded-2xl border border-line bg-white/[0.04] shadow-soft">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-heading text-lg font-semibold text-heading">
            Messages
          </h2>
          <span className="text-sm text-muted">{messages.length} total</span>
        </div>

        {loading ? (
          <div className="space-y-2 p-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-base-indigo" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">No messages yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {messages.map((m) => (
              <li
                key={m.id}
                onClick={() => openMessage(m)}
                className={`flex cursor-pointer items-center gap-3 px-5 py-4 transition-colors hover:bg-base-indigo ${
                  selected?.id === m.id ? 'bg-base-indigo' : ''
                }`}
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${m.read ? 'bg-transparent' : 'bg-primary'}`}
                />
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm ${m.read ? 'font-normal' : 'font-semibold'} text-heading`}>
                    {m.name} <span className="font-normal text-muted">&middot; {m.email}</span>
                  </p>
                  <p className="truncate text-sm text-body">{m.message}</p>
                </div>
                <span className="shrink-0 text-xs text-muted">
                  {new Date(m.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Detail panel */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="rounded-2xl border border-line bg-white/[0.04] p-6 shadow-soft"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-heading">
                    {selected.name}
                  </h3>
                  <a
                    href={`mailto:${selected.email}`}
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <Mail size={15} /> {selected.email}
                  </a>
                </div>
                <span className="text-xs text-muted">
                  {new Date(selected.created_at).toLocaleString()}
                </span>
              </div>

              <p className="mt-4 whitespace-pre-wrap rounded-xl bg-base-soft p-4 text-sm text-body">
                {selected.message}
              </p>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={(e) => toggleRead(selected, e)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-medium text-body transition hover:bg-base-indigo"
                >
                  <Check size={16} /> Mark {selected.read ? 'unread' : 'read'}
                </button>
                <button
                  onClick={() => setToDelete(selected)}
                  className="inline-flex items-center gap-2 rounded-xl bg-coral/10 px-3 py-2 text-sm font-medium text-coral transition hover:bg-coral/20"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
              Select a message to read it.
            </div>
          )}
        </AnimatePresence>
      </div>

      <ConfirmModal
        open={!!toDelete}
        title="Delete message?"
        message={`This permanently deletes the message from ${toDelete?.name}.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
