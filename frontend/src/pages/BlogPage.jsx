import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchPosts } from '../lib/api'
import { staggerContainer, fadeUp } from '../lib/motion'
import { ArrowUpRight } from '../components/ui/Icons'
import SectionLabel from '../components/ui/SectionLabel'
import SplitTextReveal from '../components/ui/SplitTextReveal'

const coverPlaceholder = (title) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='#141414'/><text x='50%' y='50%' fill='#666' font-family='Space Grotesk,Inter,sans-serif' font-size='26' text-anchor='middle' dominant-baseline='middle'>${title}</text></svg>`
  )

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''

/** /blog — a list of journal posts (cover, date, read time, tags, excerpt). */
export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    fetchPosts()
      .then((d) => alive && setPosts(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="pt-36 sm:pt-44">
      <div className="container-px">
        <SectionLabel num="01">Journal</SectionLabel>
        <SplitTextReveal
          as="h1"
          text="Writing on engineering & craft."
          amount={0.4}
          className="max-w-3xl font-heading text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-heading"
        />
        <p className="mt-6 max-w-[55ch] text-base leading-[1.7] text-body">
          Notes on building full-stack products — architecture, animation, and the details in between.
        </p>

        {loading ? (
          <div className="mt-16 space-y-px overflow-hidden rounded-[4px] border border-line">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-40 animate-pulse bg-white/[0.03]" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="mt-16 text-muted">No posts published yet — check back soon.</p>
        ) : (
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="show"
            className="mt-16 border-t border-line pb-8"
          >
            {posts.map((p) => {
              const tags = Array.isArray(p.tags) ? p.tags : []
              return (
                <motion.div key={p.slug} variants={fadeUp(24)}>
                  <Link
                    to={`/blog/${p.slug}`}
                    data-cursor="hover"
                    className="group grid gap-6 border-b border-line py-8 md:grid-cols-[16rem_1fr] md:gap-10"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] border border-line bg-base-indigo">
                      <img
                        src={p.cover || coverPlaceholder(p.title)}
                        alt={`${p.title} — cover`}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => (e.currentTarget.src = coverPlaceholder(p.title))}
                        className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:grayscale-0"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-muted">
                        <span>{fmtDate(p.published_at)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{p.read_time || 3} min read</span>
                      </div>
                      <h2 className="mt-3 flex items-start justify-between gap-4 font-heading text-2xl font-semibold tracking-[-0.02em] text-heading sm:text-3xl">
                        <span className="transition-colors group-hover:text-white">{p.title}</span>
                        <ArrowUpRight
                          size={22}
                          className="mt-1 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-heading"
                        />
                      </h2>
                      {p.excerpt && <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.7] text-body">{p.excerpt}</p>}
                      {tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-[0.1em] text-muted">
                          {tags.map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
