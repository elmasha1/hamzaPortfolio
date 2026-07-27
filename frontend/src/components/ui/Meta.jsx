/**
 * Meta — the monospace annotation voice.
 *
 * The third voice in the system: Space Grotesk states, Inter explains, mono
 * annotates. Every tag, date, caption, index, stack list and nav label renders
 * through this primitive so the metadata layer stays consistent — and so it
 * never drifts back to letter-spaced Inter caps, which is what it was faking.
 *
 * @param {boolean} caps  small caps variant (11px / 0.09em) — labels, eyebrows
 * @param {string}  tone  'muted' (default, ink-500) | 'body' | 'ink'
 */
const TONES = {
  muted: 'text-ink-500',
  body: 'text-ink-300',
  ink: 'text-ink-100',
}

export default function Meta({
  as: Tag = 'span',
  caps = false,
  tone = 'muted',
  className = '',
  children,
  ...rest
}) {
  const base = caps
    ? 'font-mono text-eyebrow font-medium uppercase'
    : 'font-mono text-meta'

  return (
    <Tag className={`${base} ${TONES[tone] ?? TONES.muted} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
