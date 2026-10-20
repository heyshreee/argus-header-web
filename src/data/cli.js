/*
 * CLI facts verified against:
 * - `argus-header --help` from the published 0.8.0 wheel
 * - src/argus_header/cli.py, scanner.py, requester.py, models/configuration.py
 *
 * Anything labelled "current behavior" is a deliberate observation about the
 * v0.8.0 implementation, not a roadmap promise.
 */

export const USAGE = `argus-header [-h] [-v] [--method {GET,HEAD}] [--no-redirect]
             [--timeout TIMEOUT] [--config FILE] [--score]
             [--json [FILE]] [--sarif [FILE]] [--report FILE]
             [--markdown FILE] [--html FILE] [--parallel] [--verbose]
             [--fail-on {critical,high,medium,low,none}]
             [--min-score MIN_SCORE]
             url [url ...]

argus-header diff before.json after.json`

export const CLI_OPTIONS = [
  {
    flag: 'url ...',
    argument: 'one or more URLs',
    description:
      'Targets to analyze. URLs without a scheme are normalized to https://. Multiple URLs run sequentially unless --parallel is set.',
    defaultValue: 'required',
    notes: 'At least one target is required for a scan.',
  },
  {
    flag: '-h, --help',
    argument: '—',
    description: 'Show help and exit.',
    defaultValue: '—',
    notes: 'Argparse also prints usage examples in the epilog.',
  },
  {
    flag: '-v, --version',
    argument: '—',
    description: 'Print the installed package version and exit.',
    defaultValue: '—',
    notes: 'Output format: "Argus Header 0.8.0". Note that -v is version, not verbose.',
  },
  {
    flag: '--method',
    argument: 'GET | HEAD',
    description: 'HTTP request method used for the probe.',
    defaultValue: 'GET',
    notes:
      'A config file can set target.method. Note that in 0.8.0 a loaded config overrides this flag, not the other way round.',
  },
  {
    flag: '--no-redirect',
    argument: '—',
    description: 'Do not follow HTTP redirects; inspect the redirect response itself.',
    defaultValue: 'redirects followed',
    notes:
      'A config file can set target.redirects. Note that in 0.8.0 a loaded config overrides this flag, not the other way round.',
  },
  {
    flag: '--timeout',
    argument: 'integer seconds',
    description: 'Per-request timeout.',
    defaultValue: '10',
    notes:
      'A config file can set target.timeout. Note that in 0.8.0 a loaded config overrides this flag, not the other way round.',
  },
  {
    flag: '--config',
    argument: 'FILE',
    description: 'Load a .argus.yml, .argus.yaml or .argus.json configuration file.',
    defaultValue: 'auto-discover',
    notes:
      'Without --config, the current directory is checked for those three names. When a config file is present, its policy values also participate in CI gating.',
  },
  {
    flag: '--score',
    argument: '—',
    description:
      'Accepted for compatibility. The v0.8.0 scan presentation prints the score breakdown on every scan.',
    defaultValue: 'off',
    notes: 'In v0.8.0 this flag does not change the terminal output.',
  },
  {
    flag: '--json',
    argument: '[FILE]',
    description:
      'Write the canonical v0.8 JSON report. With no FILE, it prints JSON to stdout.',
    defaultValue: 'off',
    notes:
      'The banner and human-readable summary also go to stdout. For pipelines, prefer --json report.json and read the file.',
  },
  {
    flag: '--sarif',
    argument: '[FILE]',
    description:
      'Write a SARIF 2.1.0 document for code-scanning integrations. With no FILE, it prints to stdout.',
    defaultValue: 'off',
    notes:
      'The same stdout caveat as --json applies: the CLI banner and summary are not suppressed.',
  },
  {
    flag: '--report',
    argument: 'FILE',
    description: 'Write the self-contained cyberpunk-style HTML security report.',
    defaultValue: 'off',
    notes: 'Requires a filename; there is no stdout mode for this renderer.',
  },
  {
    flag: '--markdown',
    argument: 'FILE',
    description: 'Write a Markdown security report.',
    defaultValue: 'off',
    notes: 'Requires a filename.',
  },
  {
    flag: '--html',
    argument: 'FILE',
    description: 'Write the legacy self-contained HTML report.',
    defaultValue: 'off',
    notes: 'Requires a filename. The --report renderer is the newer HTML style.',
  },
  {
    flag: '--parallel',
    argument: '—',
    description:
      'Scan multiple targets concurrently using a ThreadPoolExecutor with at most five workers.',
    defaultValue: 'off',
    notes: 'Only takes effect when more than one URL is supplied.',
  },
  {
    flag: '--verbose',
    argument: '—',
    description:
      'Accepted by the parser. The v0.8.0 deep-scan pipeline does not add a verbose report.',
    defaultValue: 'off',
    notes:
      'The legacy verbose renderer exists in the package, but v0.8.0 does not call it from the deep pipeline. Do not build automation around this flag.',
  },
  {
    flag: '--fail-on',
    argument: 'critical | high | medium | low | none',
    description:
      'CI mode: exit 1 when a finding at the selected severity or worse exists.',
    defaultValue: 'none',
    notes:
      'A config file policy can set the default. Built-in v0.8.0 checks emit HIGH/MEDIUM/LOW only, so --fail-on critical does not trigger on a normal scan.',
  },
  {
    flag: '--min-score',
    argument: 'integer 0–100',
    description: 'CI mode: exit 1 when the aggregate security score is below this value.',
    defaultValue: '80 when CI mode is active',
    notes:
      'The parser leaves this option unset. When --fail-on or a config policy activates CI mode, the fallback threshold is 80; a loaded config policy also defaults to 80.',
  },
  {
    flag: 'diff <before.json> <after.json>',
    argument: 'two JSON reports',
    description:
      'Compare two previously saved v0.8 JSON reports and print score, fixed and new findings, and posture.',
    defaultValue: '—',
    notes: 'Must be the first argument. Both files are loaded as JSON reports.',
  },
]

export const CURRENT_BEHAVIOR_NOTES = [
  {
    title: 'The score is always printed',
    body:
      '--score is accepted, but the v0.8.0 terminal presentation calls the score renderer unconditionally. It does not add or hide anything.',
  },
  {
    title: '--verbose is a parser-only flag in v0.8.0',
    body:
      'The deep-scan CLI accepts --verbose but does not invoke the legacy 15-section verbose renderer. The website does not present a verbose transcript as working output.',
  },
  {
    title: 'stdout JSON is mixed with human output',
    body:
      'When --json or --sarif is used without a filename, the CLI banner, scan summary and score panel are written to stdout as well. Automation should write a file and read that file.',
  },
  {
    title: 'Multi-URL file exports overwrite each other',
    body:
      'Each report is rendered in sequence, and every target receives the same output filename. The last target wins. Run separate commands or separate output names for per-target files.',
  },
  {
    title: 'A config file activates policy defaults',
    body:
      'Configuration policy defaults are fail_on=high and minimum_score=80. A config file with no policy block therefore still enables CI gating in v0.8.0.',
  },
  {
    title: 'A config file overrides request flags in v0.8.0',
    body:
      'The upstream docstrings say CLI flags take precedence over a config file, but the 0.8.0 scan pipeline does the opposite: when a config file is loaded, its target.method, target.timeout and target.redirects values replace the ones resolved from the command line. With no config file present, the CLI flags work normally.',
  },
  {
    title: 'The score is rule-set dependent',
    body:
      'Disabling rule families in .argus.yml changes the score. A high score means the enabled checks found little, not that an application is secure.',
  },
]

export const CLI_EXAMPLES = [
  {
    id: 'basic',
    label: 'Basic scan',
    command: 'argus-header https://example.com',
    description:
      'Make one GET request, run all enabled rule families, print the scan summary, findings and Score 2.0 breakdown.',
    docs: '/docs/quickstart',
    output: {
      kind: 'terminal',
      title: 'argus-header — sample session',
      lines: [
        { tone: 'prompt', text: '$ argus-header https://example.com' },
        { tone: 'blank', text: '' },
        { tone: 'heading', text: 'ARGUS-HEADER v0.8.0' },
        { tone: 'muted', text: 'DEEP SECURITY ANALYSIS' },
        { tone: 'blank', text: '' },
        { tone: 'heading', text: '╭─ Scan Summary ─────────────────────────╮' },
        { tone: 'text', text: '│ Target:  https://example.com          │' },
        { tone: 'text', text: '│ Status:  200        Headers found: 12 │' },
        { tone: 'heading', text: '╰────────────────────────────────────────╯' },
        { tone: 'blank', text: '' },
        { tone: 'high', text: 'HIGH     ARGUS-CSP-001   Missing Content Security Policy' },
        { tone: 'high', text: 'HIGH     ARGUS-HSTS-001  Missing Strict-Transport-Security header' },
        { tone: 'medium', text: 'MEDIUM   ARGUS-XFO-001   Missing X-Frame-Options' },
        { tone: 'medium', text: 'MEDIUM   ARGUS-XCTO-001  Missing X-Content-Type-Options' },
        { tone: 'low', text: 'LOW      ARGUS-CACHE-001 Missing Cache-Control header' },
        { tone: 'muted', text: '… 6 more findings' },
        { tone: 'blank', text: '' },
        { tone: 'heading', text: 'Overall 71/100 [C]   Grade C   Risk HIGH' },
        { tone: 'muted', text: 'Condensed from a real 0.8.0 scan. The CLI renders one panel per finding.' },
      ],
    },
  },
  {
    id: 'score',
    label: 'Score breakdown',
    command: 'argus-header https://example.com --score',
    description:
      'Show the weighted category breakdown. In v0.8.0 the score panel is printed on every scan, so --score is accepted but does not alter the result.',
    docs: '/docs/security-checks#scoring',
    output: {
      kind: 'terminal',
      title: 'ARGUS SECURITY SCORE',
      lines: [
        { tone: 'prompt', text: '$ argus-header https://example.com --score' },
        { tone: 'blank', text: '' },
        { tone: 'heading', text: '╭─ ARGUS SECURITY SCORE ─────────────────╮' },
        { tone: 'text', text: '│ Overall        71/100   [C]            │' },
        { tone: 'blank', text: '│                                        │' },
        { tone: 'text', text: '│ Content       16/25    Transport  13/20│' },
        { tone: 'text', text: '│ Browser       15/25    Isolation  12/15│' },
        { tone: 'text', text: '│ Cookies       15/15                    │' },
        { tone: 'blank', text: '│                                        │' },
        { tone: 'text', text: '│ Critical 0   High 2   Medium 2   Low 7 │' },
        { tone: 'text', text: '│ Grade: C                 Risk: HIGH    │' },
        { tone: 'heading', text: '╰────────────────────────────────────────╯' },
      ],
    },
  },
  {
    id: 'head',
    label: 'HEAD request',
    command: 'argus-header https://example.com --method HEAD',
    description:
      'Probe with HEAD instead of GET. The same analyzers run against whatever headers the server returns for that method.',
    docs: '/docs/cli-reference#options',
    output: {
      kind: 'terminal',
      title: 'argus-header — HEAD',
      lines: [
        { tone: 'prompt', text: '$ argus-header https://example.com --method HEAD' },
        { tone: 'blank', text: '' },
        { tone: 'text', text: 'The request method changes the HTTP exchange.' },
        { tone: 'text', text: 'The analysis engine and report schema do not change.' },
        { tone: 'muted', text: 'Some servers return different headers for HEAD; scan both when it matters.' },
      ],
    },
  },
  {
    id: 'json',
    label: 'JSON report',
    command: 'argus-header https://example.com --json report.json',
    description:
      'Write the canonical schema-version 0.8 report with scan metadata, response headers, findings, score categories and summary counts.',
    docs: '/docs/cli-reference#reports',
    output: {
      kind: 'code',
      language: 'json',
      filename: 'report.json (excerpt)',
      code: `{
  "schema_version": "0.8",
  "tool": { "name": "Argus Header", "version": "0.8.0" },
  "scan": {
    "target": "https://example.com",
    "status": 200,
    "method": "GET",
    "duration_seconds": 0.2692
  },
  "score": {
    "value": 71,
    "grade": "C",
    "risk_level": "HIGH",
    "total_findings": 11
  },
  "findings": [
    {
      "id": "ARGUS-CSP-001",
      "severity": "HIGH",
      "title": "Missing Content Security Policy"
    }
  ]
}`,
    },
  },
  {
    id: 'sarif',
    label: 'SARIF',
    command: 'argus-header https://example.com --sarif report.sarif',
    description:
      'Produce a SARIF 2.1.0 document with one result per finding and severity mapped to error, warning or note for code-scanning tools.',
    docs: '/docs/cli-reference#reports',
    output: {
      kind: 'code',
      language: 'json',
      filename: 'report.sarif (excerpt)',
      code: `{
  "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemas/sarif-schema-2.1.0.json",
  "version": "2.1.0",
  "runs": [
    {
      "tool": { "driver": { "name": "Argus Header" } },
      "results": [
        {
          "ruleId": "ARGUS-CSP-001",
          "level": "error",
          "message": { "text": "Missing Content Security Policy" }
        }
      ]
    }
  ]
}`,
    },
  },
  {
    id: 'ci',
    label: 'CI gate',
    command: 'argus-header https://example.com --fail-on high --min-score 90',
    description:
      'Enable CI mode. A HIGH finding or a score below 90 makes the command exit 1, so a pipeline can block the change.',
    docs: '/docs/cli-reference#ci',
    output: {
      kind: 'terminal',
      title: 'ARGUS CI SECURITY CHECK',
      lines: [
        { tone: 'prompt', text: '$ argus-header https://example.com --fail-on high --min-score 90' },
        { tone: 'blank', text: '' },
        { tone: 'heading', text: '╭─ ARGUS CI SECURITY CHECK ──────────────╮' },
        { tone: 'text', text: '│ Target: https://example.com            │' },
        { tone: 'text', text: '│ Score: 71/100        Grade: C          │' },
        { tone: 'text', text: '│ HIGH findings: 2     MEDIUM findings: 2│' },
        { tone: 'text', text: '│ LOW findings: 7                        │' },
        { tone: 'danger', text: '│ Result: FAIL                           │' },
        { tone: 'danger', text: '│ Reason: HIGH severity finding detected │' },
        { tone: 'heading', text: '╰────────────────────────────────────────╯' },
        { tone: 'muted', text: 'Process exit code: 1' },
      ],
    },
  },
  {
    id: 'diff',
    label: 'Diff reports',
    command: 'argus-header diff before.json after.json',
    description:
      'Compare two saved JSON reports. The output summarises the score delta, fixed findings, new findings and overall posture. This transcript compares a report with itself, so the posture is UNCHANGED.',
    docs: '/docs/examples#diff',
    output: {
      kind: 'terminal',
      title: 'ARGUS SECURITY DIFF',
      lines: [
        { tone: 'prompt', text: '$ argus-header diff before.json after.json' },
        { tone: 'blank', text: '' },
        { tone: 'heading', text: '╭─ ARGUS SECURITY DIFF ──────────────────╮' },
        { tone: 'text', text: '│ Score                                  │' },
        { tone: 'text', text: '│   Before: 71                           │' },
        { tone: 'text', text: '│   After:  71                           │' },
        { tone: 'text', text: '│   Change: +0                           │' },
        { tone: 'blank', text: '│                                        │' },
        { tone: 'text', text: '│ Security posture: UNCHANGED            │' },
        { tone: 'heading', text: '╰────────────────────────────────────────╯' },
      ],
    },
  },
]

export const CONFIG_EXAMPLE = `target:
  timeout: 10
  redirects: true
  method: GET

rules:
  csp: true
  cors: true
  cookies: true
  hsts: true
  cache: true
  cross_origin: false
  referrer: true
  permissions: false
  base_headers: true

policy:
  minimum_score: 75
  fail_on: medium`

export const JSON_SCHEMA_EXAMPLE = `{
  "schema_version": "0.8",
  "tool": { "name": "Argus Header", "version": "0.8.0" },
  "scan": {
    "id": "2c2aa190",
    "target": "https://example.com",
    "final_url": "https://example.com/",
    "timestamp": "2026-10-20T02:32:41.316572+00:00",
    "duration_seconds": 0.2692,
    "method": "GET",
    "status": 200
  },
  "score": {
    "value": 71,
    "grade": "C",
    "risk_level": "HIGH",
    "penalty": 29,
    "total_findings": 11,
    "categories": {
      "Content": 16,
      "Transport": 13,
      "Browser": 15,
      "Isolation": 12,
      "Cookies": 15
    },
    "max_per_category": 25,
    "breakdown": { "CRITICAL": 0, "HIGH": 2, "MEDIUM": 2, "LOW": 7 },
    "weights": {
      "Content": 25,
      "Transport": 20,
      "Browser": 25,
      "Isolation": 15,
      "Cookies": 15
    }
  },
  "summary": {
    "total_findings": 11,
    "critical": 0,
    "high": 2,
    "medium": 2,
    "low": 7
  },
  "headers": { "Content-Type": "text/html; charset=utf-8" },
  "findings": [],
  "config": null
}`
