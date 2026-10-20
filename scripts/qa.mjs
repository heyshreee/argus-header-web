/**
 * Production QA for the Argus Header site.
 *
 * Run after `npm run build`:
 *   npm run qa
 *
 * The script serves dist/ with the same clean-URL/404 behaviour as the Vercel
 * configuration and checks static metadata, rendered pages, internal links,
 * clipboard interactions, mobile navigation and WCAG rules with axe-core.
 */

import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import {
  DEFAULT_SITE_URL,
  NOT_FOUND_META,
  PAGE_META,
} from '../src/data/seo.js'
import { startServer } from './serve-dist.mjs'

const SITE_URL = DEFAULT_SITE_URL
const ROUTES = Object.keys(PAGE_META)
const failures = []
let passed = 0

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function check(name, fn) {
  try {
    await fn()
    passed += 1
    console.log(`  ✓ ${name}`)
  } catch (error) {
    failures.push({ name, message: error.message })
    console.log(`  ✗ ${name}\n    ${error.message}`)
  }
}

function excerpt(value, length = 240) {
  const text = String(value).replace(/\s+/g, ' ').trim()
  return text.length > length ? `${text.slice(0, length)}…` : text
}

async function rawShellChecks(baseUrl) {
  console.log('\nStatic route shells')

  for (const route of ROUTES) {
    const meta = PAGE_META[route]
    await check(`${route} shell metadata`, async () => {
      const response = await fetch(`${baseUrl}${route}`)
      assert(response.status === 200, `expected HTTP 200, got ${response.status}`)
      const html = await response.text()
      assert(html.includes(`<title>${meta.title}</title>`), 'title mismatch in raw HTML')
      assert(
        html.includes(`<meta name="description" content="${meta.description}" />`),
        'description mismatch in raw HTML'
      )
      assert(
        html.includes(`<link rel="canonical" href="${SITE_URL}${route === '/' ? '/' : route}" />`),
        'canonical mismatch in raw HTML'
      )
      assert(html.includes(`<meta property="og:url" content="${SITE_URL}${route === '/' ? '/' : route}" />`), 'og:url mismatch in raw HTML')
      assert(html.includes('<meta name="robots" content="index, follow" />'), 'missing index robots tag')
    })
  }

  await check('/404 shell metadata', async () => {
    const response = await fetch(`${baseUrl}/this-route-does-not-exist`)
    assert(response.status === 404, `expected HTTP 404, got ${response.status}`)
    const html = await response.text()
    assert(html.includes(`<title>${NOT_FOUND_META.title}</title>`), '404 title mismatch')
    assert(html.includes('<meta name="robots" content="noindex, nofollow" />'), '404 is not noindex')
    assert(!html.includes('rel="canonical"'), '404 still has a canonical link')
  })

  await check('trailing slash redirect', async () => {
    const response = await fetch(`${baseUrl}/docs/`, { redirect: 'manual' })
    assert(response.status === 308, `expected 308, got ${response.status}`)
    assert(response.headers.get('location') === '/docs', 'unexpected redirect target')
  })
}

async function browserChecks(baseUrl) {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: 'dark',
    reducedMotion: 'no-preference',
  })
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseUrl })
  const page = await context.newPage()

  const consoleErrors = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(excerpt(message.text(), 300))
  })
  page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`))

  const internalLinks = new Map()
  const externalLinks = new Set()

  console.log('\nRendered pages (1440px)')

  for (const route of ROUTES) {
    const meta = PAGE_META[route]
    consoleErrors.length = 0

    await check(`${route} renders with correct metadata`, async () => {
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'load' })
      assert(response?.status() === 200, `expected HTTP 200, got ${response?.status()}`)
      await page.locator('h1').first().waitFor({ state: 'visible', timeout: 10000 })

      const data = await page.evaluate(() => ({
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content,
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        ogUrl: document.querySelector('meta[property="og:url"]')?.content,
        robots: document.querySelector('meta[name="robots"]')?.content,
        h1s: [...document.querySelectorAll('h1')].map((node) => node.textContent.trim()),
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        main: Boolean(document.querySelector('main#main')),
        bodyText: document.body.innerText.length,
        duplicateIds: [...document.querySelectorAll('[id]')]
          .map((node) => node.id)
          .filter((id, index, all) => all.indexOf(id) !== index),
        images: [...document.images].map((image) => ({
          src: image.currentSrc,
          complete: image.complete,
          width: image.naturalWidth,
        })),
        links: [...document.querySelectorAll('a[href]')].map((anchor) => ({
          href: anchor.getAttribute('href'),
          name:
            anchor.getAttribute('aria-label') ||
            anchor.textContent.trim() ||
            anchor.querySelector('img')?.alt ||
            '',
          target: anchor.getAttribute('target'),
          rel: anchor.getAttribute('rel') || '',
        })),
      }))

      assert(data.title === meta.title, `title: expected “${meta.title}”, got “${data.title}”`)
      assert(data.description === meta.description, 'description mismatch')
      assert(
        data.canonical === `${SITE_URL}${route === '/' ? '/' : route}`,
        `canonical: expected ${SITE_URL}${route}, got ${data.canonical}`
      )
      assert(data.ogUrl === `${SITE_URL}${route === '/' ? '/' : route}`, 'og:url mismatch')
      assert(data.robots === 'index, follow', `unexpected robots value: ${data.robots}`)
      assert(data.h1s.length === 1, `expected exactly one h1, found ${data.h1s.length}`)
      assert(data.h1s[0].length > 4, 'h1 is empty')
      assert(data.main, 'missing main#main landmark')
      assert(data.bodyText > 300, 'page body looks empty')
      assert(data.overflow <= 1, `horizontal overflow of ${data.overflow}px`)
      assert(data.duplicateIds.length === 0, `duplicate ids: ${data.duplicateIds.join(', ')}`)
      assert(
        data.images.every((image) => image.complete && image.width > 0),
        'one or more images failed to load'
      )

      for (const link of data.links) {
        assert(link.name.trim().length > 0, `link without an accessible name: ${link.href}`)
        assert(
          !link.target || link.rel.includes('noopener'),
          `target=_blank link without rel=noopener: ${link.href}`
        )

        const raw = link.href || ''
        if (!raw || raw.startsWith('#') || /^(mailto|tel):/.test(raw)) continue
        const url = new URL(raw, page.url())

        if (url.origin === baseUrl) {
          const pathname = url.pathname.replace(/\/+$/, '') || '/'
          assert(PAGE_META[pathname], `internal link points at an undocumented route: ${pathname}`)
          if (!internalLinks.has(pathname)) internalLinks.set(pathname, new Set())
          if (url.hash) internalLinks.get(pathname).add(url.hash.slice(1))
        } else {
          assert(url.protocol === 'https:', `external link is not HTTPS: ${raw}`)
          externalLinks.add(url.href)
        }
      }

      assert(consoleErrors.length === 0, `console errors: ${consoleErrors.join(' | ')}`)
    })

    await check(`${route} axe accessibility`, async () => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
      assert(
        results.violations.length === 0,
        results.violations
          .map(
            (violation) =>
              `${violation.id} [${violation.impact}] ${violation.nodes.length} node(s): ${violation.help}`
          )
          .join('; ')
      )
    })
  }

  console.log('\nUnknown route')

  await check('404 page renders with noindex', async () => {
    const response = await page.goto(`${baseUrl}/nothing-here`, { waitUntil: 'load' })
    assert(response?.status() === 404, `expected HTTP 404, got ${response?.status()}`)
    await page.locator('h1').waitFor({ state: 'visible' })
    const data = await page.evaluate(() => ({
      title: document.title,
      robots: document.querySelector('meta[name="robots"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href || null,
      heading: document.querySelector('h1')?.textContent.trim(),
      homeLink: [...document.querySelectorAll('a[href="/"]')].length,
    }))
    assert(data.title === NOT_FOUND_META.title, `unexpected 404 title: ${data.title}`)
    assert(data.robots === 'noindex, nofollow', '404 is not noindex')
    assert(data.canonical === null, '404 has a canonical link')
    assert(data.heading, '404 heading missing')
    assert(data.homeLink > 0, '404 has no link home')
  })

  console.log('\nKeyboard, clipboard and navigation')

  await check('404 recovery restores indexable metadata', async () => {
    await page.goto(`${baseUrl}/still-not-here`, { waitUntil: 'load' })
    await page.getByRole('link', { name: /Back to home/i }).click()
    await page.waitForURL(`${baseUrl}/`)
    await page.locator('h1').first().waitFor({ state: 'visible' })
    // The head manager updates the document head on client-side navigation.
    // Wait for it to settle rather than assuming it landed with the paint.
    await page.waitForFunction(
      (title) => document.title === title,
      PAGE_META['/'].title,
      { timeout: 5000 }
    )
    const meta = await page.evaluate(() => ({
      title: document.title,
      robots: document.querySelector('meta[name="robots"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
    }))
    assert(meta.title === PAGE_META['/'].title, 'title was not restored')
    assert(meta.robots === 'index, follow', 'robots was not restored')
    assert(meta.canonical === `${SITE_URL}/`, 'canonical was not restored')
  })

  await check('primary nav has no false active state on the home page', async () => {
    const active = await page.$$eval('.nav__links .nav__link.is-active', (nodes) =>
      nodes.map((node) => node.textContent.trim())
    )
    assert(active.length === 0, `active links: ${active.join(', ')}`)
  })

  await check('navbar shows live GitHub stars', async () => {
    await page.goto(`${baseUrl}/`, { waitUntil: 'load' })
    await page.evaluate(() => window.sessionStorage.clear())
    await page.reload({ waitUntil: 'load' })

    const link = page.locator('.nav__stars')
    await link.waitFor({ state: 'visible' })

    const href = await link.getAttribute('href')
    assert(
      href === 'https://github.com/heyshreee/argus-header',
      `star link pointed at ${href}`
    )
    const rel = await link.getAttribute('rel')
    assert((rel || '').includes('noopener'), 'star link is missing rel="noopener"')

    await page.waitForFunction(
      () => {
        const count = document.querySelector('.nav__stars-count')
        return count && /^\d[\d,.]*$/.test(count.textContent.trim())
      },
      { timeout: 15000 }
    )

    const live = await page.evaluate(() => ({
      value: document.querySelector('.nav__stars-count')?.textContent.trim(),
      status: document.querySelector('.nav__stars')?.getAttribute('data-status'),
    }))
    assert(live.status === 'ready', `star badge status was ${live.status}`)
    assert(Number(live.value.replace(/,/g, '')) >= 0, `unexpected star count ${live.value}`)
  })

  await check('section link scrolls to its target', async () => {
    await page.getByRole('link', { name: 'Features', exact: true }).first().click()
    await page.waitForURL('**/#features')
    await page.waitForFunction(
      () => {
        const target = document.getElementById('features')
        return target && target.getBoundingClientRect().top < 220
      },
      { timeout: 3000 }
    )
    const position = await page.evaluate(() => {
      const target = document.getElementById('features')
      return target ? target.getBoundingClientRect().top : null
    })
    assert(position !== null, 'features section is missing')
    assert(position >= 0 && position < 220, `features section is at ${position}px`)
  })

  await check('skip link moves focus to main', async () => {
    await page.goto(`${baseUrl}/`, { waitUntil: 'load' })
    await page.keyboard.press('Tab')
    const firstFocus = await page.evaluate(() => ({
      className: document.activeElement?.className,
      text: document.activeElement?.textContent?.trim(),
    }))
    assert(firstFocus.className === 'skip-link', `first Tab focus was ${firstFocus.className}`)
    await page.keyboard.press('Enter')
    const focused = await page.evaluate(() => ({
      id: document.activeElement?.id,
      hash: location.hash,
    }))
    assert(focused.id === 'main', `focus after skip link was #${focused.id}`)
    assert(focused.hash === '#main', `URL hash after skip link was ${focused.hash}`)
  })

  await check('home install command copy button', async () => {
    await page.goto(`${baseUrl}/`, { waitUntil: 'load' })
    const button = page.getByRole('button', { name: /^Copy install command:/ }).first()
    await button.click()
    const copied = await page.evaluate(() => navigator.clipboard.readText())
    assert(copied === 'pip install argus-header', `clipboard contained “${copied}”`)
    await page.waitForFunction(
      () =>
        [...document.querySelectorAll('[role="status"]')].some((node) =>
          node.textContent.includes('Copied to clipboard')
        ),
      { timeout: 2000 }
    )
  })

  await check('terminal command copy button', async () => {
    const button = page.getByRole('button', { name: /Copy command to clipboard/i }).first()
    await button.click()
    const copied = await page.evaluate(() => navigator.clipboard.readText())
    assert(
      copied === 'argus-header https://example.com --score',
      `clipboard contained “${copied}”`
    )
  })

  await check('documentation code block copy button', async () => {
    await page.goto(`${baseUrl}/docs/installation`, { waitUntil: 'load' })
    const button = page.getByRole('button', { name: 'Copy shell' }).first()
    await button.click()
    const copied = await page.evaluate(() => navigator.clipboard.readText())
    assert(copied === 'pip install argus-header', `clipboard contained “${copied}”`)
  })

  await check('internal anchors resolve', async () => {
    for (const [pathname, hashes] of internalLinks) {
      if (hashes.size === 0) continue
      await page.goto(`${baseUrl}${pathname}`, { waitUntil: 'load' })
      const missing = await page.evaluate(
        (ids) => ids.filter((id) => !document.getElementById(id)),
        [...hashes]
      )
      assert(missing.length === 0, `${pathname} is missing anchors: ${missing.join(', ')}`)
    }
  })

  await check('external links use known hosts', async () => {
    const allowed = new Set(['github.com', 'pypi.org'])
    for (const link of externalLinks) {
      const url = new URL(link)
      assert(allowed.has(url.hostname), `unexpected external host: ${url.hostname}`)
    }
    assert(externalLinks.size >= 8, `only ${externalLinks.size} external links found`)
  })

  console.log(`\nLinks discovered: ${internalLinks.size} internal paths, ${externalLinks.size} external URLs`)

  console.log('\nMobile layouts and navigation (390px)')

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
    isMobile: true,
    hasTouch: true,
  })
  const mobilePage = await mobile.newPage()
  const mobileErrors = []
  mobilePage.on('console', (message) => {
    if (message.type() === 'error') mobileErrors.push(excerpt(message.text(), 300))
  })
  mobilePage.on('pageerror', (error) => mobileErrors.push(`pageerror: ${error.message}`))

  for (const route of ROUTES) {
    await check(`${route} mobile overflow`, async () => {
      mobileErrors.length = 0
      const response = await mobilePage.goto(`${baseUrl}${route}`, { waitUntil: 'load' })
      assert(response?.status() === 200, `expected HTTP 200, got ${response?.status()}`)
      await mobilePage.locator('h1').first().waitFor({ state: 'visible' })
      const overflow = await mobilePage.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      )
      assert(overflow <= 1, `horizontal overflow of ${overflow}px`)
      assert(mobileErrors.length === 0, `console errors: ${mobileErrors.join(' | ')}`)
    })
  }

  await check('mobile menu focus trap and Escape', async () => {
    await mobilePage.goto(`${baseUrl}/docs`, { waitUntil: 'load' })
    const toggle = mobilePage.getByRole('button', { name: /Menu/i }).first()
    await toggle.click()
    await mobilePage.locator('.mobile-menu').waitFor({ state: 'visible' })

    const expanded = await toggle.getAttribute('aria-expanded')
    assert(expanded === 'true', 'aria-expanded was not true')
    const focusInside = await mobilePage.evaluate(
      () => Boolean(document.activeElement?.closest('.mobile-menu'))
    )
    assert(focusInside, 'focus did not move into the mobile menu')

    const focusables = mobilePage.locator(
      '.mobile-menu a[href], .mobile-menu button:not([disabled]), .mobile-menu [tabindex]:not([tabindex="-1"])'
    )
    await focusables.last().focus()
    await mobilePage.keyboard.press('Tab')
    const trapped = await mobilePage.evaluate(
      () => Boolean(document.activeElement?.closest('.mobile-menu'))
    )
    assert(trapped, 'Tab moved focus outside the mobile menu')

    await mobilePage.keyboard.press('Escape')
    await mobilePage.locator('.mobile-menu').waitFor({ state: 'detached' })
    const state = await mobilePage.evaluate(() => ({
      expanded: document.querySelector('.nav__toggle')?.getAttribute('aria-expanded'),
      toggleFocused: document.activeElement?.classList.contains('nav__toggle'),
      locked: document.body.hasAttribute('data-scroll-lock'),
    }))
    assert(state.expanded === 'false', 'menu did not close on Escape')
    assert(state.toggleFocused, 'focus did not return to the menu button')
    assert(!state.locked, 'body scroll lock was not removed')
  })

  await check('mobile menu link closes the menu', async () => {
    const toggle = mobilePage.getByRole('button', { name: /Menu/i }).first()
    await toggle.click()
    await mobilePage.locator('.mobile-menu').waitFor({ state: 'visible' })
    await mobilePage.locator('.mobile-menu').getByRole('link', { name: 'CLI Reference' }).click()
    await mobilePage.waitForURL('**/docs/cli-reference')
    await mobilePage.locator('.mobile-menu').waitFor({ state: 'detached' })
    assert(!mobilePage.url().includes('#'), 'unexpected hash after navigation')
  })

  await check('mobile docs disclosure', async () => {
    await mobilePage.goto(`${baseUrl}/docs/installation`, { waitUntil: 'load' })
    const details = mobilePage.locator('.docs-mobile-nav')
    assert(await details.isVisible(), 'mobile docs navigation is hidden')
    const initiallyOpen = await details.evaluate((node) => node.open)
    assert(!initiallyOpen, 'mobile docs disclosure starts open')
    await details.locator('summary').click()
    const nowOpen = await details.evaluate((node) => node.open)
    assert(nowOpen, 'mobile docs disclosure did not open')
  })

  console.log('\nNarrow viewport (320px)')

  const narrow = await browser.newContext({
    viewport: { width: 320, height: 800 },
    colorScheme: 'dark',
    isMobile: true,
    hasTouch: true,
  })
  const narrowPage = await narrow.newPage()
  for (const route of ROUTES) {
    await check(`${route} 320px overflow`, async () => {
      await narrowPage.goto(`${baseUrl}${route}`, { waitUntil: 'load' })
      await narrowPage.locator('h1').first().waitFor({ state: 'visible' })
      const overflow = await narrowPage.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      )
      assert(overflow <= 1, `horizontal overflow of ${overflow}px`)
    })
  }

  console.log('\nReduced motion')

  const reduced = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  })
  const reducedPage = await reduced.newPage()
  await check('animations and transitions are effectively disabled', async () => {
    await reducedPage.goto(`${baseUrl}/`, { waitUntil: 'load' })
    const styles = await reducedPage.evaluate(() => {
      const sweep = getComputedStyle(document.querySelector('.terminal__sweep'))
      const button = getComputedStyle(document.querySelector('.button'))
      return {
        animationDuration: sweep.animationDuration,
        animationIterationCount: sweep.animationIterationCount,
        transitionDuration: button.transitionDuration,
        scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      }
    })
    assert(
      parseFloat(styles.animationDuration) <= 0.001,
      `animation duration is ${styles.animationDuration}`
    )
    assert(styles.animationIterationCount === '1', 'animation still repeats')
    assert(
      parseFloat(styles.transitionDuration) <= 0.001,
      `transition duration is ${styles.transitionDuration}`
    )
    assert(styles.scrollBehavior === 'auto', `scroll behavior is ${styles.scrollBehavior}`)
  })

  console.log('\nSEO and static assets')

  await check('sitemap contains every page and nothing else', async () => {
    const response = await fetch(`${baseUrl}/sitemap.xml`)
    assert(response.status === 200, `sitemap returned ${response.status}`)
    const xml = await response.text()
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
    const expected = ROUTES.map((route) => `${SITE_URL}${route === '/' ? '/' : route}`)
    assert(locations.length === expected.length, `sitemap has ${locations.length} URLs`)
    for (const url of expected) assert(locations.includes(url), `sitemap is missing ${url}`)
    assert(!xml.includes('/404'), 'sitemap includes the 404 page')
  })

  await check('robots.txt points at the sitemap', async () => {
    const response = await fetch(`${baseUrl}/robots.txt`)
    assert(response.status === 200, `robots.txt returned ${response.status}`)
    const text = await response.text()
    assert(text.includes(`Sitemap: ${SITE_URL}/sitemap.xml`), 'sitemap directive missing')
    assert(text.includes('Allow: /'), 'crawling is not allowed')
  })

  await check('web manifest is valid', async () => {
    const response = await fetch(`${baseUrl}/site.webmanifest`)
    assert(response.status === 200, `manifest returned ${response.status}`)
    const manifest = await response.json()
    assert(manifest.name === 'Argus Header', 'manifest name mismatch')
    assert(manifest.start_url === '/', 'manifest start_url mismatch')
    assert(Array.isArray(manifest.icons) && manifest.icons.length >= 2, 'manifest icons missing')
  })

  for (const asset of ['/favicon.svg', '/apple-touch-icon.png', '/icon-512.png', '/og-image.png']) {
    await check(`${asset} is served`, async () => {
      const response = await fetch(`${baseUrl}${asset}`)
      assert(response.status === 200, `returned ${response.status}`)
      const type = response.headers.get('content-type') || ''
      assert(
        type.includes('image/'),
        `unexpected content type: ${type}`
      )
    })
  }

  await check('Open Graph image is 1200×630', async () => {
    const dimensions = await page.evaluate(
      () =>
        new Promise((resolve, reject) => {
          const image = new Image()
          image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
          image.onerror = () => reject(new Error('image failed to load'))
          image.src = '/og-image.png'
        })
    )
    assert(dimensions.width === 1200, `width is ${dimensions.width}`)
    assert(dimensions.height === 630, `height is ${dimensions.height}`)
  })

  await check('document language and viewport are set', async () => {
    const data = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      viewport: document.querySelector('meta[name="viewport"]')?.content,
      theme: document.querySelector('meta[name="theme-color"]')?.content,
      manifest: document.querySelector('link[rel="manifest"]')?.getAttribute('href'),
    }))
    assert(data.lang === 'en', `lang is “${data.lang}”`)
    assert(data.viewport?.includes('width=device-width'), 'viewport meta is missing')
    assert(data.theme === '#000000', 'theme-color mismatch')
    assert(data.manifest === '/site.webmanifest', 'manifest link missing')
  })

  await browser.close()
}

async function externalLinkChecks() {
  console.log('\nExternal destinations')
  const urls = [
    'https://github.com/heyshreee/argus-header',
    'https://pypi.org/project/argus-header/',
    'https://github.com/heyshreee/argus-header/releases',
    'https://github.com/heyshreee/argus-header/issues',
    'https://github.com/heyshreee/argus-header/blob/main/LICENSE',
    'https://github.com/heyshreee/argus-header/security/policy',
  ]

  for (const url of urls) {
    await check(`${url} responds`, async () => {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'User-Agent': 'argus-header-site-qa/1.0' },
        signal: AbortSignal.timeout(20000),
      })
      assert(
        response.status >= 200 && response.status < 400,
        `returned HTTP ${response.status}`
      )
    })
  }
}

const instance = await startServer()
console.log(`Argus Header production QA\nServer: ${instance.url}`)

try {
  await rawShellChecks(instance.url)
  await browserChecks(instance.url)
  await externalLinkChecks()
} finally {
  await instance.close()
}

console.log(`\n${passed} checks passed, ${failures.length} failed`)
if (failures.length) {
  console.log('\nFailures:')
  for (const failure of failures) {
    console.log(`- ${failure.name}: ${failure.message}`)
  }
  process.exitCode = 1
}
