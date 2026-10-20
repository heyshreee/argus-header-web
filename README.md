# Argus Header — website

Source for the product website of [Argus Header](https://github.com/heyshreee/argus-header), an open-source Python CLI that performs passive HTTP response-header analysis.

[![Vercel](https://img.shields.io/badge/deployed-vercel-000000?style=flat-square&logo=vercel)](https://argus-header.vercel.app)
[![React](https://img.shields.io/badge/react-18.3-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/vite-8.3-646cff?style=flat-square&logo=vite)](https://vite.dev)
[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)

This repository contains **only the website**. The scanner, its analyzers, report renderers and the FastAPI service live in the upstream [`heyshreee/argus-header`](https://github.com/heyshreee/argus-header) repository.

---

## What this site is

A statically prerendered React single-page application that documents the Argus Header CLI: installation, a quick start, the full CLI reference, every rule family and rule ID, report formats, CI gating and the release history.

Design goals that shape the codebase:

- **Accurate.** Every CLI flag, default, rule ID, score weight and report field on the site is transcribed from the upstream `0.8.0` source, not paraphrased from marketing copy.
- **Honest about limitations.** Where a flag does less than its name implies, or a check cannot prove what it appears to prove, the site says so explicitly.
- **Static.** No server, no database, no API keys, no secrets. The build output is a folder of HTML files that any static host can serve.
- **Accessible.** Semantic landmarks, one `h1` per page, visible focus, a working skip link and `prefers-reduced-motion` support, all verified by axe-core in CI.

---

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 18.3 + React Router DOM 7.18 |
| Build | Vite 8.3 + `@vitejs/plugin-react` 6.1 |
| Prerendering | Custom Node script (`scripts/prerender.mjs`) |
| QA | Playwright 1.64 + `@axe-core/playwright` 4.14 |
| Hosting | Vercel (static, `vercel.json` in the repo root) |

No CSS framework and no UI kit. The design system is a small set of CSS custom properties in `src/styles/tokens.css`, extended by `base.css`, `chrome.css`, `docs.css`, `home.css`, `pages.css` and `terminal.css`.

---

## Requirements

- Node.js `^20.19.0` or `>=22.12.0` (the version range Vite 8 requires)
- npm 10+

## Getting started

```bash
git clone https://github.com/heyshreee/argus-header-web.git
cd argus-header-web
npm install
npm run dev
```

Vite serves the app at <http://localhost:5173>.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reloading. |
| `npm run build` | Build the client bundle, then prerender every route. |
| `npm run preview` | Vite's own preview server (SPA fallback for all paths). |
| `npm run preview:prod` | Serve `dist/` the way Vercel will, with clean URLs and real 404s. |
| `npm run qa` | Run the production QA suite against `dist/`. |

---

## How the build works

`npm run build` runs two steps.

**1. `vite build`** compiles the React application into `dist/`, emitting a hashed JS bundle, a hashed CSS bundle and a single `dist/index.html`.

**2. `node scripts/prerender.mjs`** clones that shell into a directory per documented route and rewrites the route-specific metadata, so a direct load, a refresh, a crawler or a link preview receives the correct title, description, canonical URL and Open Graph tags *before* any JavaScript executes. It also writes `dist/404.html`, `dist/sitemap.xml` and `dist/robots.txt`.

Routes generated:

```text
/
/docs
/docs/installation
/docs/quickstart
/docs/cli-reference
/docs/security-checks
/docs/examples
/changelog
/contributing
/about
404
```

The app is still client-rendered after the shell loads. The prerendered files are metadata-correct entry points, not server-rendered page bodies.

### Previewing the real output

`vite preview` falls back to the SPA shell for every path, so it cannot exercise the per-route files. To preview the build the way Vercel serves it:

```bash
npm run build
npm run preview:prod
```

Then open <http://localhost:4173>. The helper server in `scripts/serve-dist.mjs` implements clean URLs, trailing-slash redirects and a genuine 404 response.

---

## Quality assurance

```bash
npx playwright install chromium
npm run build
npm run qa
```

`npm run qa` builds nothing — run `npm run build` first. The suite serves `dist/` and checks:

- raw metadata in every prerendered HTML shell
- rendered titles, descriptions, canonical URLs and robots directives
- one `h1` per page, landmarks, duplicate IDs and image loading
- every internal link and in-page anchor
- external link hosts and `rel="noopener noreferrer"`
- copy buttons and the clipboard result
- the live GitHub star badge in the navigation
- skip-link focus, mobile menu focus trap, `Escape` behaviour and scroll lock
- horizontal overflow at 1440 px, 390 px and 320 px
- `prefers-reduced-motion` behaviour
- WCAG 2.1 A/AA rules through axe-core
- sitemap, robots.txt, web manifest, favicon and Open Graph image
- availability of the main external destinations

---

## Deploying to Vercel

1. Import the repository in Vercel.
2. Use the **Vite** framework preset. The default build command is `npm run build` and the output directory is `dist`.
3. Set `VITE_SITE_URL` to the production origin if it is not `https://argus-header.vercel.app` (for example `https://argus.example.com`). It is read at build time by both the client bundle and the prerender script.
4. Deploy.

`vercel.json` enables clean URLs, disables trailing slashes, adds baseline security headers and gives hashed assets a one-year immutable cache. Vercel serves `dist/404.html` for unmatched paths with a 404 status, so no catch-all rewrite is required.

> Every valid route has its own `index.html`. Do not add an SPA catch-all rewrite, or unknown paths will return the homepage with a 200 instead of the 404 page.

---

## Project structure

```text
index.html                 Vite shell and default metadata
vercel.json                clean URLs, security headers, asset caching
vite.config.js             build configuration
scripts/
  prerender.mjs            per-route HTML metadata, sitemap, robots
  serve-dist.mjs           production-like local static server
  qa.mjs                   Playwright + axe production QA
src/
  main.jsx                 application entry
  App.jsx                  route map
  pages/                   one component per route
  components/              navigation, docs shell, terminal, report, copy UI
  data/
    site.js                product facts and external links
    seo.js                 per-route metadata shared by client and build
    cli.js                 verified CLI options and examples
    checks.js              rule catalogue, severity and remediation
    reports.js             real v0.8.0 sample scan output
    changelog.js           published release history and unreleased roadmap
  lib/
    useGitHubStars.js       live GitHub star count (REST API, cached per session)
    usePageMeta.js         client-side document head manager
  styles/                  design tokens and per-area stylesheets
public/                    favicon, app icons, OG image, manifest, robots.txt
```

---

## Content accuracy

The site is documentation for a specific published version. These are the facts it is built on:

- **Current stable release:** `v0.8.0`, published to GitHub and PyPI on 20 September 2026. The upstream `CHANGELOG.md` dates the same entry 3 September 2026; the site shows both dates rather than silently picking one.
- **Upstream source version:** `0.8.0` on **both** the `main` and `development` branches (`pyproject.toml` and `src/argus_header/__init__.py`). No branch declares a `0.9.0-dev` version string.
- **`0.9.0` is a roadmap item only.** It appears in the upstream README, `docs/MVP.md` and `docs/DOCUMENTATION.md` as the next planned release (TLS inspection, certificate analysis, HTTP/2 detection, advanced CORS analysis). There is no `v0.9.0` tag, GitHub release or PyPI publication, so the site presents it as planned, never as available.
- **Sample report:** a real scan of `example.com` with the published `v0.8.0` package, captured on 20 October 2026. Header values change over time, so the site presents it as a captured sample, not a live result.
- **Documented CLI quirks.** The reference describes observed `v0.8.0` behaviour rather than the idealised flag names:
  - `--score` is accepted, but the score panel is printed on every scan regardless.
  - `--verbose` is parsed but never invoked by the `v0.8.0` deep-scan pipeline.
  - `--json` and `--sarif` without a filename write to stdout *alongside* the banner and human-readable summary.
  - Multi-URL runs render every target to the same output filename, so the last target wins.
  - A configuration file activates CI gating, because the policy defaults are `fail_on: high` and `minimum_score: 80`.
  - A configuration file also **overrides** `--method`, `--timeout` and `--no-redirect`. The upstream docstrings say the opposite, but the `v0.8.0` scan pipeline replaces the command-line values with the config values. Without a config file, those flags work normally.
  - The score depends on the enabled rule set; a high score means the enabled checks found little.
- **Rule catalogue:** all 48 emittable `ARGUS-*` rule IDs are documented, with the severity each analyzer assigns. The catalogue was diffed against the upstream analyzers — no rule is missing and no rule is invented.
- **Score categories:** `Content`, `Transport`, `Browser`, `Isolation` and `Cookies`. The two information-leakage rules land in different categories (`ARGUS-SERVER-001` under Content, `ARGUS-SERVER-002` under Browser) because the `0.8.0` classifier matches on substrings of the finding title.
- **Configuration files** are looked up in this order: `.argus.yml`, `.argus.yaml`, `.argus.json`.
- **Links:** only the GitHub repository, PyPI package, releases, issues, license and security policy are linked externally.
- **No invented metrics or badges.** The site does not claim download counts, performance benchmarks, integrations or certifications. The one number it shows — the GitHub star count in the navigation — is fetched live from the GitHub API and never hardcoded.

---

## Live repository data

The navigation shows the live star count for `heyshreee/argus-header`.

- `src/lib/useGitHubStars.js` calls `https://api.github.com/repos/heyshreee/argus-header` and reads `stargazers_count`. No token is used, so the unauthenticated rate limit (60 requests per hour per IP) applies.
- The count is fetched on the first visit, cached in `sessionStorage` for a minute so page-to-page navigation does not spend requests, then revalidated every 5 minutes while the tab is visible. Hidden tabs stop polling; returning to the tab refreshes a stale value.
- If GitHub is unreachable or rate limited, the badge keeps the last cached value and degrades to a placeholder rather than showing a wrong number. The link to the repository always works.
- `npm run qa` includes a check that clears the session cache, waits for a live response and asserts that the badge renders a numeric count from the API.

---

## Responsible use

Argus Header is intended for defensive security, authorized auditing and education. Only assess systems you own or have explicit permission to test. A public endpoint is not implicit permission, and a tool's ability to send a request is not authorization to send it. Header analysis cannot prove that an application is secure.

The same disclaimer appears in the site footer and in the documentation.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to set up the project, run the QA suite and open a pull request. Changes to product facts must cite the upstream source they came from.

---

## License

The website source is provided under the same MIT terms as the Argus Header project. See [LICENSE](LICENSE).
