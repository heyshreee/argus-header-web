import { Link } from 'react-router-dom'
import Icon from './Icon'

const FEATURES = [
  {
    id: 'headers',
    icon: 'shield',
    title: 'Security header analysis',
    description:
      'Review the headers that tell browsers how to enforce HTTPS, restrict content, block framing and MIME sniffing. The engine parses values instead of only checking presence.',
    items: [
      'Content-Security-Policy',
      'Strict-Transport-Security',
      'X-Frame-Options + X-Content-Type-Options',
      'Referrer-Policy + Permissions-Policy',
    ],
    link: '/docs/security-checks#csp',
    linkLabel: 'Header rules',
    wide: true,
  },
  {
    id: 'leakage',
    icon: 'eye',
    title: 'Information leakage',
    description:
      'Surface Server and X-Powered-By disclosure without pretending a banner is an exploit.',
    items: ['Server', 'X-Powered-By'],
    link: '/docs/security-checks#base-headers',
    linkLabel: 'Leakage checks',
  },
  {
    id: 'cors',
    icon: 'crosshair',
    title: 'CORS review',
    description:
      'Inspect wildcard and null origins, credentialed wildcards, dangerous methods and long preflight caches in a single response.',
    items: ['Wildcard + credentials', 'null origin', 'TRACE / CONNECT', 'max-age > 600'],
    link: '/docs/security-checks#cors',
    linkLabel: 'CORS checks',
  },
  {
    id: 'cache',
    icon: 'database',
    title: 'Cache-Control',
    description:
      'Find missing caching policy, absent no-store and public caching without safety directives — with the context limits stated.',
    items: ['Missing header', 'no-store', 'public'],
    link: '/docs/security-checks#cache',
    linkLabel: 'Cache checks',
  },
  {
    id: 'cookies',
    icon: 'cookie',
    title: 'Cookie hygiene',
    description:
      'Parse every Set-Cookie value for Secure, HttpOnly, SameSite and __Host- prefix rules, including SameSite=None without Secure.',
    items: ['Secure / HttpOnly', 'SameSite', '__Host-'],
    link: '/docs/security-checks#cookies',
    linkLabel: 'Cookie rules',
  },
  {
    id: 'reports',
    icon: 'file',
    title: 'Reports and automation',
    description:
      'Take the same canonical report to the terminal, JSON, SARIF 2.1.0, Markdown or HTML. Gate a pipeline with exit codes and compare two reports.',
    items: ['JSON schema 0.8', 'SARIF 2.1.0', 'CI gates', 'report diff'],
    link: '/docs/cli-reference#reports',
    linkLabel: 'Output formats',
    wide: true,
  },
]

export default function FeatureGrid() {
  return (
    <div className="feature-grid">
      {FEATURES.map((feature) => (
        <article
          className={`feature-card${feature.wide ? ' feature-card--wide' : ''}`}
          key={feature.id}
        >
          <div className="feature-card__top">
            <span className="feature-card__icon" aria-hidden="true">
              <Icon name={feature.icon} size={21} />
            </span>
            <span className="feature-card__index">{feature.id.toUpperCase()}</span>
          </div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
          <ul className="feature-card__items">
            {feature.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link className="text-link feature-card__link" to={feature.link}>
            {feature.linkLabel}
            <Icon name="arrowRight" size={14} />
          </Link>
        </article>
      ))}
    </div>
  )
}
