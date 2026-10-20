import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { metaForPath } from '../data/seo'
import { SITE } from '../data/site'

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
}

export default function usePageMeta() {
  const { pathname } = useLocation()
  const meta = metaForPath(pathname)

  // useLayoutEffect, not useEffect: the document head must be updated before
  // the browser paints the next route, otherwise a client-side navigation
  // briefly shows the previous route's title and canonical URL.
  useLayoutEffect(() => {
    const url = `${SITE.url}${meta.path === '/' ? '/' : meta.path}`
    const image = `${SITE.url}${SITE.ogImage}`

    document.title = meta.title

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (meta.noindex) {
      canonical?.remove()
    } else {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', url)
    }

    setMeta('meta[name="description"]', { name: 'description', content: meta.description })
    setMeta('meta[property="og:title"]', { property: 'og:title', content: meta.title })
    setMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: meta.description,
    })
    setMeta('meta[property="og:url"]', { property: 'og:url', content: url })
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title })
    setMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: meta.description,
    })
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })

    let robots = document.head.querySelector('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      document.head.appendChild(robots)
    }
    robots.setAttribute(
      'content',
      meta.noindex ? 'noindex, nofollow' : 'index, follow'
    )
  }, [meta])
}
