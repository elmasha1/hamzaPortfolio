import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import SectionLabel from './ui/SectionLabel'
import { DynamicIcon } from './ui/Icons'
import { TechIcon } from '../lib/techIcons'
import { fetchTechnologies } from '../lib/api'
import { useSettings } from '../context/SettingsContext'

// lucide category icon per group label.
const CAT_ICON = {
  Frontend: 'LayoutGrid',
  Backend: 'Server',
  Database: 'Database',
  'DevOps & Tools': 'Wrench',
  DevOps: 'Wrench',
  Tools: 'Terminal',
}

// Accept both the new { name, icon } item shape and legacy plain strings.
const normalizeItem = (it) => (typeof it === 'string' ? { name: it, icon: '' } : { name: it?.name || '', icon: it?.icon || '' })

/**
 * Technologies — a modern, grouped tech stack: each category has a lucide icon
 * + wide-tracked label, then a responsive grid of cells showing each tool's
 * monochrome brand logo + name. Cells lift and the logo brightens on hover.
 * Categories are hairline-divided; cells reveal item-by-item on scroll. Driven
 * by GET /api/technologies (dashboard-editable), with a settings fallback.
 */
export default function Technologies({ num = '02' }) {
  const { settings } = useSettings()
  const [groups, setGroups] = useState(() =>
    (Array.isArray(settings.tech_groups) ? settings.tech_groups : []).map((g) => ({
      label: g.label,
      items: (g.items || []).map(normalizeItem),
    }))
  )

  useEffect(() => {
    let alive = true
    fetchTechnologies()
      .then((data) => {
        if (alive && Array.isArray(data) && data.length) {
          setGroups(data.map((g) => ({ label: g.label, items: (g.items || []).map(normalizeItem) })))
        }
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  if (groups.length === 0) return null

  return (
    <section id="technologies" className="relative py-16 sm:py-24">
      <div className="container-px">
        <SectionLabel num={num}>Technologies</SectionLabel>

        <div className="mt-10 border-t border-line">
          {groups.map((g) => (
            <div
              key={g.label}
              className="grid gap-5 border-b border-line py-8 md:grid-cols-[0.24fr_1fr] md:gap-10"
            >
              {/* Category */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-2.5 md:pt-1"
              >
                <DynamicIcon name={CAT_ICON[g.label] || 'Code'} size={16} strokeWidth={1.5} className="shrink-0 text-heading" />
                <p className="eyebrow">{g.label}</p>
              </motion.div>

              {/* Items grid */}
              <motion.div
                variants={staggerContainer(0.05)}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4"
              >
                {g.items.map((it) => (
                  <motion.div
                    key={it.name}
                    variants={fadeUp(16)}
                    data-cursor="hover"
                    className="group flex items-center gap-3 rounded-[5px] border border-line px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.03]"
                  >
                    <TechIcon
                      icon={it.icon}
                      size={20}
                      className="shrink-0 text-muted transition-colors duration-300 group-hover:text-white"
                    />
                    <span className="truncate text-sm text-body transition-colors duration-300 group-hover:text-heading">
                      {it.name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
