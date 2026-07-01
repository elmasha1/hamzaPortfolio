import { Fragment } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * SplitTextReveal — word-by-word reveal from behind overflow-hidden masks
 * (GSAP SplitText-style), staggered, triggered when it scrolls into view.
 * Spaces sit outside the masks so words wrap naturally for headings AND
 * paragraphs. Falls back to a plain fade under prefers-reduced-motion.
 *
 * @param {string} as        element tag ('h2', 'p', 'span', …)
 * @param {string} text      the text to split + reveal
 * @param {number} stagger   per-word delay
 * @param {number} delay     initial delay
 */
const wordInner = {
  hidden: { y: '115%' },
  show: { y: '0%', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

export default function SplitTextReveal({
  as = 'div',
  text = '',
  className = '',
  wordClassName = '',
  stagger = 0.045,
  delay = 0,
  once = true,
  amount = 0.6,
}) {
  const reduce = useReducedMotion()
  const Comp = motion[as] || motion.div
  const words = String(text).trim().split(/\s+/)

  if (reduce) {
    const Plain = motion[as] || motion.div
    return (
      <Plain
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once, amount }}
        transition={{ duration: 0.5, delay }}
      >
        {text}
      </Plain>
    )
  }

  return (
    <Comp
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span aria-hidden="true" className="inline-block overflow-hidden align-bottom">
            <motion.span variants={wordInner} className={`inline-block ${wordClassName}`}>
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Comp>
  )
}
