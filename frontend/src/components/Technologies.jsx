import { motion } from 'framer-motion'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import SectionLabel from './ui/SectionLabel'
import { DynamicIcon } from './ui/Icons'
import { useSettings } from '../context/SettingsContext'

// Small icon per category (purely presentational; falls back gracefully).
const GROUP_ICON = {
  Frontend: 'LayoutGrid',
  Backend: 'Server',
  Database: 'Database',
  'DevOps & Tools': 'Wrench',
  DevOps: 'Wrench',
  Tools: 'Terminal',
}

/**
 * Technologies — grouped capabilities (Frontend / Backend / Database / DevOps),
 * minimal and type-driven: hairline-divided rows, small category labels, items
 * listed cleanly. Editable from the dashboard (settings.tech_groups).
 */
export default function Technologies({ num = '02' }) {
  const { settings } = useSettings()
  const groups = Array.isArray(settings.tech_groups) ? settings.tech_groups : []
  if (groups.length === 0) return null

  return (
    <section id="technologies" className="relative py-16 sm:py-24">
      <div className="container-px">
        <SectionLabel num={num}>Technologies</SectionLabel>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-8 border-t border-line"
        >
          {groups.map((g) => (
            <motion.div
              key={g.label}
              variants={fadeUp(20)}
              className="grid gap-3 border-b border-line py-7 md:grid-cols-[0.28fr_1fr] md:gap-8"
            >
              <p className="eyebrow flex items-center gap-2 pt-1">
                <DynamicIcon name={GROUP_ICON[g.label] || 'Code'} size={16} strokeWidth={1.5} className="text-heading" />
                {g.label}
              </p>
              <ul className="flex flex-wrap gap-x-8 gap-y-2.5">
                {(g.items || []).map((item) => (
                  <li
                    key={item}
                    className="text-lg text-body underline-offset-[6px] transition-colors duration-300 hover:text-heading hover:underline hover:decoration-white/25 sm:text-xl"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
