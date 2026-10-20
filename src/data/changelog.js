/*
 * Release history verified from:
 * - GitHub releases (published timestamps)
 * - PyPI upload timestamps
 * - CHANGELOG.md at tag v0.8.0
 * - README roadmap and repository tags
 *
 * The 0.8.0 CHANGELOG entry is dated 2026-09-03 in the repository; the
 * GitHub release and PyPI upload happened on 2026-09-20. Both dates are shown
 * rather than silently choosing one.
 */

export const RELEASES = [
  {
    version: '0.8.0',
    status: 'Latest stable',
    published: '20 September 2026',
    changelogDate: '3 September 2026',
    pypi: true,
    tagUrl: 'https://github.com/heyshreee/argus-header/releases/tag/v0.8.0',
    pypiUrl: 'https://pypi.org/project/argus-header/0.8.0/',
    summary:
      'The deep-analysis release: a new rules engine, weighted Score 2.0, SARIF and HTML reports, CI gates, YAML configuration and report diffing.',
    added: [
      'Deep security rules engine with nine rule families: CSP, CORS, cookies, HSTS, Cache-Control, cross-origin policies, Referrer-Policy, Permissions-Policy and base headers.',
      'Security Score Engine 2.0 with five weighted categories and grades from A+ to F.',
      'YAML configuration via --config (plus .argus.yml auto-discovery).',
      'SARIF 2.1.0 report export.',
      'Cyberpunk-style self-contained HTML report export via --report.',
      'Report comparison with argus-header diff before.json after.json.',
      'CI/CD gating via --fail-on and --min-score.',
      'JSON and SARIF output to stdout when no filename is supplied.',
      'PyYAML runtime dependency.',
    ],
    changed: [
      'CLI rewritten around the v0.8 scan pipeline.',
      'Analyzer layer rewritten as modular per-header analyzers.',
      'JSON, SARIF, HTML and terminal renderers rewritten.',
      'New engine/, analyzers/, output/, diff/ and models/ package structure.',
      'Severity model extended with CRITICAL, although the built-in v0.8 analyzers emit HIGH/MEDIUM/LOW.',
      'Test coverage expanded across analyzers, engine, reports and diff.',
    ],
    fixed: [],
    security: [],
    note:
      'The repository CHANGELOG dates this release 3 September 2026; the GitHub release and PyPI publication are dated 20 September 2026.',
  },
  {
    version: '0.7.0',
    status: 'Published',
    published: '21 August 2026',
    changelogDate: '22 August 2026',
    pypi: true,
    tagUrl: 'https://github.com/heyshreee/argus-header/releases/tag/v0.7.0',
    pypiUrl: 'https://pypi.org/project/argus-header/0.7.0/',
    summary:
      'Scoring and reporting: a 0–100 security score, A–F grade, cookie analysis, stable rule IDs and new export formats.',
    added: [
      'Security score from 0 to 100.',
      'Security grade from A to F.',
      'Cookie security analysis for Secure, HttpOnly and SameSite.',
      'Stable rule IDs on findings.',
      'Enhanced JSON security reports.',
      'Markdown report export.',
      'HTML report export.',
      'CLI --score, --markdown and --html options.',
      'API exposure of score, grade, risk level and finding summaries.',
      'Dashboard display for score and finding summaries.',
    ],
    changed: [
      'JSON reports contain structured scan metadata.',
      'JSON reports use ISO timestamps instead of a "Now" placeholder.',
      'Findings include stable rule identifiers.',
    ],
    fixed: [],
    security: [
      'HTML report output escapes untrusted response data before rendering.',
    ],
    note:
      'The CHANGELOG entry is dated 22 August 2026; the GitHub release was published on 21 August 2026.',
  },
  {
    version: '0.6.0',
    status: 'Published',
    published: '2 August 2026',
    changelogDate: '2 August 2026',
    pypi: true,
    tagUrl: 'https://github.com/heyshreee/argus-header/releases/tag/v0.6.0',
    pypiUrl: 'https://pypi.org/project/argus-header/0.6.0/',
    summary:
      'Verbose reporting mode with a 15-section detailed scan report and cleaner terminal organisation.',
    added: [
      'Comprehensive --verbose reporting mode.',
      'Scan, target, request and connection information sections.',
      'HTTP response, redirect and header sections.',
      'Security header presence, missing and present sections.',
      'Information leakage and response statistics sections.',
      'Findings summary and overall assessment sections.',
      'End-of-scan summary.',
    ],
    changed: [
      'Better terminal output organisation.',
      'Improved scan readability.',
      'Enhanced security header reporting.',
    ],
    fixed: [],
    security: [],
    note:
      'The legacy verbose renderer still exists in the package, but the v0.8.0 deep pipeline does not call it. Do not assume --verbose produces this report on 0.8.0.',
  },
  {
    version: '0.5.1',
    status: 'Published',
    published: '29 July 2026',
    changelogDate: null,
    pypi: true,
    tagUrl: 'https://github.com/heyshreee/argus-header/releases/tag/v0.5.1',
    pypiUrl: 'https://pypi.org/project/argus-header/0.5.1/',
    summary:
      'A small maintenance release shortly after the first public beta.',
    added: [
      'A __main__ entry point so the package can be launched with python -m argus_header.',
    ],
    changed: [
      'Removed an unnecessary pip package from requirements.txt.',
      'Updated the README for the release.',
    ],
    fixed: [],
    security: [],
    note:
      'The GitHub release body contains no release notes. The changes above are taken from the commits between v0.5.0 and v0.5.1.',
  },
  {
    version: '0.5.0',
    status: 'First public beta',
    published: '29 July 2026',
    changelogDate: null,
    pypi: true,
    tagUrl: 'https://github.com/heyshreee/argus-header/releases/tag/v0.5.0',
    pypiUrl: 'https://pypi.org/project/argus-header/0.5.0/',
    summary:
      'The first public beta: a focused HTTP security header analyzer with Rich terminal output and JSON export.',
    added: [
      'HTTP GET and HEAD request support.',
      'Configurable request timeout.',
      'Redirect handling.',
      'Retry mechanism.',
      'Parallel scanning.',
      'Rich terminal output.',
      'JSON report export.',
      'Security header detection.',
      'Information leakage detection.',
      'CORS wildcard analysis.',
      'Cache-Control analysis.',
      'PyPI-ready packaging.',
    ],
    changed: [
      'Modern CLI interface.',
      'Better error handling.',
      'Improved project structure.',
      'Enhanced documentation.',
    ],
    fixed: [],
    security: [],
    note: '',
  },
]

export const UNRELEASED = {
  version: '0.9.0',
  status: 'Planned',
  source:
    'The next planned release, listed in the upstream README roadmap, docs/MVP.md and docs/DOCUMENTATION.md. No branch of the upstream repository declares a 0.9.0 version string, and there is no v0.9.0 tag, GitHub release or PyPI publication.',
  planned: [
    'TLS inspection.',
    'Certificate analysis.',
    'HTTP/2 detection.',
    'Advanced CORS analysis.',
  ],
  note:
    'These items are listed in the upstream README roadmap. They are not implemented claims on this website and should not be treated as available in 0.8.0.',
}
