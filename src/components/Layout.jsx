import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import usePageMeta from '../lib/usePageMeta'

const GLYPH_CHARS = '■□▄▀█▓▒░▪▫01ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const GLYPHS = Array.from(
  { length: 500 },
  (_, index) => GLYPH_CHARS[(index * 7 + 3) % GLYPH_CHARS.length]
)

function RouteEffects() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}

export default function Layout() {
  usePageMeta()

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="site-background" aria-hidden="true">
        <div className="site-background__glyphs">
          {GLYPHS.map((glyph, index) => (
            <span key={index} style={{ '--i': index }}>
              {glyph}
            </span>
          ))}
        </div>
      </div>
      <RouteEffects />
      <Navbar />
      <main id="main" className="site-main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
