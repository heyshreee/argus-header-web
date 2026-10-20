# Contributing

Thanks for helping improve the Argus Header website.

This repository contains only the website. The scanner itself lives in [`heyshreee/argus-header`](https://github.com/heyshreee/argus-header). If you want to change how headers are analyzed, add a rule family or fix a scanner bug, open your pull request against that repository instead.

## Reporting a problem

Open an issue at <https://github.com/heyshreee/argus-header-web/issues>. For a factual error in the documentation, please say which upstream file the correct information comes from — that makes the fix fast.

Do not report scanner vulnerabilities here. Report them in the upstream repository's [security advisories](https://github.com/heyshreee/argus-header/security/advisories/new).

## Local setup

Requires Node.js `^20.19.0` or `>=22.12.0`.

```bash
git clone https://github.com/heyshreee/argus-header-web.git
cd argus-header-web
npm install
npm run dev
```

## Before you open a pull request

```bash
npm run build
npm run qa
```

`npm run qa` builds nothing, so run `npm run build` first. It starts a local static server on `dist/` and runs the full Playwright + axe suite. A green run is required — the same command runs in CI.

If you change the set of routes, also update:

- `src/data/seo.js` — per-route title, description and path
- `scripts/prerender.mjs` — the generated shell for that route
- `src/components/Navbar.jsx` and `src/components/Footer.jsx` — navigation links

## Rules for changing product facts

The site documents the **published** Argus Header CLI. Most of the review burden here is factual accuracy, so:

1. **Cite the source.** Every CLI flag, default, config key, rule ID, score weight or report field must be traceable to a specific file in the upstream repository — usually `src/argus_header/`.
2. **Version the content.** The site describes one published version at a time. When upstream publishes a new release, update `src/data/site.js`, `src/data/changelog.js`, `src/data/cli.js` and `src/data/checks.js` together, and state in the pull request which upstream version the change describes.
3. **Do not present roadmap items as features.** If something is planned but unreleased, label it as planned. See `src/data/changelog.js` for how that is handled.
4. **Do not invent metrics.** No download counts, benchmarks, integrations or certifications unless they are verifiable from an upstream source. The GitHub star count is the one live number, and it is fetched from the GitHub API at runtime — never hardcoded.
5. **Describe limits honestly.** Where a check cannot prove what it appears to prove, say so. The `limitations` field on each rule family in `src/data/checks.js` exists for exactly this.

## Style

- Two-space indentation, no semicolons, single quotes — matching the existing files. There is no formatter configured, so match the surrounding code.
- Plain JavaScript and JSX. No TypeScript, no CSS framework, no UI kit.
- Accessibility is not optional. The QA suite runs axe-core against every route at WCAG 2.1 A/AA. If you add an interactive element, keyboard focus and `prefers-reduced-motion` must work.

## Commit messages

Use a short imperative subject with a conventional prefix:

```text
feat: add a CLI reference section for --config
fix: correct the HSTS max-age threshold in the rule catalogue
docs: align the changelog with the upstream release notes
```

## Pull requests

1. Fork the repository and create a branch from `main`.
2. Make your change, with the QA suite passing locally.
3. Open a pull request describing what changed and why.

Small typo fixes are always welcome. Larger content changes benefit from a note about which upstream version they were written against.
