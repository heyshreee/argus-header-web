/*
 * Canonical product facts.
 *
 * Sources verified on 20 Oct 2026:
 * - PyPI JSON API: argus-header 0.8.0, requires Python >=3.9, MIT
 * - GitHub releases: v0.5.0 … v0.8.0
 * - Repository pyproject.toml + CLI --help output
 * - Both the `main` and `development` branches declare 0.8.0
 *
 * The next planned release, 0.9.0, exists only as a roadmap entry in the
 * upstream README and docs. No branch declares a 0.9.0-dev version string and
 * no v0.9.0 tag, GitHub release or PyPI publication exists. The website
 * therefore presents 0.8.0 as the current stable release and 0.9.0 as
 * planned work that is not yet available.
 */

const configuredUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
  'https://argus-header.vercel.app'

export const PRODUCT = {
  name: 'Argus Header',
  shortName: 'Argus',
  wordmark: 'ARGUS HEADER',
  packageName: 'argus-header',
  version: '0.8.0',
  versionLabel: 'v0.8.0',
  nextVersion: '0.9.0',
  nextVersionStatus: 'Planned — not released',
  releaseDate: '20 September 2026',
  python: 'Python 3.9+',
  license: 'MIT',
  author: 'Sriram',
  authorHandle: '@heyshreee',
  tagline: 'Open-source HTTP security header analyzer',
  description:
    'Analyze HTTP response headers, identify missing security protections, and surface information leakage with a lightweight Python CLI built for developers and security engineers.',
}

export const SITE = {
  url: configuredUrl.replace(/\/+$/, ''),
  name: 'Argus Header',
  locale: 'en',
  themeColor: '#000000',
  ogImage: '/og-image.png',
}

export const LINKS = {
  github: 'https://github.com/heyshreee/argus-header',
  pypi: 'https://pypi.org/project/argus-header/',
  pypiReleases: 'https://pypi.org/project/argus-header/#history',
  issues: 'https://github.com/heyshreee/argus-header/issues',
  newIssue: 'https://github.com/heyshreee/argus-header/issues/new',
  pulls: 'https://github.com/heyshreee/argus-header/pulls',
  releases: 'https://github.com/heyshreee/argus-header/releases',
  license: 'https://github.com/heyshreee/argus-header/blob/main/LICENSE',
  readme: 'https://github.com/heyshreee/argus-header/blob/main/README.md',
  contributing:
    'https://github.com/heyshreee/argus-header/blob/main/CONTRIBUTING.md',
  changelog:
    'https://github.com/heyshreee/argus-header/blob/main/CHANGELOG.md',
  documentation:
    'https://github.com/heyshreee/argus-header/blob/main/docs/DOCUMENTATION.md',
  securityPolicy:
    'https://github.com/heyshreee/argus-header/security/policy',
  reportVulnerability:
    'https://github.com/heyshreee/argus-header/security/advisories/new',
  author: 'https://github.com/heyshreee',
}

export const INSTALL_COMMAND = `pip install ${PRODUCT.packageName}`
export const VERIFY_COMMAND = 'argus-header --version'
export const VERIFY_OUTPUT = 'Argus Header 0.8.0'
export const FIRST_SCAN_COMMAND = 'argus-header https://example.com'

export const NAV_LINKS = [
  { label: 'Features', to: '/#features' },
  { label: 'Security Checks', to: '/#checks' },
  { label: 'Integrations', to: '/#integrations' },
  { label: 'Docs', to: '/docs' },
]

export const DOC_NAV = [
  {
    label: 'Getting started',
    items: [
      { label: 'Overview', to: '/docs' },
      { label: 'Installation', to: '/docs/installation' },
      { label: 'Quick start', to: '/docs/quickstart' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { label: 'CLI reference', to: '/docs/cli-reference' },
      { label: 'Security checks', to: '/docs/security-checks' },
      { label: 'Examples', to: '/docs/examples' },
    ],
  },
  {
    label: 'Project',
    items: [
      { label: 'Changelog', to: '/changelog' },
      { label: 'Contributing', to: '/contributing' },
      { label: 'About', to: '/about' },
    ],
  },
]

export const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/#features' },
      { label: 'Documentation', to: '/docs' },
      { label: 'Installation', to: '/docs/installation' },
      { label: 'Quick start', to: '/docs/quickstart' },
    ],
  },
  {
    title: 'Reference',
    links: [
      { label: 'CLI reference', to: '/docs/cli-reference' },
      { label: 'Security checks', to: '/docs/security-checks' },
      { label: 'Examples', to: '/docs/examples' },
      { label: 'Changelog', to: '/changelog' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'GitHub', href: LINKS.github, external: true },
      { label: 'PyPI package', href: LINKS.pypi, external: true },
      { label: 'Issue tracker', href: LINKS.issues, external: true },
      { label: 'Contributing', to: '/contributing' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { label: 'MIT License', href: LINKS.license, external: true },
      { label: 'Security policy', href: LINKS.securityPolicy, external: true },
      { label: 'Report a vulnerability', href: LINKS.reportVulnerability, external: true },
      { label: 'About the project', to: '/about' },
    ],
  },
]

export const DISCLAIMER =
  'Argus Header is intended for defensive security, authorized auditing, and education. Only assess systems you own or have explicit permission to test. Header analysis cannot guarantee that an application is secure.'
