import { createContext, useContext, useEffect, useState } from 'react'
import { fetchBootstrap, fetchSettings } from '../lib/api'

/**
 * SettingsContext — loads dashboard-managed site settings (hero text, stats,
 * WhatsApp number, social links, bio) so the public site renders dynamically.
 * Ships with sensible defaults so the site looks complete before the API
 * responds or if it's offline.
 */
const DEFAULTS = {
  whatsapp_number: '212600000000',
  whatsapp_message: 'Hi, I came across your portfolio and would like to discuss a project.',
  hero_title: 'Full-stack engineer. I build, ship and maintain production software.',
  hero_subtitle:
    'Years turning product ideas into React front-ends on Laravel APIs — then keeping them alive in production. I take a brief from scope to deploy pipeline, and I document what I leave behind.',
  hero_roles: ['Full Stack Engineer', 'React & Laravel Specialist', 'API & Systems Design'],
  hero_eyebrow: 'Full-Stack Developer',
  // The hero's utility rail: short facts separated by "·".
  hero_location: 'Rabat, MA · UTC+1 · Available now · Remote or on-site',
  // "What I own, end to end" — the request path under the headline.
  hero_chain: {
    label: 'What I own, end to end',
    nodes: ['Client', 'API', 'Queue', 'DB', 'CI / CD', 'Monitoring'],
  },
  // The hero proof strip / metrics rule.
  metrics: [
    { value: '04', label: 'Years shipping' },
    { value: '30', suffix: '+', label: 'Projects delivered' },
    { value: '02', label: 'Stacks, deeply — React · Laravel' },
    { value: '24h', label: 'Reply time on enquiries' },
  ],
  // The full-bleed statement band between work and process.
  statement: {
    text: 'Shipping is a feature. Everything I build is designed to be maintained by whoever comes next.',
    label: 'Working principle',
  },
  // "How I work" — each step carries one concrete artefact.
  process_heading: 'How I work.',
  process: [
    {
      title: 'Scope',
      body: 'We agree what is being built and what it costs before any code exists.',
      artifact: 'Written spec + estimate',
    },
    {
      title: 'Build',
      body: 'Small, reviewable increments against a real environment, not a demo branch.',
      artifact: 'CI on every PR',
    },
    {
      title: 'Ship',
      body: 'Deployed behind a pipeline you can run yourself, with a rollback that works.',
      artifact: 'One-command deploy',
    },
    {
      title: 'Maintain',
      body: 'Monitoring, alerting and documentation, so the next person is not stuck.',
      artifact: 'Uptime alerts + handover doc',
    },
  ],
  // The three steps under the contact form.
  whats_next: [
    'A real reply within 24 hours — with questions, not a template.',
    'A 30-minute call to pin down scope, constraints and deadline.',
    'A written scope, estimate and timeline within three days.',
  ],
  location: 'Rabat, Morocco',
  response_time: 'Replies within 24h',
  bio: "I'm a full-stack engineer with 4+ years building and shipping web applications — React and Tailwind on the frontend, Laravel and MySQL on the backend. I care about clean architecture, performance, accessibility and tested, maintainable code.",
  // Profile photo URL (set from the dashboard); empty → local placeholder.
  profile_photo: '',
  available: true,
  stats: [
    { label: 'Years experience', value: 4, suffix: '+' },
    { label: 'Projects delivered', value: 30, suffix: '+' },
    { label: 'Clients served', value: 15, suffix: '+' },
    { label: 'Avg. Lighthouse', value: 95, suffix: '+' },
  ],
  socials: {
    linkedin: 'https://linkedin.com/',
    github: 'https://github.com/',
    email: 'lyrvmind@gmail.com',
  },
  tech_groups: [
    { label: 'Frontend', items: [
      { name: 'React', icon: 'react' }, { name: 'Vite', icon: 'vite' }, { name: 'TypeScript', icon: 'typescript' },
      { name: 'Tailwind CSS', icon: 'tailwind' }, { name: 'Framer Motion', icon: 'framer' }, { name: 'GSAP', icon: 'gsap' }, { name: 'JavaScript', icon: 'javascript' },
    ] },
    { label: 'Backend', items: [
      { name: 'Laravel', icon: 'laravel' }, { name: 'PHP', icon: 'php' }, { name: 'Node.js', icon: 'nodejs' }, { name: 'REST APIs', icon: 'restapi' },
    ] },
    { label: 'Database', items: [
      { name: 'MySQL', icon: 'mysql' }, { name: 'PostgreSQL', icon: 'postgresql' }, { name: 'Redis', icon: 'redis' },
    ] },
    { label: 'DevOps & Tools', items: [
      { name: 'Git', icon: 'git' }, { name: 'Docker', icon: 'docker' }, { name: 'CI/CD', icon: 'cicd' }, { name: 'Linux', icon: 'linux' }, { name: 'Figma', icon: 'figma' },
    ] },
  ],
  services: [
    { icon: 'Code', title: 'Web App Development', description: 'Fast, accessible React SPAs (Vite, Tailwind) with polished, production-ready UI.' },
    { icon: 'Server', title: 'Backend & API Development', description: 'Robust Laravel REST APIs — auth, validation, queues and clean data models.' },
    { icon: 'Database', title: 'Database Design', description: 'Well-structured MySQL schemas, migrations and performant queries.' },
    { icon: 'Rocket', title: 'Full-Stack Solutions', description: 'End-to-end delivery from architecture to deployment, wired together cleanly.' },
    { icon: 'LayoutGrid', title: 'UI Implementation', description: 'Pixel-precise, responsive interfaces from Figma with motion and micro-interactions.' },
  ],
  overview_intro: 'A full-stack engineer who takes products from idea to production — and keeps them running.',
  overview_items: [
    { icon: 'Code', title: 'Full-Stack Web Development', description: 'End-to-end web apps, from data model to polished interface.', tech: ['React', 'Laravel', 'Node', 'TypeScript', 'MySQL'], tags: ['3+ years', 'Full-stack'] },
    { icon: 'Server', title: 'Backend & APIs', description: 'Robust REST APIs with auth, queues and clean architecture.', tech: ['Laravel', 'REST', 'Sanctum', 'Redis'], tags: ['APIs', 'Scalable'] },
    { icon: 'Rocket', title: 'Freelance Development', description: 'Web apps, e-commerce, SaaS and third-party integrations for clients.', tech: ['Stripe', 'Next.js', 'Webhooks'], tags: ['Client work', 'Delivery'] },
    { icon: 'GitBranch', title: 'Personal & Open-Source', description: 'Tools, writing and contributions I build to keep learning.', tech: ['Open-source', 'DX tools', 'Writing'], tags: ['Ongoing', 'Community'] },
  ],
  journey_heading: 'From zero to full-stack.',
  journey_intro: 'A short version of how I went from writing my first lines of code to shipping full-stack products.',
  journey: [
    { date_label: '2020', title: 'The beginning', description: 'Wrote my first HTML/CSS and got hooked on turning ideas into things that run in a browser.', tags: ['HTML', 'CSS', 'JavaScript'] },
    { date_label: '2021', title: 'Learning full-stack', description: 'Went deep on React and Laravel — building real CRUD apps, auth flows and REST APIs.', tags: ['React', 'Laravel', 'MySQL'] },
    { date_label: '2022', title: 'First freelance projects', description: 'Shipped paid work for real clients: landing pages, dashboards and e-commerce.', tags: ['Freelance', 'Client work'] },
    { date_label: '2023', title: 'Studies & fundamentals', description: 'Formalised the theory — algorithms, databases and system design — alongside building.', tags: ['CS', 'System design'] },
    { date_label: '2024', title: 'DevOps & cloud', description: 'Owned deployment: Docker, CI/CD pipelines and running apps in production on Linux.', tags: ['Docker', 'CI/CD', 'Linux'] },
    { date_label: 'Present', title: 'Building & shipping', description: 'Working across the stack on production-grade products, with an eye on performance and craft.', tags: ['Full-stack', 'Performance'] },
  ],
  about: {
    headline: 'From idea to production — this is who I am.',
    subline: 'A full-stack engineer who cares as much about the craft as the outcome.',
    video_url: '',
    video_poster: '',
    story: [
      "I started building for the web because I loved the immediacy of it — write a few lines, refresh, and something real appears in the browser. That feeling never left; it just grew into a career.",
      "Over the last few years I've shipped production applications end to end — designing data models and REST APIs in Laravel and MySQL, then building fast, accessible interfaces in React on top. I've owned features from architecture to deployment, and learned that the hard part is rarely the code — it's the decisions around it.",
      "Today I focus on software that lasts: clean architecture, sensible abstractions, and interfaces that feel effortless. I'm always learning — the moment this stops being interesting is the moment I'm doing it wrong.",
    ],
    pull_quote: "The hard part is rarely the code — it's the decisions around it.",
    philosophy: [
      { title: 'Clean architecture', description: 'Sensible abstractions and clear boundaries, so change happens in one place.' },
      { title: 'Performance by default', description: 'Fast, accessible experiences — measured, not assumed.' },
      { title: 'Ship, then refine', description: 'Working software in front of people beats perfect software in a branch.' },
      { title: 'Always learning', description: 'The stack evolves; curiosity is the only durable skill.' },
    ],
    facts: [
      { label: 'Years coding', value: 4, suffix: '+' },
      { label: 'Projects shipped', value: 30, suffix: '+' },
      { label: 'Based in', text: 'Rabat / Remote' },
    ],
  },
  testimonials: [
    {
      quote:
        'Delivered a complex platform on time and communicated like a senior engineer throughout. The architecture has scaled cleanly as we have grown.',
      name: 'Sarah Lin',
      role: 'Product Lead, SaaS startup',
    },
    {
      quote:
        'A rare combination of strong engineering and genuine design sense. Our app is faster, cleaner, and far easier to maintain.',
      name: 'Marco Reyes',
      role: 'CTO, Digital Agency',
    },
    {
      quote:
        'Took ownership from API design to deployment and left us with documented, tested code. Would hire again without hesitation.',
      name: 'Amelia Khan',
      role: 'Founder, E-commerce',
    },
  ],
}

const SettingsContext = createContext({ settings: DEFAULTS, loading: true })

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)

  // Start the ONE consolidated request during the provider's first RENDER —
  // before any child section mounts — so section fetchers (projects, journey,
  // pricing…) find it in flight and wait for its seeded cache instead of each
  // firing their own request. (Child effects run before parent effects, so
  // kicking this off in useEffect would be too late.)
  const [bootPromise] = useState(() => fetchBootstrap())

  useEffect(() => {
    let alive = true
    bootPromise
      .then((b) => {
        if (!alive || !b?.settings) return
        setSettings({ ...DEFAULTS, ...b.settings }) // merge → defaults fill gaps
      })
      .catch(() =>
        // Bootstrap unavailable (older backend?) → fall back to settings only.
        fetchSettings()
          .then((data) => alive && data && setSettings({ ...DEFAULTS, ...data }))
          .catch(() => {}) // keep local defaults — the site still renders
      )
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [bootPromise])

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
