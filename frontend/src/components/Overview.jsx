import { motion } from 'framer-motion'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import SectionLabel from './ui/SectionLabel'
import SplitTextReveal from './ui/SplitTextReveal'
import { DynamicIcon } from './ui/Icons'
import { useSettings } from '../context/SettingsContext'

/**
 * Overview — "This is what I do": a small grid of capability cards, each with
 * an icon, title, one-line description, a tech list and two meta tags. All
 * content is dashboard-driven (settings.overview_items / overview_intro).
 */
export default function Overview() {
  const { settings } = useSettings()
  const items = Array.isArray(settings.overview_items) ? settings.overview_items : []
  if (items.length === 0) return null

  return (
    <section id="overview" className="relative py-24 sm:py-32">
      <div className="container-px">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="max-w-3xl"
        >
          <SectionLabel num="01">Overview</SectionLabel>
          <SplitTextReveal
            as="h2"
            text="This is what I do."
            amount={0.4}
            className="font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-heading"
          />
          {settings.overview_intro && (
            <motion.p variants={fadeUp(20)} className="mt-6 max-w-[55ch] text-base leading-[1.7] text-body">
              {settings.overview_intro}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2"
        >
          {items.map((item, i) => {
            const tech = Array.isArray(item.tech) ? item.tech : []
            const tags = Array.isArray(item.tags) ? item.tags : []
            return (
              <motion.article
                key={item.title || i}
                variants={fadeUp(24)}
                className="group flex flex-col bg-ink p-7 transition-colors duration-300 hover:bg-white/[0.02] sm:p-9"
              >
                <div className="flex items-start justify-between gap-4">
                  <DynamicIcon
                    name={item.icon}
                    size={24}
                    strokeWidth={1.5}
                    className="text-muted transition-colors duration-300 group-hover:text-heading"
                  />
                  {tags.length > 0 && (
                    <div className="flex flex-wrap justify-end gap-2">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-line px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <h3 className="mt-8 font-heading text-xl font-semibold tracking-[-0.01em] text-heading sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[42ch] text-[15px] leading-[1.7] text-body">
                  {item.description}
                </p>

                {tech.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line pt-5 text-xs uppercase tracking-[0.1em] text-muted">
                    {tech.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                )}
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
