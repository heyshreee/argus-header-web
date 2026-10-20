import { Link } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'
import { Callout, DocHeader, DocSection, DocSubheading, DocTOC } from '../components/DocBlocks'
import Icon from '../components/Icon'
import { CONFIG_EXAMPLE } from '../data/cli'
import { SAMPLE_SCAN } from '../data/reports'

const TOC = [
  { href: '#basic', label: 'Basic and method scans' },
  { href: '#request-control', label: 'Timeouts and redirects' },
  { href: '#multiple', label: 'Multiple targets' },
  { href: '#reports', label: 'Report exports' },
  { href: '#read-json', label: 'Read a JSON report' },
  { href: '#config', label: 'Configuration' },
  { href: '#ci', label: 'CI gate' },
  { href: '#sarif', label: 'SARIF upload' },
  { href: '#diff', label: 'Compare reports' },
]

const CI_WORKFLOW = `name: Header security

on:
  pull_request:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  argus:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install Argus Header
        run: python -m pip install argus-header==0.8.0

      - name: Scan an authorized staging target
        env:
          TARGET_URL: \${{ vars.ARGUS_TARGET_URL }}
        run: >
          argus-header "$TARGET_URL"
          --fail-on high
          --min-score 80
          --json argus-report.json

      - name: Upload the JSON report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: argus-report
          path: argus-report.json`

const SARIF_WORKFLOW = `permissions:
  contents: read
  security-events: write

steps:
  - uses: actions/setup-python@v5
    with:
      python-version: "3.12"

  - run: python -m pip install argus-header==0.8.0

  - name: Write SARIF
    env:
      TARGET_URL: \${{ vars.ARGUS_TARGET_URL }}
    run: >
      argus-header "$TARGET_URL"
      --sarif argus.sarif

  - name: Upload SARIF
    uses: github/codeql-action/upload-sarif@v3
    with:
      sarif_file: argus.sarif`

export default function Examples() {
  return (
    <>
      <DocHeader
        eyebrow="Guides · recipes"
        title="Examples"
        lead="Copy-ready commands for the published 0.8.0 CLI. Every example uses an authorized target placeholder; replace it with a system you own or have permission to assess."
      />

      <DocTOC items={TOC} />

      <DocSection id="basic" title="Basic and method scans" kicker="Start simple">
        <p>
          The default scan uses GET, follows redirects and applies a 10-second
          timeout. The scheme is optional; Argus adds <code>https://</code> when
          it is missing.
        </p>
        <CodeBlock
          code={`# Scan the reserved documentation domain
argus-header https://example.com

# Omit the scheme
argus-header example.com

# Ask for HEAD instead of GET
argus-header https://example.com --method HEAD`}
          language="bash"
          filename="basic scans"
        />
        <p>
          The method changes the HTTP exchange, not the rule engine. A server
          may return different headers for HEAD, so scan both methods when that
          difference matters to you.
        </p>
        <Callout tone="info" title="Target scope">
          example.com is the IANA-reserved documentation domain. Scanning any
          other public site requires authorization from its owner.
        </Callout>
      </DocSection>

      <DocSection id="request-control" title="Timeouts and redirects" kicker="Request control">
        <p>
          Use <code>--timeout</code> to change the per-request timeout and{' '}
          <code>--no-redirect</code> to inspect the first response instead of
          following a 3xx chain.
        </p>
        <CodeBlock
          code={`# Slower target
argus-header https://example.com --timeout 30

# Inspect the redirect response rather than its destination
argus-header https://example.com --no-redirect

# HEAD plus a short timeout
argus-header https://example.com --method HEAD --timeout 5`}
          language="bash"
          filename="request options"
        />
        <p>
          The requester retries 429, 500, 502, 503 and 504 responses with
          backoff. TLS verification is not disabled by any flag; a certificate
          failure is reported as an error.
        </p>
      </DocSection>

      <DocSection id="multiple" title="Multiple targets" kicker="Batch scans">
        <p>
          Pass several URLs to scan them sequentially. Add{' '}
          <code>--parallel</code> to use a thread pool capped at five workers.
          The terminal prints a report for each target.
        </p>
        <CodeBlock
          code={`argus-header https://example.com https://example.org --parallel`}
          language="bash"
          filename="parallel scan"
        />
        <Callout tone="danger" title="One output file for all targets">
          In 0.8.0, export options receive the same filename for every target in
          a batch. Each report overwrites the previous one, so the last target
          wins. For per-target files, run separate commands with separate
          filenames. Do not assume a batch export contains every result.
        </Callout>
      </DocSection>

      <DocSection id="reports" title="Report exports" kicker="Save the result">
        <p>
          Write all four report types in one command if needed. The canonical
          report is built once and rendered by each exporter.
        </p>
        <CodeBlock
          code={`argus-header https://example.com \\
  --json report.json \\
  --sarif report.sarif \\
  --markdown report.md \\
  --report report.html`}
          language="bash"
          filename="all exports"
        />
        <p>
          Use <code>--html</code> instead of <code>--report</code> when you need
          the older HTML renderer. Both are self-contained files.
        </p>
        <div className="report-format-grid">
          <article>
            <span className="data-label">JSON</span>
            <h3>Automation</h3>
            <p>Canonical schema 0.8. Parse the file, not mixed stdout.</p>
            <code>--json report.json</code>
          </article>
          <article>
            <span className="data-label">SARIF</span>
            <h3>Code scanning</h3>
            <p>SARIF 2.1.0 results and rule metadata.</p>
            <code>--sarif report.sarif</code>
          </article>
          <article>
            <span className="data-label">Markdown</span>
            <h3>Pull request notes</h3>
            <p>Human-readable summary and findings in scan order.</p>
            <code>--markdown report.md</code>
          </article>
          <article>
            <span className="data-label">HTML</span>
            <h3>Share with a team</h3>
            <p>Self-contained styled report. Treat it as sensitive data.</p>
            <code>--report report.html</code>
          </article>
        </div>
      </DocSection>

      <DocSection id="read-json" title="Read a JSON report" kicker="Automation">
        <p>
          The JSON file starts with <code>schema_version</code> and{' '}
          <code>tool</code>, followed by <code>scan</code>, <code>score</code>,{' '}
          <code>summary</code>, <code>headers</code> and <code>findings</code>.
          This small script prints the score and the highest-severity findings.
        </p>
        <CodeBlock
          code={`import json

with open("report.json", encoding="utf-8") as handle:
    report = json.load(handle)

print(report["tool"]["version"])
print(report["score"]["value"], report["score"]["grade"])

for finding in report["findings"]:
    print(finding["severity"], finding["id"], finding["title"])`}
          language="python"
          filename="read_report.py"
        />
        <p>
          The snapshot below is the real 0.8.0 report for example.com. Use it to
          test a parser without making a network request.
        </p>
        <div className="example-facts">
          <div>
            <span className="data-label">Schema</span>
            <strong>0.8</strong>
          </div>
          <div>
            <span className="data-label">Score</span>
            <strong>
              {SAMPLE_SCAN.score.value}/100 · {SAMPLE_SCAN.score.grade}
            </strong>
          </div>
          <div>
            <span className="data-label">Risk</span>
            <strong>{SAMPLE_SCAN.score.risk}</strong>
          </div>
          <div>
            <span className="data-label">Findings</span>
            <strong>{SAMPLE_SCAN.findings.length}</strong>
          </div>
        </div>
        <Callout tone="warning" title="Schema stability">
          0.8.0 is pre-1.0. Pin the release in automation and check the
          changelog before changing the major schema assumptions. The JSON
          report also contains a <code>config</code> block when a configuration
          file was loaded.
        </Callout>
      </DocSection>

      <DocSection id="config" title="Configuration file" kicker="Reusable policy">
        <p>
          Save a <code>.argus.yml</code> in the working directory for automatic
          discovery, or pass <code>--config path/to/file.yml</code>. The example
          disables two rule families and sets a policy gate.
        </p>
        <CodeBlock
          code={CONFIG_EXAMPLE}
          language="yaml"
          filename=".argus.yml"
        />
        <CodeBlock
          code={`argus-header https://example.com --config .argus.yml`}
          language="bash"
          filename="explicit config"
        />
        <Callout tone="danger" title="This config activates CI gating">
          The policy block sets <code>fail_on: medium</code> and{' '}
          <code>minimum_score: 75</code>, so CI mode is active even without a
          CLI flag. The example.com scan (score 71, two HIGH findings) would
          exit 1. Use <code>policy.fail_on: none</code> if you only want request
          and rules settings.
        </Callout>
        <p>
          Disabling <code>cross_origin</code> and <code>permissions</code>{' '}
          removes those findings and changes the score. Comparisons are only
          meaningful when the enabled rule set is the same on both sides.
        </p>
      </DocSection>

      <DocSection id="ci" title="CI gate" kicker="GitHub Actions">
        <p>
          This generic workflow installs the pinned release, scans a target
          configured by the repository, fails on HIGH or a score below 80, and
          uploads the JSON report even when the gate fails.
        </p>
        <CodeBlock
          code={CI_WORKFLOW}
          language="yaml"
          filename=".github/workflows/header-security.yml"
        />
        <p>
          Configure <code>ARGUS_TARGET_URL</code> as a repository variable that
          points to an environment you control. Do not let untrusted pull
          requests choose the target. Also remember that a CI job can only reach
          a private staging environment if networking and access are configured.
        </p>
        <Callout tone="warning" title="CI mode still prints findings">
          The JSON report is written before the gate result, so the artifact is
          available on failure. Because the export uses a filename, stdout
          remains human-readable; the gate status is visible in the CI panel and
          exit code.
        </Callout>
      </DocSection>

      <DocSection id="sarif" title="SARIF upload" kicker="Code scanning">
        <p>
          SARIF 2.1.0 output can be uploaded to code-scanning services. This
          example uses GitHub&apos;s SARIF upload action. It is a generic
          integration example, not a bundled Argus feature.
        </p>
        <CodeBlock
          code={SARIF_WORKFLOW}
          language="yaml"
          filename="sarif job steps"
        />
        <p>
          The upload step needs <code>security-events: write</code>. Confirm
          that code scanning is enabled for the repository and that the action
          version is supported in your environment.
        </p>
      </DocSection>

      <DocSection id="diff" title="Compare reports" kicker="Track change">
        <p>
          Save a baseline and a follow-up report, then compare them. This is
          useful after remediation or a deployment.
        </p>
        <CodeBlock
          code={`# Baseline
argus-header https://example.com --json before.json

# After a change
argus-header https://example.com --json after.json

# Compare
argus-header diff before.json after.json`}
          language="bash"
          filename="baseline and compare"
        />
        <p>
          The diff output reports the score change and the fixed and new
          findings. A successful comparison exits 0 regardless of whether the
          posture improved, so capture the printed output or parse the
          underlying reports if you need automation logic.
        </p>
        <div className="diff-example">
          <span className="data-label">Example output · same report compared twice</span>
          <pre><code>{`╭─ ARGUS SECURITY DIFF ──────────────────╮
│ Score                                  │
│   Before: 71                           │
│   After:  71                           │
│   Change: +0                           │
│                                        │
│ Security posture: UNCHANGED            │
╰────────────────────────────────────────╯`}</code></pre>
        </div>
        <p>
          For a real comparison, keep the two reports from the same target and
          the same config. A different rule set or different response can
          produce a change that is not a remediation result.
        </p>
        <div className="doc-inline-links">
          <Link className="text-link" to="/docs/cli-reference#diff">
            Diff command reference
          </Link>
          <Link className="text-link" to="/docs/security-checks#scoring">
            How score changes work
          </Link>
          <span className="doc-inline-links__icon">
            <Icon name="git" size={15} /> Reports are plain files; store them
            where target data is allowed.
          </span>
        </div>
      </DocSection>
    </>
  )
}
