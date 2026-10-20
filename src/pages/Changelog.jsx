import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { ExternalLink } from '../components/Links'
import { Eyebrow } from '../components/DocBlocks'
import { RELEASES, UNRELEASED } from '../data/changelog'
import { LINKS, PRODUCT } from '../data/site'

function ReleaseList({ items }) {
  if (!items?.length) return null
  return (
    <ul className="release-changes">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function ReleaseChanges({ release }) {
  return (
    <div className="release-card__changes">
      {release.added.length > 0 && (
        <div>
          <h3><span className="release-tag release-tag--added">Added</span></h3>
          <ReleaseList items={release.added} />
        </div>
      )}
      {release.changed.length > 0 && (
        <div>
          <h3><span className="release-tag release-tag--changed">Changed</span></h3>
          <ReleaseList items={release.changed} />
        </div>
      )}
      {release.fixed.length > 0 && (
        <div>
          <h3><span className="release-tag release-tag--fixed">Fixed</span></h3>
          <ReleaseList items={release.fixed} />
        </div>
      )}
      {release.security.length > 0 && (
        <div>
          <h3><span className="release-tag release-tag--security">Security</span></h3>
          <ReleaseList items={release.security} />
        </div>
      )}
    </div>
  )
}

export default function Changelog() {
  return (
    <div className="container page-shell">
      <header className="page-hero">
        <Eyebrow>Project · release history</Eyebrow>
        <h1>Changelog</h1>
        <p className="page-hero__lead">
          What shipped on PyPI, what changed in each tagged release, and what is
          still in development. The current stable release is {PRODUCT.versionLabel}.
        </p>
        <div className="page-hero__meta">
          <span className="status-dot" aria-hidden="true" />
          <span>Latest stable {PRODUCT.versionLabel}</span>
          <span className="page-hero__divider" aria-hidden="true">/</span>
          <span>5 published releases</span>
        </div>
        <div className="page-hero__actions">
          <ExternalLink href={LINKS.releases} className="text-link">
            GitHub releases
          </ExternalLink>
          <ExternalLink href={LINKS.pypiReleases} className="text-link">
            PyPI history
          </ExternalLink>
          <Link className="text-link" to="/docs">Documentation</Link>
        </div>
      </header>

      <div className="release-timeline">
        {RELEASES.map((release, index) => (
          <article
            className={`release-card${index === 0 ? ' release-card--latest' : ''}`}
            key={release.version}
            id={`v${release.version.replaceAll('.', '-')}`}
          >
            <div className="release-card__rail" aria-hidden="true">
              <span className="release-card__dot" />
            </div>
            <div className="release-card__content">
              <div className="release-card__head">
                <div>
                  <div className="release-card__version-row">
                    <h2>v{release.version}</h2>
                    {release.status === 'Latest stable' ? (
                      <span className="pill pill--accent">{release.status}</span>
                    ) : (
                      <span className="pill">{release.status}</span>
                    )}
                  </div>
                  <p className="release-card__date">
                    Published {release.published}
                    {release.changelogDate && (
                      <span> · changelog dated {release.changelogDate}</span>
                    )}
                  </p>
                </div>
                <div className="release-card__links">
                  <ExternalLink href={release.tagUrl} className="text-link">
                    Tag
                  </ExternalLink>
                  <ExternalLink href={release.pypiUrl} className="text-link">
                    PyPI
                  </ExternalLink>
                </div>
              </div>

              <p className="release-card__summary">{release.summary}</p>

              <details className="release-card__details" open={index === 0}>
                <summary>
                  <span>
                    Release notes
                    <span className="release-card__count">
                      {release.added.length + release.changed.length + release.fixed.length + release.security.length} changes
                    </span>
                  </span>
                  <Icon name="chevronDown" size={16} />
                </summary>
                <ReleaseChanges release={release} />
              </details>

              {release.note && (
                <p className="release-card__note">
                  <Icon name="info" size={15} />
                  <span>{release.note}</span>
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      <section className="unreleased-card" aria-labelledby="unreleased-title">
        <div className="unreleased-card__head">
          <span className="pill pill--warning">{UNRELEASED.status}</span>
          <h2 id="unreleased-title">{UNRELEASED.version}</h2>
          <p>{UNRELEASED.source}</p>
        </div>
        <div className="unreleased-card__body">
          <div>
            <h3>Roadmap items in the repository README</h3>
            <ul className="release-changes">
              {UNRELEASED.planned.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="unreleased-card__note">{UNRELEASED.note}</p>
        </div>
      </section>

      <section className="changelog-footnote" aria-labelledby="changelog-footnote-title">
        <h2 id="changelog-footnote-title">How release dates are reported</h2>
        <p>
          GitHub release timestamps and PyPI upload times are shown as the
          published date. Where the repository changelog carries a different
          date, both are displayed rather than silently choosing one. Version
          0.8.0 was dated 3 September in the changelog but published on 20
          September 2026.
        </p>
        <p>
          Only tagged, published releases are presented as available. A version
          string in a development branch is not a release.
        </p>
        <div className="changelog-footnote__links">
          <Link className="button button--secondary button--md" to="/docs/installation">
            Install {PRODUCT.versionLabel}
            <Icon name="arrowRight" size={15} />
          </Link>
          <ExternalLink href={LINKS.changelog} className="text-link">
            Read CHANGELOG.md on GitHub
          </ExternalLink>
        </div>
      </section>
    </div>
  )
}
