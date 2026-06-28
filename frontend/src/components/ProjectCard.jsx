import { memo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cardPop } from '../lib/motion'
import useTilt from '../hooks/useTilt'
import BrowserFrame from './BrowserFrame'
import { ExternalLink, Github, Eye, Star, ArrowRight } from './ui/Icons'

/* Tech tag pills shared by both layouts — dark glass, light text, thin border. */
function Tags({ tags }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="pill border border-line bg-[#0B1A33] px-3 py-1 text-xs font-medium text-primary-300"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

/* Sliding overlay: Live / GitHub + a "View details" affordance. */
function Overlay({ project, hover, onOpen }) {
  const stop = (e) => e.stopPropagation()
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#06122B]/90 backdrop-blur-sm"
      initial={false}
      animate={{ opacity: hover ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-3">
        {project.live_url && (
          <motion.a
            href={project.live_url}
            target="_blank"
            rel="noreferrer"
            onClick={stop}
            className="inline-flex items-center gap-1.5 rounded-btn bg-[#F5F5F0] px-4 py-2 text-sm font-semibold text-[#0a1124] shadow-soft"
            initial={{ y: 20, opacity: 0 }}
            animate={hover ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.05 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink /> Live demo
          </motion.a>
        )}
        {project.github_url && (
          <motion.a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            onClick={stop}
            className="inline-flex items-center gap-1.5 rounded-btn bg-dark px-4 py-2 text-sm font-semibold text-white shadow-soft"
            initial={{ y: 20, opacity: 0 }}
            animate={hover ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.12 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github /> GitHub
          </motion.a>
        )}
      </div>
      <motion.button
        onClick={(e) => {
          stop(e)
          onOpen()
        }}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:underline"
        initial={{ opacity: 0 }}
        animate={hover ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.18 }}
      >
        <Eye size={16} /> View details
      </motion.button>
    </motion.div>
  )
}

/* Cursor-tracked glare overlay (fades in on hover). */
function Glare({ glare, hover }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
      style={{ background: glare }}
      animate={{ opacity: hover ? 1 : 0 }}
      transition={{ duration: 0.25 }}
    />
  )
}

function onErrorImg(project) {
  return (e) => {
    e.currentTarget.src =
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="#0B1B36"/><text x="50%" y="50%" font-family="'Space Grotesk',Inter,sans-serif" font-size="26" fill="#93C5FD" text-anchor="middle" dominant-baseline="middle">${project.title}</text></svg>`
      )
  }
}

/**
 * ProjectCard — animated card with 3D tilt, cursor glare, a browser-mockup
 * framed screenshot, hover overlay actions, and click-to-open details.
 *
 * @param {boolean}  featured  Wide split layout + gradient border + stronger tilt.
 * @param {Function} onOpen    Opens the detail modal for this project.
 */
function ProjectCard({ project, featured = false, onOpen }) {
  const reduce = useReducedMotion()
  const [hover, setHover] = useState(false)
  const { ref, rx, ry, glare, onMouseMove, reset } = useTilt({
    max: featured ? 12 : 8,
  })

  const tags = Array.isArray(project.tech_tags) ? project.tech_tags : []
  const open = () => onOpen?.(project)

  const handleEnter = () => setHover(true)
  const handleLeave = () => {
    reset()
    setHover(false)
  }

  const Screenshot = ({ className }) => (
    <motion.img
      src={project.image}
      alt={`Screenshot of ${project.title}`}
      loading="lazy"
      decoding="async"
      width="640"
      height="400"
      className={className}
      animate={{ scale: hover && !reduce ? 1.08 : 1 }}
      transition={{ duration: 0.5 }}
      onError={onErrorImg(project)}
    />
  )

  /* ---------------- Featured (wide, gradient border) ---------------- */
  if (featured) {
    return (
      <motion.div
        ref={ref}
        variants={cardPop}
        onMouseMove={onMouseMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={open}
        style={{
          rotateX: rx,
          rotateY: ry,
          transformPerspective: 1200,
          boxShadow:
            '0 0 0 1px rgba(59,130,246,0.16), 0 24px 60px -22px rgba(2,6,16,0.85), 0 0 50px -18px rgba(59,130,246,0.28)',
        }}
        whileHover={{ y: -10 }}
        className="group relative col-span-full cursor-pointer overflow-hidden rounded-[1.5rem] border border-line bg-white/[0.04] backdrop-blur-xl transition-shadow duration-300 hover:shadow-glow"
      >
        <article className="relative grid md:grid-cols-2">
          {/* Framed screenshot */}
          <div className="p-5 md:p-7">
            <BrowserFrame url={project.live_url || 'localhost:3000'} className="relative">
              <Screenshot className="aspect-[16/10] w-full object-cover" />
              <Overlay project={project} hover={hover} onOpen={open} />
            </BrowserFrame>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-7 lg:p-10">
            <span className="pill w-fit border border-primary/40 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-primary">
              <Star size={13} strokeWidth={2} /> Featured case study
            </span>
            <h3 className="mt-4 font-heading text-xl font-semibold text-heading transition-colors group-hover:text-primary lg:text-2xl">
              {project.title}
            </h3>
            {project.role && (
              <p className="mt-1 text-sm font-medium text-primary">{project.role}</p>
            )}
            <p className="mt-3 text-body">{project.description}</p>
            <Tags tags={tags} />
            <button
              onClick={(e) => {
                e.stopPropagation()
                open()
              }}
              className="group/cta mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary"
            >
              Read the case study
              <ArrowRight size={16} className="transition-transform duration-300 ease-out group-hover/cta:translate-x-1" />
            </button>
          </div>

          <Glare glare={glare} hover={hover} />
        </article>
      </motion.div>
    )
  }

  /* ---------------- Regular (grid) ---------------- */
  return (
    <motion.article
      ref={ref}
      variants={cardPop}
      layout
      onMouseMove={onMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={open}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      whileHover={{ y: -10 }}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-line bg-white/[0.04] p-4 shadow-soft backdrop-blur-xl transition-shadow duration-300 hover:shadow-glow"
    >
      <BrowserFrame url={project.live_url || 'localhost:3000'} className="relative">
        <Screenshot className="aspect-[16/10] w-full object-cover" />
        <Overlay project={project} hover={hover} onOpen={open} />
      </BrowserFrame>

      <div className="px-2 pb-1 pt-4">
        <h3 className="font-heading text-xl font-semibold text-heading transition-colors group-hover:text-primary">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-body">
          {project.description}
        </p>
        <Tags tags={tags} />
      </div>

      <Glare glare={glare} hover={hover} />
    </motion.article>
  )
}

// Memoized so re-rendering the Projects parent (e.g. filter changes) doesn't
// re-render every card — only those whose props actually change.
export default memo(ProjectCard)
