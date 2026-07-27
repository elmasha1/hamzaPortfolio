import SplitTextReveal from './ui/SplitTextReveal'
import Meta from './ui/Meta'

/**
 * Statement — the full-bleed typographic anchor between two dense sections.
 *
 * One sentence at display scale on the raised paper-2 band, escaping the
 * container entirely. It is the only mid-page scale change, and it exists to
 * give the eye a rest in the ~4000px of hairlines that used to run unbroken
 * from the timeline to pricing. No decoration is added — only scale.
 *
 * Dashboard-driven via `settings.statement` — self-hides when empty.
 */
export default function Statement({ statement }) {
  const text = typeof statement === 'string' ? statement : statement?.text
  const label = typeof statement === 'string' ? '' : statement?.label

  if (!text) return null

  return (
    <section className="flex min-h-[70vh] items-end border-y border-rule bg-paper-2 py-20 sm:py-24 lg:py-28">
      <div className="container-px flex w-full flex-col justify-between gap-8 lg:flex-row lg:items-end lg:gap-14">
        <SplitTextReveal
          as="p"
          text={text}
          amount={0.3}
          className="max-w-[26ch] font-heading text-h1 font-semibold leading-[0.94] tracking-[-0.04em] text-ink-100"
        />
        {label && (
          <Meta caps className="shrink-0 whitespace-pre-line tracking-[0.05em] lg:pb-2.5 lg:text-right">
            {label}
          </Meta>
        )}
      </div>
    </section>
  )
}
