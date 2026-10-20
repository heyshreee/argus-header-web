import { useEffect, useState } from 'react'

const API_URL = 'https://api.github.com/repos/heyshreee/argus-header'
const CACHE_KEY = 'argus-header:github-stars'
const CACHE_FRESH_MS = 60 * 1000
const REFRESH_MS = 5 * 60 * 1000

function readCache() {
  if (typeof window === 'undefined') return null

  try {
    const value = JSON.parse(window.sessionStorage.getItem(CACHE_KEY) || 'null')
    if (!value || !Number.isInteger(value.count) || value.count < 0) return null
    return {
      count: value.count,
      at: Number.isFinite(value.at) ? value.at : 0,
    }
  } catch {
    return null
  }
}

function writeCache(count) {
  try {
    window.sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ count, at: Date.now() })
    )
  } catch {
    // Storage can be unavailable in private browsing modes.
  }
}

export default function useGitHubStars() {
  const [initial] = useState(readCache)
  const [count, setCount] = useState(initial ? initial.count : null)
  const [status, setStatus] = useState(initial ? 'cached' : 'loading')

  useEffect(() => {
    let disposed = false
    let timer = 0
    let controller = null
    let lastFetched = initial ? initial.at : 0

    async function loadStars() {
      if (controller) return

      controller = new AbortController()

      try {
        const response = await fetch(API_URL, {
          cache: 'no-store',
          headers: {
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}`)
        }

        const data = await response.json()
        const nextCount = data?.stargazers_count

        if (!Number.isInteger(nextCount) || nextCount < 0) {
          throw new Error('GitHub API did not return a star count')
        }

        lastFetched = Date.now()

        if (!disposed) {
          setCount(nextCount)
          setStatus('ready')
          writeCache(nextCount)
        }
      } catch (error) {
        if (!disposed && error.name !== 'AbortError') {
          setStatus('error')
        }
      } finally {
        controller = null
      }
    }

    function refreshIfStale() {
      if (document.visibilityState !== 'visible' || controller) return
      if (Date.now() - lastFetched > CACHE_FRESH_MS) {
        void loadStars()
      }
    }

    function startRefreshTimer() {
      if (timer) window.clearInterval(timer)
      timer = window.setInterval(() => {
        if (document.visibilityState === 'visible') void loadStars()
      }, REFRESH_MS)
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        refreshIfStale()
        startRefreshTimer()
      } else if (timer) {
        window.clearInterval(timer)
        timer = 0
      }
    }

    if (!initial || Date.now() - lastFetched > CACHE_FRESH_MS) {
      void loadStars()
    }

    if (document.visibilityState === 'visible') {
      startRefreshTimer()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', refreshIfStale)

    return () => {
      disposed = true
      controller?.abort()
      if (timer) window.clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', refreshIfStale)
    }
  }, [initial])

  return { count, status }
}
