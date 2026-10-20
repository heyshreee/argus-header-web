import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Icon from './Icon'
import GitHubStars from './GitHubStars'
import Logo from './Logo'
import { ExternalLink } from './Links'
import { LINKS, NAV_LINKS, PRODUCT } from '../data/site'

const MOBILE_DOC_LINKS = [
  { label: 'Documentation', to: '/docs' },
  { label: 'Installation', to: '/docs/installation' },
  { label: 'Quick start', to: '/docs/quickstart' },
  { label: 'CLI Reference', to: '/docs/cli-reference' },
  { label: 'Security checks', to: '/docs/security-checks' },
  { label: 'Examples', to: '/docs/examples' },
]

const MOBILE_PROJECT_LINKS = [
  { label: 'Changelog', to: '/changelog' },
  { label: 'Contributing', to: '/contributing' },
  { label: 'About', to: '/about' },
]

function isSectionLink(to) {
  return to.includes('#')
}

function linkClass({ isActive }) {
  return `nav__link${isActive ? ' is-active' : ''}`
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)
  const panelRef = useRef(null)
  const { pathname, hash } = useLocation()
  const docsMode = pathname === '/docs' || pathname.startsWith('/docs/')

  useEffect(() => {
    setOpen(false)
  }, [pathname, hash])

  useEffect(() => {
    if (!open) {
      document.body.removeAttribute('data-scroll-lock')
      return undefined
    }

    document.body.setAttribute('data-scroll-lock', 'true')
    const panel = panelRef.current
    const focusable = panel?.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    focusable?.[0]?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (event.key !== 'Tab' || !focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.removeAttribute('data-scroll-lock')
    }
  }, [open])

  return (
    <header className={`nav${docsMode ? ' docs-mode' : ''}`} data-open={open}>
      <div className="nav__inner">
        <div className="nav__left">
          <Link className="brand-link" to="/" aria-label="ARGUS CLI home">
            <Logo />
          </Link>

          {docsMode ? (
            <span className="nav__crumb">
              <span aria-hidden="true">/</span>
              <strong>Documentation</strong>
            </span>
          ) : (
            <nav className="nav__links" aria-label="Primary">
              {NAV_LINKS.map((link) =>
                isSectionLink(link.to) ? (
                  <Link key={link.label} to={link.to} className="nav__link">
                    {link.label}
                  </Link>
                ) : (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    end={link.to === '/'}
                    className={linkClass}
                  >
                    {link.label}
                  </NavLink>
                )
              )}
            </nav>
          )}
        </div>

        <div className="nav__actions">
          <GitHubStars />

          {docsMode ? (
            <Link className="nav__back" to="/">
              ← Main site
            </Link>
          ) : (
            <>
              <span
                className="nav__version"
                aria-label={`Stable release ${PRODUCT.versionLabel}`}
              >
                <span className="status-dot" aria-hidden="true" />
                {PRODUCT.versionLabel}
              </span>
              <Link
                className="nav__install"
                to="/docs/installation"
                aria-label="Install Argus Header"
              >
                <Icon name="copy" size={13} />
                <span className="nav__install-prompt" aria-hidden="true">
                  $
                </span>
                <span className="nav__install-label">Install</span>
              </Link>
            </>
          )}

          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="nav__burger" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu" id="mobile-navigation" ref={panelRef}>
          <nav aria-label="Mobile">
            <ul className="mobile-menu__list">
              {NAV_LINKS.map((link, index) => (
                <li key={link.label}>
                  {isSectionLink(link.to) ? (
                    <Link to={link.to} className="mobile-menu__link">
                      <span className="mobile-menu__index">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {link.label}
                    </Link>
                  ) : (
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `mobile-menu__link${isActive ? ' is-active' : ''}`
                      }
                    >
                      <span className="mobile-menu__index">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {link.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>

            <div className="mobile-menu__group">
              <span className="data-label">Documentation</span>
              <ul className="mobile-menu__external">
                {MOBILE_DOC_LINKS.map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to} className="mobile-menu__external-link">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mobile-menu__group">
              <span className="data-label">Project</span>
              <ul className="mobile-menu__external">
                {MOBILE_PROJECT_LINKS.map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to} className="mobile-menu__external-link">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <ExternalLink href={LINKS.github} className="mobile-menu__external-link">
                    GitHub
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href={LINKS.pypi} className="mobile-menu__external-link">
                    PyPI
                  </ExternalLink>
                </li>
              </ul>
            </div>

            <Link className="button button--primary mobile-menu__cta" to="/docs/installation">
              Get Started
              <Icon name="arrowRight" size={16} />
            </Link>
            <p className="mobile-menu__meta">
              {PRODUCT.name} {PRODUCT.versionLabel} · {PRODUCT.license} · {PRODUCT.python}
            </p>
          </nav>
        </div>
      )}
    </header>
  )
}
