/**
 * techIcons — maps a lowercase icon key (stored per tech item in the dashboard)
 * to a brand logo from react-icons' Simple Icons set. Rendered monochrome
 * (currentColor) to stay on-theme; the Technologies grid brightens them on
 * hover. Non-brand keys (REST APIs, AWS…) fall back to a lucide glyph.
 */
import {
  SiReact, SiVite, SiTypescript, SiTailwindcss, SiJavascript, SiHtml5, SiCss,
  SiNextdotjs, SiRedux, SiFramer, SiGreensock, SiSass, SiBootstrap, SiJest,
  SiLaravel, SiPhp, SiNodedotjs, SiExpress, SiGraphql, SiPython,
  SiMysql, SiPostgresql, SiRedis, SiMongodb, SiSqlite,
  SiGit, SiDocker, SiLinux, SiFigma, SiGithubactions, SiVercel, SiNetlify,
  SiNginx, SiKubernetes, SiSupabase, SiFirebase, SiVuedotjs,
} from 'react-icons/si'
import { Server, Cloud, Code } from 'lucide-react'

const MAP = {
  // frontend
  react: SiReact,
  vite: SiVite,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  javascript: SiJavascript,
  html5: SiHtml5,
  css3: SiCss,
  nextjs: SiNextdotjs,
  vue: SiVuedotjs,
  redux: SiRedux,
  framer: SiFramer,
  gsap: SiGreensock,
  sass: SiSass,
  bootstrap: SiBootstrap,
  jest: SiJest,
  // backend
  laravel: SiLaravel,
  php: SiPhp,
  nodejs: SiNodedotjs,
  express: SiExpress,
  graphql: SiGraphql,
  python: SiPython,
  restapi: Server,
  // database
  mysql: SiMysql,
  postgresql: SiPostgresql,
  redis: SiRedis,
  mongodb: SiMongodb,
  sqlite: SiSqlite,
  supabase: SiSupabase,
  firebase: SiFirebase,
  // devops & tools
  git: SiGit,
  docker: SiDocker,
  linux: SiLinux,
  figma: SiFigma,
  cicd: SiGithubactions,
  vercel: SiVercel,
  netlify: SiNetlify,
  nginx: SiNginx,
  kubernetes: SiKubernetes,
  aws: Cloud,
}

/** Sorted list of selectable icon keys (for the dashboard dropdown). */
export const TECH_ICON_KEYS = Object.keys(MAP).sort()

/** Render a tech brand icon by key (falls back to a generic code glyph). */
export function TechIcon({ icon, size = 22, className = '' }) {
  const Cmp = MAP[icon] || Code
  return <Cmp size={size} className={className} aria-hidden="true" />
}
