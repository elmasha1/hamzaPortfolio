/**
 * BrowserFrame — a polished browser-window chrome around a screenshot so
 * project images look like real product shots. Pure presentational.
 */
export default function BrowserFrame({ children, url = 'localhost:3000', className = '' }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-line bg-[#0B1A33] shadow-soft ${className}`}
    >
      {/* Title bar (dark chrome, keep the 3 traffic-light dots) */}
      <div className="flex items-center gap-2 border-b border-line bg-[#081428] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <div className="ml-2 hidden flex-1 truncate rounded-md bg-[#0B1A33] px-3 py-0.5 text-[11px] text-muted sm:block">
          {url}
        </div>
      </div>
      {/* Viewport */}
      <div className="relative">{children}</div>
    </div>
  )
}
