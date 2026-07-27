import Meta from './ui/Meta'

const DEFAULTS = [
  'A real reply within 24 hours — with questions, not a template.',
  'A 30-minute call to pin down scope, constraints and deadline.',
  'A written scope, estimate and timeline within three days.',
]

/**
 * WhatsNext — the three steps that follow the contact form.
 *
 * Sending a message is the one irreversible thing a visitor does on this site;
 * saying exactly what happens afterwards is what makes them do it. Numbered
 * mono steps on hairlines, sitting directly under the offer.
 *
 * Dashboard-driven via `settings.whats_next` (falls back to the defaults).
 */
export default function WhatsNext({ steps, title = 'What happens next' }) {
  const rows = (Array.isArray(steps) && steps.filter(Boolean).length ? steps : DEFAULTS).filter(Boolean)
  if (rows.length === 0) return null

  return (
    <div className="mt-12 border-t border-rule pt-5">
      <Meta caps className="block">
        {title}
      </Meta>
      <ol className="mt-1">
        {rows.map((step, i) => (
          <li
            key={i}
            className="grid grid-cols-[1.75rem_1fr] items-baseline gap-4 py-4 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-rule-soft"
          >
            <Meta aria-hidden="true">{String(i + 1).padStart(2, '0')}</Meta>
            <span className="text-small leading-[1.55] text-ink-100">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
