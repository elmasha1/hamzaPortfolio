import { motion } from 'framer-motion'
import { staggerContainer, fadeUp, popIn, viewportOnce } from '../lib/motion'
import { Atom, Wind, Server, Database, Layers, Braces, FileCode2, GitBranch } from './ui/Icons'

// Each tech badge gets a fitting Lucide icon + its own brand-ish color.
const TECH = [
  { name: 'React', Icon: Atom, bg: 'bg-primary/[0.07]', ring: 'ring-primary/25', text: 'text-primary' },
  { name: 'Tailwind', Icon: Wind, bg: 'bg-teal/[0.07]', ring: 'ring-teal/25', text: 'text-teal' },
  { name: 'Laravel', Icon: Server, bg: 'bg-primary/[0.07]', ring: 'ring-primary/25', text: 'text-primary-700' },
  { name: 'MySQL', Icon: Database, bg: 'bg-teal/[0.07]', ring: 'ring-teal/25', text: 'text-teal' },
  { name: 'Framer Motion', Icon: Layers, bg: 'bg-primary/[0.07]', ring: 'ring-primary/25', text: 'text-primary' },
  { name: 'JavaScript', Icon: Braces, bg: 'bg-base-soft', ring: 'ring-line', text: 'text-heading' },
  { name: 'PHP', Icon: FileCode2, bg: 'bg-primary/[0.07]', ring: 'ring-primary/25', text: 'text-primary-700' },
  { name: 'Git', Icon: GitBranch, bg: 'bg-teal/[0.07]', ring: 'ring-teal/25', text: 'text-teal' },
]

export default function TechStack() {
  return (
    <section className="relative py-20">
      <div className="container-px">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="text-center"
        >
          <motion.span variants={fadeUp()} className="eyebrow mb-4">
            Tech I love
          </motion.span>
          <motion.h2 variants={fadeUp()} className="section-title">
            My <span className="gradient-text">tech stack</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-4"
        >
          {TECH.map((t) => (
            <motion.div
              key={t.name}
              variants={popIn}
              whileHover={{ scale: 1.15, rotate: -3, y: -6 }}
              whileTap={{ scale: 0.95 }}
              className={`flex cursor-default items-center gap-2 rounded-2xl px-5 py-3 font-semibold shadow-soft ring-1 ${t.bg} ${t.ring} ${t.text}`}
            >
              <t.Icon size={20} strokeWidth={1.75} />
              {t.name}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
