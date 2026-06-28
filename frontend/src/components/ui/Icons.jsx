// Central icon module — all icons come from lucide-react.
// Wrapped with consistent defaults (size 18, strokeWidth 1.75) for a clean,
// premium look. Any prop (size, strokeWidth, className, style) can override.
import {
  ArrowRight as LArrowRight,
  ArrowLeft as LArrowLeft,
  ArrowUp as LArrowUp,
  ArrowDown as LArrowDown,
  ArrowUpRight as LArrowUpRight,
  MapPin as LMapPin,
  Download as LDownload,
  Send as LSend,
  Mail as LMail,
  ExternalLink as LExternalLink,
  Eye as LEye,
  Filter as LFilter,
  Star as LStar,
  MessageCircle as LMessageCircle,
  Check as LCheck,
  X as LX,
  Info as LInfo,
  Plus as LPlus,
  Pencil as LPencil,
  Trash2 as LTrash2,
  Search as LSearch,
  Menu as LMenu,
  ChevronUp as LChevronUp,
  ChevronDown as LChevronDown,
  LayoutDashboard as LLayoutDashboard,
  Inbox as LInbox,
  FolderKanban as LFolderKanban,
  FileText as LFileText,
  Settings as LSettings,
  LogOut as LLogOut,
  Atom as LAtom,
  Wind as LWind,
  Database as LDatabase,
  GitBranch as LGitBranch,
  Braces as LBraces,
  FileCode2 as LFileCode2,
  Layers as LLayers,
  Server as LServer,
} from 'lucide-react'

const DEFAULTS = { size: 18, strokeWidth: 1.75 }

// Wrap a lucide icon so it ships with our default size/stroke.
const make = (Icon) => {
  const Wrapped = (props) => <Icon {...DEFAULTS} {...props} />
  Wrapped.displayName = `Icon(${Icon.displayName || Icon.name || 'Lucide'})`
  return Wrapped
}

/* ---- Public site + shared ---- */
export const ArrowRight = make(LArrowRight)
export const ArrowLeft = make(LArrowLeft)
export const ArrowUp = make(LArrowUp)
export const ArrowDown = make(LArrowDown)
export const ArrowUpRight = make(LArrowUpRight)
export const MapPin = make(LMapPin)
export const Download = make(LDownload)
export const Send = make(LSend)
export const Mail = make(LMail)
export const ExternalLink = make(LExternalLink)

// GitHub & LinkedIn are brand marks that lucide-react no longer ships (brand
// icons were removed). We keep tiny filled SVGs so the icon set stays
// consistent and inherits currentColor / sizing like the rest.
export const Github = ({ size = 18, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.85 9.73.5.1.68-.22.68-.49l-.01-1.7c-2.79.62-3.38-1.37-3.38-1.37-.46-1.18-1.12-1.5-1.12-1.5-.91-.64.07-.62.07-.62 1.01.07 1.54 1.06 1.54 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.63-1.38-2.23-.26-4.57-1.14-4.57-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.46 9.46 0 0112 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.35 4.79-4.59 5.05.36.32.68.94.68 1.9l-.01 2.81c0 .27.18.59.69.49A10.02 10.02 0 0022 12.25C22 6.58 17.52 2 12 2z" />
  </svg>
)
export const Linkedin = ({ size = 18, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C20.4 8.75 21 11.06 21 14.07V21h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.27V21H9z" />
  </svg>
)
export const Eye = make(LEye)
export const Filter = make(LFilter)
export const Star = make(LStar)
export const MessageCircle = make(LMessageCircle)
export const Check = make(LCheck)
export const X = make(LX)
export const Info = make(LInfo)

// WhatsApp has no brand icon in Lucide — use MessageCircle (styled green by
// the surrounding container). Kept as `Whatsapp` for existing call sites.
export const Whatsapp = make(LMessageCircle)

/* ---- Tech stack ---- */
export const Atom = make(LAtom)
export const Wind = make(LWind)
export const Database = make(LDatabase)
export const GitBranch = make(LGitBranch)
export const Braces = make(LBraces)
export const FileCode2 = make(LFileCode2)
export const Layers = make(LLayers)
export const Server = make(LServer)

/* ---- Admin dashboard ---- */
export const Plus = make(LPlus)
export const Pencil = make(LPencil)
export const Trash2 = make(LTrash2)
export const Search = make(LSearch)
export const Menu = make(LMenu)
export const ChevronUp = make(LChevronUp)
export const ChevronDown = make(LChevronDown)
export const LayoutDashboard = make(LLayoutDashboard)
export const Inbox = make(LInbox)
export const FolderKanban = make(LFolderKanban)
export const FileText = make(LFileText)
export const Settings = make(LSettings)
export const LogOut = make(LLogOut)
