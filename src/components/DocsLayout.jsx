import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import Icon from './Icon'
import { DocPager } from './DocBlocks'
import { DOC_NAV, LINKS, PRODUCT } from '../data/site'

const FLAT_NAV = DOC_NAV.flatMap((group) => group.items)

const GROUP_ICONS = {
  'Getting started': 'book',
  Reference: 'terminal',
  Project: 'git',
}

function DocsNav() {
  return (
    <nav className="docs-nav" aria-label="Documentation">
      {DOC_NAV.map((group) => (
        <div className="docs-nav__group" key={group.label}>
          <p className="docs-nav__label">
            <Icon name={GROUP_ICONS[group.label] || 'file'} size={12} />
            {group.label}
          </p>
          <ul>
            {group.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/docs'}
                  className={({ isActive }) =>
                    `docs-nav__link${isActive ? ' is-active' : ''}`
                  }
                >
                  <span>{item.label}</span>
                  <span className="docs-nav__chevron" aria-hidden="true">
                    ›
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export default function DocsLayout() {
  const { pathname } = useLocation()
  const cleanPath = pathname.replace(/\/+$/, '') || '/'
  const currentIndex = FLAT_NAV.findIndex((item) => item.to === cleanPath)
  const current = currentIndex >= 0 ? FLAT_NAV[currentIndex] : null
  const prev = currentIndex > 0 ? FLAT_NAV[currentIndex - 1] : null
  const next =
    currentIndex >= 0 && currentIndex < FLAT_NAV.length - 1
      ? FLAT_NAV[currentIndex + 1]
      : null

  return (
    <div className="docs-shell">
      <aside className="docs-sidebar">
        <div className="docs-sidebar__inner">
          <div className="docs-sidebar__title">
            <Icon name="book" size={18} />
            <span>Documentation</span>
          </div>

          <details className="docs-mobile-nav">
            <summary>
              <span>
                <span className="data-label">Documentation menu</span>
                <strong>{current?.label || 'Overview'}</strong>
              </span>
              <Icon name="chevronDown" size={18} />
            </summary>
            <DocsNav />
          </details>

          <div className="docs-desktop-nav">
            <DocsNav />
          </div>

          <div className="docs-sidebar__meta">
            <span className="status-dot" aria-hidden="true" />
            <span>
              Stable {PRODUCT.versionLabel}
              <br />
              <a href={LINKS.pypi} target="_blank" rel="noopener noreferrer">
                Published on PyPI
              </a>
            </span>
          </div>
        </div>
      </aside>

      <div className="docs-content">
        <nav className="docs-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/docs">Docs</Link>
          {cleanPath !== '/docs' && current && (
            <>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{current.label}</span>
            </>
          )}
        </nav>

        <Outlet />

        <DocPager prev={prev} next={next} />
      </div>
    </div>
  )
}
