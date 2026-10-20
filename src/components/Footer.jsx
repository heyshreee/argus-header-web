import { Link } from 'react-router-dom'
import { ExternalLink } from './Links'
import Logo from './Logo'
import CopyButton from './CopyButton'
import { DISCLAIMER, INSTALL_COMMAND, LINKS, PRODUCT } from '../data/site'

const FOOTER_LINKS = [
  { label: 'Docs', to: '/docs' },
  { label: 'Installation', to: '/docs/installation' },
  { label: 'CLI reference', to: '/docs/cli-reference' },
  { label: 'Security checks', to: '/docs/security-checks' },
  { label: 'Changelog', to: '/changelog' },
  { label: 'Contributing', to: '/contributing' },
  { label: 'About', to: '/about' },
  { label: 'GitHub', href: LINKS.github, external: true },
  { label: 'PyPI', href: LINKS.pypi, external: true },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <Logo />
          <nav className="footer__links" aria-label="Footer">
            {FOOTER_LINKS.map((link) =>
              link.external ? (
                <ExternalLink key={link.label} href={link.href} className="footer__link">
                  {link.label}
                </ExternalLink>
              ) : (
                <Link key={link.label} className="footer__link" to={link.to}>
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>

        <p className="footer__tagline">Built for developers, by developers.</p>

        <div className="footer__install">
          <code>{INSTALL_COMMAND}</code>
          <CopyButton value={INSTALL_COMMAND} label="Copy install command" />
        </div>

        <p className="footer__disclaimer" role="note">
          <strong>Responsible use.</strong> {DISCLAIMER}
        </p>

        <div className="footer__bottom">
          <span>
            © {year} {PRODUCT.name} · {PRODUCT.license} licensed
          </span>
          <span className="footer__bottom-meta">
            Stable {PRODUCT.versionLabel} · {PRODUCT.python} ·{' '}
            <ExternalLink href={LINKS.author} className="footer__inline-link">
              {PRODUCT.author}
            </ExternalLink>
          </span>
        </div>
      </div>
    </footer>
  )
}
