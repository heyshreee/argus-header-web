import { Link } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'
import { Callout, DocHeader, DocSection, DocSubheading, DocTOC, StepList } from '../components/DocBlocks'
import Icon from '../components/Icon'
import Terminal from '../components/Terminal'
import { FIRST_SCAN_COMMAND, INSTALL_COMMAND, PRODUCT } from '../data/site'
import { SAMPLE_SCAN } from '../data/reports'

const TOC = [
  { href: '#before-you-scan', label: 'Before you scan' },
  { href: '#first-scan', label: 'Run a scan' },
  { href: '#read-output', label: 'Read the output' },
  { href: '#score', label: 'Understand the score' },
  { href: '#save-report', label: 'Save a report' },
  { href: '#exit-codes', label: 'Exit codes and CI' },
  { href: '#errors', label: 'Common errors' },
  { href: '#next', label: 'Next steps' },
]

const SCAN_LINES = [
  { tone: 'prompt', text: `$ ${FIRST_SCAN_COMMAND}` },
  { tone: 'blank', text: '' },
  { tone: 'heading', text: 'ARGUS-HEADER v0.8.0' },
  { tone: 'muted', text: 'DEEP SECURITY ANALYSIS' },
  { tone: 'blank', text: '' },
  { tone: 'heading', text: '╭─────── Scan Summary ────────╮' },
  { tone: 'text', text: '│ Target: https://example.com │' },
  { tone: 'text', text: '│ Status: 200                 │' },
  { tone: 'text', text: '│ Headers Found: 12           │' },
  { tone: 'heading', text: '╰─────────────────────────────╯' },
  { tone: 'blank', text: '' },
  { tone: 'high', text: 'HIGH     ARGUS-CSP-001   Missing Content Security Policy' },
  { tone: 'high', text: 'HIGH     ARGUS-HSTS-001  Missing Strict-Transport-Security' },
  { tone: 'medium', text: 'MEDIUM   ARGUS-XFO-001   Missing X-Frame-Options' },
  { tone: 'medium', text: 'MEDIUM   ARGUS-XCTO-001  Missing X-Content-Type-Options' },
  { tone: 'low', text: 'LOW      ARGUS-CACHE-001 Missing Cache-Control header' },
  { tone: 'muted', text: '… plus 6 more LOW findings' },
  { tone: 'blank', text: '' },
  { tone: 'heading', text: 'Overall 71/100 [C] · Grade C · Risk HIGH' },
  { tone: 'muted', text: 'Condensed from a real 0.8.0 scan. The CLI renders one panel per finding.' },
]

export default function QuickStart() {
  return (
    <>
      <DocHeader
        eyebrow="Getting started · 02"
        title="Quick start"
        lead="Install the CLI, scan one target you are authorized to test, and read the result. This walkthrough uses example.com — the IANA-reserved documentation domain — so every command is safe to run as written."
        actions={
          <Link className="button button--secondary button--md" to="/docs/installation">
            Installation guide
            <Icon name="arrowRight" size={15} />
          </Link>
        }
      />

      <DocTOC items={TOC} />

      <DocSection id="before-you-scan" title="Before you scan" kicker="Authorization first">
        <Callout tone="danger" title="Scan only what you are allowed to scan">
          Header analysis sends real HTTP requests to a remote system. Only
          assess systems you own or have explicit permission to test. A public
          URL is not implicit permission.
        </Callout>

        <DocSubheading id="prerequisites">Prerequisites</DocSubheading>
        <ul className="doc-list doc-list--check">
          <li>{PRODUCT.python} installed and available as <code>python</code> or <code>python3</code>.</li>
          <li>The package installed with pip.</li>
          <li>Outbound network access to the target over HTTP or HTTPS.</li>
        </ul>
        <CodeBlock
          code={`${INSTALL_COMMAND}\n${'argus-header --version'}`}
          language="bash"
          filename="install and verify"
          caption="Expected version output: Argus Header 0.8.0"
        />
      </DocSection>

      <DocSection id="first-scan" title="Run your first scan" kicker="Step 1">
        <p>
          Pass one URL. If you omit the scheme, Argus prefixes{' '}
          <code>https://</code> automatically. The default request method is{' '}
          <code>GET</code>, redirects are followed, and the timeout is 10
          seconds.
        </p>
        <CodeBlock
          code={FIRST_SCAN_COMMAND}
          language="bash"
          filename="shell"
          caption="A scan of example.com is safe: it is the reserved documentation domain."
        />
        <p>
          A scan does not modify the target. It reads the response headers and
          evaluates the enabled rule families locally.
        </p>

        <Terminal
          lines={SCAN_LINES}
          title="argus-header — first scan"
          badge="SAMPLE OUTPUT"
          copyValue={FIRST_SCAN_COMMAND}
          note="Condensed from the published v0.8.0 CLI against example.com on 20 Oct 2026. The full terminal output prints one panel per finding."
          showSweep
        />
      </DocSection>

      <DocSection id="read-output" title="Read the output" kicker="Step 2">
        <p>
          The terminal prints a scan summary, a panel for every finding, and a
          score breakdown. Each finding carries the same core fields, which are
          also present in JSON exports.
        </p>
        <div className="doc-field-grid">
          <div>
            <span className="data-label">Rule ID</span>
            <p>
              A stable identifier such as <code>ARGUS-CSP-001</code>. Use it in
              issues, baselines and remediation tickets.
            </p>
          </div>
          <div>
            <span className="data-label">Severity</span>
            <p>
              <code>HIGH</code>, <code>MEDIUM</code> or <code>LOW</code> for
              built-in checks. The scoring engine also understands{' '}
              <code>CRITICAL</code>.
            </p>
          </div>
          <div>
            <span className="data-label">Evidence</span>
            <p>
              The observed header state, such as{' '}
              <code>Content-Security-Policy header absent</code>.
            </p>
          </div>
          <div>
            <span className="data-label">Impact</span>
            <p>
              The browser protection weakened by the configuration, stated
              without claiming an exploit.
            </p>
          </div>
          <div>
            <span className="data-label">Recommendation</span>
            <p>
              A concrete change to make, such as adding a header directive or
              restricting an origin.
            </p>
          </div>
          <div>
            <span className="data-label">Reference</span>
            <p>
              Documentation links included in the finding, typically MDN and
              OWASP.
            </p>
          </div>
        </div>

        <h3>Try a finding filter in the sample report</h3>
        <p>
          The <Link className="text-link" to="/#sample">homepage sample report</Link>{' '}
          uses the same data as this page and lets you filter by severity and
          open individual findings. It is a static snapshot, not a live scan.
        </p>

        <DocSubheading id="severity-meaning">Severity meanings</DocSubheading>
        <div className="doc-severity-list">
          {[
            ['HIGH', 'A significant missing or weak control, such as an absent CSP or HSTS policy.'],
            ['MEDIUM', 'A meaningful hardening gap or risky value, such as a wildcard CORS origin without credentials.'],
            ['LOW', 'Defense-in-depth or informational finding, such as a disclosed Server header.'],
          ].map(([level, description]) => (
            <div key={level}>
              <span className={`severity severity--${level.toLowerCase()}`}>{level}</span>
              <p>{description}</p>
            </div>
          ))}
        </div>
        <p>
          The full catalogue, including trigger conditions and limitations, is
          in <Link className="text-link" to="/docs/security-checks">Security checks</Link>.
        </p>
      </DocSection>

      <DocSection id="score" title="Understand the score" kicker="Step 3">
        <p>
          Score 2.0 starts each of five categories at a fixed budget and
          subtracts points for findings. The overall score is the sum of what
          remains, with a letter grade from A+ to F.
        </p>
        <div className="score-explain">
          <div className="score-explain__summary">
            <span className="score-explain__value">{SAMPLE_SCAN.score.value}</span>
            <span className="score-explain__max">/ 100</span>
            <span className="score-explain__grade">Grade {SAMPLE_SCAN.score.grade}</span>
            <span className="score-explain__target">
              {SAMPLE_SCAN.target} · {SAMPLE_SCAN.score.counts.high} high,{' '}
              {SAMPLE_SCAN.score.counts.medium} medium,{' '}
              {SAMPLE_SCAN.score.counts.low} low
            </span>
          </div>
          <div className="score-explain__categories">
            {SAMPLE_SCAN.score.categories.map((category) => (
              <div key={category.name}>
                <span>{category.name}</span>
                <strong>
                  {category.score}/{category.max}
                </strong>
              </div>
            ))}
          </div>
        </div>
        <p>
          The example score is 71 because the two HIGH findings deduct 7 points
          each from Content and Transport. The remaining findings — together
          with the information-leakage finding classified under Content — reduce
          the other categories. The Cookies category still receives its full 15
          points: example.com returned no Set-Cookie header in this response, so
          there was no cookie finding to deduct.
        </p>
        <Callout tone="warning" title="A score is not a security guarantee">
          The score only reflects the enabled rule set and one response. It does
          not measure application logic, authentication, server patching,
          secrets, or vulnerabilities outside response headers. Use it for
          triage and trend comparison, not certification.
        </Callout>
        <Link className="text-link" to="/docs/security-checks#scoring">
          Read the scoring model
          <Icon name="arrowRight" size={14} />
        </Link>
      </DocSection>

      <DocSection id="save-report" title="Save a report" kicker="Step 4">
        <p>
          Add an output flag to write a file. JSON is the canonical machine
          format; SARIF is intended for code-scanning tools; Markdown and HTML
          are for people.
        </p>
        <CodeBlock
          code={`argus-header https://example.com --json report.json
argus-header https://example.com --sarif report.sarif
argus-header https://example.com --markdown report.md
argus-header https://example.com --report report.html`}
          language="bash"
          filename="exports"
        />
        <p>
          All renderers use the same canonical v0.8 report. The{' '}
          <code>--html</code> flag writes the older self-contained HTML report,
          while <code>--report</code> writes the newer styled HTML report.
        </p>
        <Callout tone="warning" title="Pipe with care">
          If you omit the filename for <code>--json</code> or{' '}
          <code>--sarif</code>, the document is written to stdout alongside the
          banner, summary and score panel. It is not valid JSON on its own.
          Write a file and read the file in automation.
        </Callout>
        <CodeBlock
          code={`argus-header https://example.com --json report.json
python -c "import json; data=json.load(open('report.json')); print(data['score'])"`}
          language="bash"
          filename="read the canonical report"
        />
        <p>
          The JSON report includes <code>schema_version: "0.8"</code>, scan
          metadata, response headers, findings, score categories and summary
          counts. See the{' '}
          <Link className="text-link" to="/docs/cli-reference#reports">
            report reference
          </Link>{' '}
          for the shape.
        </p>
      </DocSection>

      <DocSection id="exit-codes" title="Exit codes and CI" kicker="Step 5">
        <p>
          A normal scan exits 0 even when it finds issues. To fail a pipeline,
          enable CI mode explicitly with <code>--fail-on</code>,{' '}
          <code>--min-score</code>, or a configuration policy block.
        </p>
        <CodeBlock
          code={`argus-header https://example.com --fail-on high --min-score 80`}
          language="bash"
          filename="CI gate"
          caption="Exits 1 if a HIGH (or worse) finding exists, or if the score is below 80."
        />
        <div className="doc-exit-grid">
          <div>
            <code>0</code>
            <span>Scan completed and any configured gate passed.</span>
          </div>
          <div>
            <code>1</code>
            <span>
              Unexpected error, scan error, or a failed CI gate. Also returned
              by a failed diff command.
            </span>
          </div>
          <div>
            <code>130</code>
            <span>Interrupted by Ctrl-C.</span>
          </div>
        </div>
        <p>
          CI mode and report exports are independent: adding{' '}
          <code>--json report.json</code> does not enable a gate, and adding{' '}
          <code>--fail-on high</code> does not create a report unless you ask
          for one.
        </p>
      </DocSection>

      <DocSection id="errors" title="Common errors" kicker="Troubleshooting">
        <div className="table-wrap">
          <table>
            <caption>Error messages come from the 0.8.0 requester.</caption>
            <thead>
              <tr>
                <th scope="col">Message or symptom</th>
                <th scope="col">Likely cause</th>
                <th scope="col">What to try</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Request timed out</th>
                <td>The target took longer than the timeout.</td>
                <td>
                  Increase <code>--timeout</code>, confirm the host is reachable,
                  or scan a different environment.
                </td>
              </tr>
              <tr>
                <th scope="row">SSL verification failed</th>
                <td>The TLS certificate could not be verified.</td>
                <td>
                  Check the hostname, certificate chain and system clock. Do not
                  treat certificate validation as an optional obstacle.
                </td>
              </tr>
              <tr>
                <th scope="row">Failed to connect to the server</th>
                <td>DNS, network, firewall or the host is down.</td>
                <td>
                  Try <code>curl -I &lt;url&gt;</code> from the same machine to
                  separate network issues from CLI issues.
                </td>
              </tr>
              <tr>
                <th scope="row">Too many redirects</th>
                <td>The URL is in a redirect loop or chain.</td>
                <td>
                  Scan the final destination directly, or use{' '}
                  <code>--no-redirect</code> to inspect the first response.
                </td>
              </tr>
              <tr>
                <th scope="row">Invalid URL</th>
                <td>The input cannot be parsed as a URL.</td>
                <td>
                  Include a host and an optional scheme, for example{' '}
                  <code>https://example.com</code>.
                </td>
              </tr>
              <tr>
                <th scope="row">Scan exits 1 with no connection error</th>
                <td>A CI gate failed, or a config file enabled one.</td>
                <td>
                  Read the CI panel or check for{' '}
                  <code>.argus.yml</code> in the working directory.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Use <code>--verbose</code> only after reading the{' '}
          <Link className="text-link" to="/docs/cli-reference#behavior">
            behavior notes
          </Link>
          : in 0.8.0 it is accepted but does not add a detailed report to the
          deep-scan output.
        </p>
      </DocSection>

      <DocSection id="next" title="Next steps" kicker="Keep going">
        <div className="doc-next-grid">
          <Link className="doc-next-card" to="/docs/cli-reference">
            <span className="data-label">Reference</span>
            <strong>Every option and exit code</strong>
            <span>
              Defaults, config precedence, report formats and known quirks.
            </span>
            <Icon name="arrowRight" size={16} />
          </Link>
          <Link className="doc-next-card" to="/docs/security-checks">
            <span className="data-label">Rules</span>
            <strong>What each check means</strong>
            <span>
              Trigger conditions, remediation examples and stated limitations.
            </span>
            <Icon name="arrowRight" size={16} />
          </Link>
          <Link className="doc-next-card" to="/docs/examples">
            <span className="data-label">Recipes</span>
            <strong>Automate a scan</strong>
            <span>
              CI workflows, SARIF upload, config files and report comparison.
            </span>
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </DocSection>
    </>
  )
}
