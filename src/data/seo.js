/*
 * Route metadata used by both the client-side document head manager and the
 * post-build static shell generator (scripts/prerender.mjs).
 *
 * Keep this file dependency-free and Node-importable (no JSX, no Vite APIs).
 */

export const DEFAULT_SITE_URL = 'https://argus-header.vercel.app'
export const SITE_NAME = 'Argus Header'
export const OG_IMAGE_PATH = '/og-image.png'

export const PAGE_META = {
  '/': {
    title: 'Argus Header — Open-source HTTP security header analyzer',
    description:
      'Analyze HTTP response headers, surface missing security protections, information leakage, CORS and cache issues with a lightweight Python CLI. Install with pip.',
    path: '/',
  },
  '/docs': {
    title: 'Documentation — Argus Header',
    description:
      'Install Argus Header, run your first HTTP security header scan, and learn how findings, scores, exports and CI gates work in the v0.8.0 CLI.',
    path: '/docs',
  },
  '/docs/installation': {
    title: 'Installation — Argus Header Docs',
    description:
      'Install Argus Header from PyPI or source on Windows, Linux and macOS. Set up a virtual environment, verify the CLI, and fix common PATH issues.',
    path: '/docs/installation',
  },
  '/docs/quickstart': {
    title: 'Quick start — Argus Header Docs',
    description:
      'Run your first Argus Header scan, read the findings and score, understand exit codes, and learn what passive HTTP header analysis can and cannot tell you.',
    path: '/docs/quickstart',
  },
  '/docs/cli-reference': {
    title: 'CLI reference — Argus Header Docs',
    description:
      'Complete reference for the argus-header 0.8.0 command line: methods, timeouts, redirects, parallel scans, JSON, SARIF, Markdown, HTML, config and CI gates.',
    path: '/docs/cli-reference',
  },
  '/docs/security-checks': {
    title: 'Security checks — Argus Header Docs',
    description:
      'Every rule family and rule ID in Argus Header 0.8.0: CSP, HSTS, CORS, cookies, Cache-Control, cross-origin policies, referrer, permissions and base headers.',
    path: '/docs/security-checks',
  },
  '/docs/examples': {
    title: 'Examples — Argus Header Docs',
    description:
      'Copyable Argus Header examples for basic scans, HEAD requests, parallel targets, JSON and SARIF exports, CI gates, YAML configuration and report diffs.',
    path: '/docs/examples',
  },
  '/changelog': {
    title: 'Changelog — Argus Header',
    description:
      'Release history for Argus Header, from the first public beta to v0.8.0. See what shipped on PyPI and what is planned next.',
    path: '/changelog',
  },
  '/contributing': {
    title: 'Contributing — Argus Header',
    description:
      'Contribute to Argus Header: set up the Python repository, run tests and static checks, add analyzer rules, and submit a pull request.',
    path: '/contributing',
  },
  '/about': {
    title: 'About — Argus Header',
    description:
      'Why Argus Header exists, how it fits into a defensive security workflow, who it is for, and the limits of passive HTTP response-header analysis.',
    path: '/about',
  },
}

export const NOT_FOUND_META = {
  title: 'Page not found — Argus Header',
  description: 'The page you requested could not be found. Browse the Argus Header documentation or return home.',
  path: '/404',
  noindex: true,
}

export function normalizePath(pathname = '/') {
  if (!pathname) return '/'
  const withoutQuery = pathname.split('?')[0].split('#')[0]
  if (withoutQuery === '/') return '/'
  return withoutQuery.replace(/\/+$/, '') || '/'
}

export function metaForPath(pathname) {
  return PAGE_META[normalizePath(pathname)] || NOT_FOUND_META
}
