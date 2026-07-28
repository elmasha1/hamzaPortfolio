/**
 * Shared HTTP behaviour for both API clients — the public site's and the
 * dashboard's.
 *
 * The API sleeps after 15 minutes of inactivity, and the first request then
 * waits for a container to boot, migrate and warm its caches. Two things have
 * to hold for that not to look like an outage:
 *
 *  - the timeout has to outlast a cold start, or the request is aborted while
 *    the server is still coming up;
 *  - a connection that is refused outright has to be retried, because a
 *    container still binding its port answers nothing at all — waiting longer
 *    doesn't help, asking again does.
 *
 * A scheduled ping keeps the service awake so this rarely triggers, but the
 * ping can be late and the free tier can restart at any time.
 */
export const COLD_START_TIMEOUT = 75000

const RETRY_DELAY = 2000

/**
 * Retry reads once on a connection-level failure.
 *
 * Only GETs: they're idempotent. Re-sending a contact message, a login or any
 * dashboard write would not be.
 */
export function installReadRetry(instance) {
  instance.interceptors.response.use(undefined, async (error) => {
    const config = error.config
    const isRead = (config?.method || 'get').toLowerCase() === 'get'
    const noResponseAtAll = !error.response

    if (!config || !isRead || !noResponseAtAll || config.__retried) {
      return Promise.reject(error)
    }

    config.__retried = true
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))

    return instance.request(config)
  })

  return instance
}
