/**
 * Post-build static route generator.
 *
 * Vite produces a single dist/index.html with hashed asset references. This
 * script clones that shell into a directory per documented route and replaces
 * the route-specific metadata so direct loads, refreshes and link previews get
 * the right title, description, canonical URL and Open Graph tags before any
 * JavaScript runs.
 *
 * It also emits dist/404.html, dist/sitemap.xml and a robots.txt sitemap line.
 * The React app remains a client-side application; these are static HTML
 * entry points, not server-rendered page bodies.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  DEFAULT_SITE_URL,
  NOT_FOUND_META,
  PAGE_META,
  SITE_NAME,
} from '../src/data/seo.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const dist = path.join(root, 'dist')

const siteUrl = (process.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeXml(value) {
  return escapeHtml(value).replaceAll("'", '&apos;')
}

function absoluteUrl(routePath) {
  return `${siteUrl}${routePath === '/' ? '/' : routePath}`
}

function replaceTag(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    throw new Error(`Could not find ${label} in dist/index.html`)
  }
  return html.replace(pattern, replacement)
}

function withMetadata(shell, meta) {
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  const url = escapeHtml(absoluteUrl(meta.path))
  const image = escapeHtml(`${siteUrl}/og-image.png`)
  const isNotFound = Boolean(meta.noindex)

  let html = shell

  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`, 'title')
  html = replaceTag(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${description}" />`,
    'description meta tag'
  )
  html = replaceTag(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    isNotFound ? '' : `<link rel="canonical" href="${url}" />`,
    'canonical link'
  )

  html = replaceTag(
    html,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${title}" />`,
    'og:title meta tag'
  )
  html = replaceTag(
    html,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${description}" />`,
    'og:description meta tag'
  )
  html = replaceTag(
    html,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${url}" />`,
    'og:url meta tag'
  )
  html = replaceTag(
    html,
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${image}" />`,
    'og:image meta tag'
  )
  html = replaceTag(
    html,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${title}" />`,
    'twitter:title meta tag'
  )
  html = replaceTag(
    html,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${description}" />`,
    'twitter:description meta tag'
  )
  html = replaceTag(
    html,
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:image" content="${image}" />`,
    'twitter:image meta tag'
  )

  html = replaceTag(
    html,
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/,
    isNotFound
      ? '<meta name="robots" content="noindex, nofollow" />'
      : '<meta name="robots" content="index, follow" />',
    'robots meta tag'
  )

  if (isNotFound) {
    html = replaceTag(
      html,
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/,
      '<meta property="og:type" content="website" />',
      'og:type meta tag'
    )
  }

  return html
}

async function writeRoute(routePath, html) {
  const relative = routePath === '/' ? '' : routePath.replace(/^\/+/, '')
  const directory = path.join(dist, relative)
  await fs.mkdir(directory, { recursive: true })
  await fs.writeFile(path.join(directory, 'index.html'), html, 'utf8')
}

async function main() {
  const indexPath = path.join(dist, 'index.html')
  const shell = await fs.readFile(indexPath, 'utf8')

  const routes = Object.entries(PAGE_META)
  for (const [routePath, meta] of routes) {
    const html = withMetadata(shell, { ...meta, path: routePath })
    await writeRoute(routePath, html)
  }

  const notFoundHtml = withMetadata(shell, NOT_FOUND_META)
  await fs.writeFile(path.join(dist, '404.html'), notFoundHtml, 'utf8')

  const urlEntries = routes
    .map(
      ([routePath]) =>
        `  <url>\n    <loc>${escapeXml(absoluteUrl(routePath))}</loc>\n  </url>`
    )
    .join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`
  await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap, 'utf8')

  const robotsPath = path.join(dist, 'robots.txt')
  let robots = 'User-agent: *\nAllow: /\n'
  try {
    // Keep any site-specific rules, but always point at this build's sitemap.
    const existing = await fs.readFile(robotsPath, 'utf8')
    robots = existing.replace(/^Sitemap:.*$/gm, '').trimEnd()
  } catch {
    // No public/robots.txt; use the generated default.
  }
  await fs.writeFile(robotsPath, `${robots}\n\nSitemap: ${siteUrl}/sitemap.xml\n`, 'utf8')

  const routeList = routes.map(([routePath]) => routePath).join(', ')
  console.log(`Prerendered ${routes.length + 1} HTML entry points for ${SITE_NAME}: ${routeList}, /404`)
  console.log(`Sitemap: ${siteUrl}/sitemap.xml`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
