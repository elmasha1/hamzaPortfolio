import { m } from 'framer-motion'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import SectionLabel from './ui/SectionLabel'
import SplitTextReveal from './ui/SplitTextReveal'
import Meta from './ui/Meta'
import { DynamicIcon } from './ui/Icons'
import { useSettings } from '../context/SettingsContext'

/**
 * Overview — "What I do": the hairline-gap capability grid.
 *
 * The single strongest component in the build, tightened. It used to carry
 * five levels of information per cell (icon, right-aligned pill tags, title,
 * copy, tech row); the pills were redundant with the tech row and set at 10px,
 * so they are gone. A large mono index takes the icon's place at the top-left
 * and the lucide icon drops to the tech row, small and right-aligned.
 *
 * The 1px grid gaps ARE the rules — no cell has a border of its own.
 */
export default function Overview({ scope = 'Home', index = '01' }) {
  const { settings } = useSettings()
  const items = Array.isArray(settings.overview_items) ? settings.overview_items : []
  if (items.length === 0) return null

  return (
    <section id="overview" className="section-y relative">
      <div className="container-px">
        <m.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="max-w-3xl"
        >
          <SectionLabel scope={scope} index={index}>
            What I do
          </SectionLabel>
          <SplitTextReveal
            as="h2"
            text="This is what I do."
            amount={0.4}
            className="font-heading text-h2 font-semibold text-ink-100"
          />
          {settings.overview_intro && (
            <m.p variants={fadeUp(20)} className="mt-6 max-w-[55ch] text-ink-300">
              {settings.overview_intro}
            </m.p>
          )}
        </m.div>

        {/* The grid survives any item count: one column below 640, two above,
            three from 1280 when there are enough cells to fill a row. */}
        <m.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className={`mt-14 grid gap-px border border-rule bg-rule-soft sm:grid-cols-2 lg:mt-16 ${
            items.length >= 3 ? 'xl:grid-cols-3' : ''
          }`}
        >
          {items.map((item, i) => {
            const tech = Array.isArray(item.tech) ? item.tech : []
            return (
              <m.article key={item.title || i} variants={fadeUp(20)} className="cell pad group flex flex-col">
                <Meta className="text-ink-300">{String(i + 1).padStart(2, '0')}</Meta>

                <h3 className="mt-10 font-heading text-h3 font-medium text-ink-100">
                  {item.title}
                </h3>
                <p className="mt-2.5 max-w-[42ch] flex-1 text-small text-ink-300">
                  {item.description}
                </p>

                {(tech.length > 0 || item.icon) && (
                  <div className="mt-8 flex items-center justify-between gap-4 border-t border-rule-soft pt-5">
                    <Meta caps className="tracking-[0.05em] transition-colors duration-300 group-hover:text-ink-300">
                      {tech.join(' · ')}
                    </Meta>
                    {item.icon && (
                      <DynamicIcon
                        name={item.icon}
                        size={16}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="shrink-0 text-ink-700 transition-colors duration-300 group-hover:text-ink-500"
                      />
                    )}
                  </div>
                )}
              </m.article>
            )
          })}
        </m.div>
      </div>
    </section>
  )
}
