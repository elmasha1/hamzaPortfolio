import { Component } from 'react'

/**
 * AdminErrorBoundary — keeps a broken page from taking the whole dashboard
 * with it.
 *
 * Without a boundary anywhere in the tree, a render error unmounts everything
 * and leaves an empty document: no sidebar, no navigation, nothing to click to
 * get back. This catches the failure at the content area, so the chrome stays
 * put and the section can be retried or navigated away from.
 */
export default class AdminErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Admin section crashed:', error, info?.componentStack)
  }

  componentDidUpdate(prevProps) {
    // Navigating to another section clears the error — otherwise the boundary
    // would keep showing the failure of a page you have already left.
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null })
    }
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="rounded-2xl border border-coral/30 bg-coral/5 p-8">
        <h2 className="font-heading text-xl font-semibold text-heading">
          This section failed to render
        </h2>
        <p className="mt-2 max-w-prose text-sm text-muted">
          The rest of the dashboard is still working — pick another section from
          the sidebar, or reload to try this one again.
        </p>
        <p className="mt-4 font-mono text-xs text-muted">{String(this.state.error?.message || this.state.error)}</p>
        <button
          type="button"
          onClick={() => this.setState({ error: null })}
          className="mt-6 rounded-xl border border-line px-4 py-2 text-sm font-medium text-heading transition hover:bg-white/[0.06]"
        >
          Try again
        </button>
      </div>
    )
  }
}
