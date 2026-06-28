import { motion } from 'framer-motion'
import { staggerContainer, fadeUp, fadeIn, viewportOnce } from '../lib/motion'
import StickerField from './Stickers'
import { Check } from './ui/Icons'

const SKILLS = [
  { name: 'React / Vite', level: 95, color: 'from-primary to-primary-700' },
  { name: 'Tailwind CSS', level: 92, color: 'from-primary to-teal' },
  { name: 'Laravel / PHP', level: 88, color: 'from-teal to-primary-700' },
  { name: 'MySQL', level: 85, color: 'from-primary-700 to-teal' },
  { name: 'Framer Motion', level: 90, color: 'from-primary-700 to-primary' },
]

/** A skill bar that fills from 0 → level when scrolled into view. */
function SkillBar({ name, level, color }) {
  return (
    <motion.div variants={fadeUp(20)}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-semibold text-heading">{name}</span>
        <span className="text-sm font-medium text-muted">{level}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-base-indigo">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  )
}

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24">
      <StickerField density={0.6} />

      <div className="container-px relative z-10 grid items-center gap-14 lg:grid-cols-2">
        {/* Bio */}
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.span variants={fadeUp()} className="eyebrow mb-4">
            About me
          </motion.span>
          <motion.h2 variants={fadeUp()} className="section-title">
            Turning <span className="gradient-text">caffeine</span> into clean,
            scalable code.
          </motion.h2>
          <motion.p variants={fadeUp()} className="mt-5 text-lg text-body">
            I'm a full-stack developer who loves the sweet spot between
            engineering and design. On the frontend I build snappy, animated
            interfaces with React, Tailwind & Framer Motion. On the backend I
            architect robust REST APIs with Laravel and MySQL.
          </motion.p>
          <motion.p variants={fadeUp()} className="mt-4 text-lg text-body">
            I care about accessibility, performance and the little details that
            make a product feel alive — micro-interactions, smooth transitions,
            and delightful surprises.
          </motion.p>

          <motion.div variants={fadeUp()} className="mt-7 flex flex-wrap gap-3">
            {['Clean Code', 'Responsive', 'API Design', 'Animations'].map((t) => (
              <span
                key={t}
                className="pill bg-white/[0.06] text-heading shadow-soft backdrop-blur"
              >
                <Check size={16} className="text-teal" />
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Skill bars */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="space-y-5 rounded-3xl border border-line bg-white/[0.04] p-8 shadow-soft"
        >
          <motion.h3
            variants={fadeIn('right')}
            className="mb-2 text-xl font-bold text-heading"
          >
            My toolbox
          </motion.h3>
          {SKILLS.map((s) => (
            <SkillBar key={s.name} {...s} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
