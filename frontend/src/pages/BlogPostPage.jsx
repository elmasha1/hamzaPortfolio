import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchPost } from '../lib/api'
import { ArrowLeft } from '../components/ui/Icons'
import SplitTextReveal from '../components/ui/SplitTextReveal'

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

/** /blog/:slug — a single journal post. */
export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    let alive = true
    setStatus('loading')
    fetchPost(slug)
      .then((d) => {
        if (!alive) return
        setPost(d)
        setStatus('ready')
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
    }
  }, [slug])

  if (status === 'error') {
    return (
      <div className="container-px flex min-h-[60vh] flex-col items-start justify-center pt-32">
        <p className="text-muted">That post could not be found.</p>
        <Link to="/blog" className="mt-4 inline-flex items-center gap-2 text-heading hover:underline">
          <ArrowLeft size={16} /> Back to the journal
        </Link>
      </div>
    )
  }

  if (status !== 'ready' || !post) {
    return (
      <div className="container-px pt-40">
        <div className="h-6 w-40 animate-pulse rounded bg-white/[0.05]" />
        <div className="mt-6 h-12 w-2/3 animate-pulse rounded bg-white/[0.05]" />
      </div>
    )
  }

  const tags = Array.isArray(post.tags) ? post.tags : []
  const paragraphs = String(post.body || '').split('\n').filter((l) => l.trim())

  return (
    <article className="pt-36 sm:pt-44">
      <div className="container-px">
        <Link
          to="/blog"
          data-cursor="hover"
          className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-heading"
        >
          <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Journal
        </Link>

        <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-muted">
          <span>{fmtDate(post.published_at)}</span>
          <span aria-hidden="true">·</span>
          <span>{post.read_time || 3} min read</span>
        </div>

        <SplitTextReveal
          as="h1"
          text={post.title}
          amount={0.4}
          className="mt-4 max-w-4xl font-heading text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-heading"
        />

        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-[0.1em] text-muted">
            {tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Cover */}
      {post.cover && (
        <motion.div
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
          className="container-px mt-12"
        >
          <div className="aspect-[16/9] w-full overflow-hidden rounded-[4px] border border-line bg-base-indigo">
            <img src={post.cover} alt={`${post.title} — cover`} className="h-full w-full object-cover" />
          </div>
        </motion.div>
      )}

      {/* Body */}
      <div className="container-px mt-14 pb-16">
        <div className="max-w-[68ch] space-y-6 text-[1.05rem] leading-[1.8] text-body">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </article>
  )
}
