import { Link } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'
import { Callout, DocHeader, DocSection, DocSubheading, DocTOC } from '../components/DocBlocks'
import Icon from '../components/Icon'
import { ButtonLink } from '../components/Links'
import {
  CLI_OPTIONS,
  CONFIG_EXAMPLE,
  CURRENT_BEHAVIOR_NOTES,
  JSON_SCHEMA_EXAMPLE,
  USAGE,
} from '../data/cli'
import { PRODUCT } from '../data/site'

const TOC = [
  { href: '#usage', label: 'Usage' },
  { href: '#options', label: 'Options' },
  { href: '#behavior', label: 'Current behavior notes' },
  { href: '#ci', label: 'CI gates and exit codes' },
  { href: '#reports', label: 'Report formats' },
  { href: '#config', label: 'Configuration file' },
  { href: '#diff', label: 'Report diff' },
  { href: '#environment', label: 'Environment and network' },
]

const EXIT_CODES = [
  ['0', 'Success', 'Scan completed. A configured CI gate also passed. Running with no arguments prints help and exits 0.'],
  ['1', 'Failure', 'A scan error, unexpected exception, failed CI gate, or failed diff file load.'],
  ['130', 'Interrupted', 'The scan was cancelled with Ctrl-C.'],
]

export default function CliReference() {
  return (
    <>
      <DocHeader
        eyebrow="Reference · stable v0.8.0"
        title="CLI reference"
        lead="The complete argus-header 0.8.0 command line: scan targets, control the request, write reports, load policy from YAML, gate a pipeline and compare two saved reports."
        actions={
          <ButtonLink to="/docs/examples" variant="secondary">
            Copyable examples
          </ButtonLink>
        }
      />

      <DocTOC items={TOC} />

      <DocSection id="usage" title="Usage" kicker="Syntax">
        <p>
          The published package exposes the <code>argus-header</code> console
          command. The module form <code>python -m argus_header</code> accepts
          the same arguments.
        </p>
        <CodeBlock code={USAGE} language="text" filename="argus-header --help" />
        <p>
          At least one URL is required for a scan. A URL without a scheme is
          normalized to <code>https://</code>. The <code>diff</code> subcommand
          must be the first argument and is handled before the scan parser.
        </p>
        <CodeBlock
          code={`argus-header example.com`}
          language="bash"
          filename="scheme-less target"
          caption="Equivalent to argus-header https://example.com."
        />
        <Callout tone="info" title="This page documents observed 0.8.0 behavior">
          Defaults and quirks below were verified against the published 0.8.0
          wheel, not only against the help text. Where the implementation and
          the help text differ, the implementation is documented and the
          difference is called out.
        </Callout>
      </DocSection>

      <DocSection id="options" title="Options" kicker="18 entries">
        <div className="options-list">
          {CLI_OPTIONS.map((option) => (
            <article className="option-row" key={option.flag}>
              <div className="option-row__head">
                <code className="option-row__flag">{option.flag}</code>
                <span className="option-row__default">
                  default: <code>{option.defaultValue}</code>
                </span>
              </div>
              {option.argument !== '—' && (
                <p className="option-row__arg">Argument: {option.argument}</p>
              )}
              <p>{option.description}</p>
              {option.notes && option.notes !== '—' && (
                <p className="option-row__note">{option.notes}</p>
              )}
            </article>
          ))}
        </div>
      </DocSection>

      <DocSection id="behavior" title="Current behavior notes" kicker="Important">
        <p>
          These are deliberate observations about the 0.8.0 implementation.
          They are not promises about future releases, and automation should not
          depend on the surprising ones.
        </p>
        <div className="behavior-list">
          {CURRENT_BEHAVIOR_NOTES.map((note, index) => (
            <article key={note.title}>
              <span className="behavior-list__index">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
              </div>
            </article>
          ))}
        </div>

        <Callout tone="warning" title="Prefer files over stdout">
          When <code>--json</code> or <code>--sarif</code> is used without a
          filename, the CLI still prints its banner, summary and score panel.
          The result is not a pure machine-readable document. Use{' '}
          <code>--json report.json</code> and parse the file.
        </Callout>
      </DocSection>

      <DocSection id="ci" title="CI gates and exit codes" kicker="Automation">
        <p>
          CI mode is opt-in. It becomes active when any of these is true:
        </p>
        <ul className="doc-list doc-list--check">
          <li><code>--fail-on</code> is supplied;</li>
          <li><code>--min-score</code> is supplied;</li>
          <li>a configuration file is loaded whose <code>policy.fail_on</code> is not <code>none</code>.</li>
        </ul>
        <p>
          Once active, the tool fails the process when the score is below the
          threshold or when a finding at or above the selected severity exists.
          <code>--fail-on high</code> means HIGH or CRITICAL;{' '}
          <code>--fail-on medium</code> means MEDIUM, HIGH or CRITICAL.
        </p>
        <CodeBlock
          code={`argus-header https://example.com --fail-on high --min-score 90`}
          language="bash"
          filename="gate a build"
          caption="For the sample report, this exits 1: two HIGH findings and a score of 71 both fail the thresholds."
        />

        <div className="table-wrap">
          <table>
            <caption>Process exit codes</caption>
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Meaning</th>
                <th scope="col">When</th>
              </tr>
            </thead>
            <tbody>
              {EXIT_CODES.map(([code, label, detail]) => (
                <tr key={code}>
                  <th scope="row"><code>{code}</code></th>
                  <td>{label}</td>
                  <td>{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DocSubheading id="gate-defaults">Threshold defaults</DocSubheading>
        <ul className="doc-list">
          <li>
            Without <code>--fail-on</code> or a config file, severity gating is{' '}
            <code>none</code>.
          </li>
          <li>
            The default minimum score is <code>80</code> when the gate is
            active, but the minimum-score comparison only runs in CI mode.
          </li>
          <li>
            A plain scan with findings still exits 0. Findings alone do not fail
            a build.
          </li>
          <li>
            Built-in 0.8.0 analyzers do not emit <code>CRITICAL</code>; that
            severity exists in the scoring and gate machinery.
          </li>
        </ul>
      </DocSection>

      <DocSection id="reports" title="Report formats" kicker="Output">
        <p>
          Every renderer consumes the same canonical v0.8 report. Choose the
          format based on who or what reads it.
        </p>
        <div className="report-format-grid">
          <article>
            <span className="data-label">Terminal</span>
            <h3>Human scan output</h3>
            <p>
              Scan summary, one panel per finding, and the Score 2.0 breakdown.
              Always printed, regardless of <code>--score</code>.
            </p>
            <code>default</code>
          </article>
          <article>
            <span className="data-label">JSON</span>
            <h3>Canonical report</h3>
            <p>
              Stable schema version <code>0.8</code> with metadata, headers,
              findings, categories and summary counts.
            </p>
            <code>--json report.json</code>
          </article>
          <article>
            <span className="data-label">SARIF</span>
            <h3>Code scanning</h3>
            <p>
              SARIF 2.1.0 with one result per finding and severity mapped to
              error, warning or note.
            </p>
            <code>--sarif report.sarif</code>
          </article>
          <article>
            <span className="data-label">Markdown</span>
            <h3>Review-friendly</h3>
            <p>
              Score line, summary, findings in scan order and the response
              header table.
            </p>
            <code>--markdown report.md</code>
          </article>
          <article>
            <span className="data-label">HTML</span>
            <h3>Styled report</h3>
            <p>
              Newer self-contained HTML report intended for sharing. Values from
              the target are escaped.
            </p>
            <code>--report report.html</code>
          </article>
          <article>
            <span className="data-label">Legacy HTML</span>
            <h3>Older renderer</h3>
            <p>
              Separate self-contained HTML renderer kept for compatibility. It
              uses the same report data.
            </p>
            <code>--html report.html</code>
          </article>
        </div>

        <DocSubheading id="json-shape">JSON shape</DocSubheading>
        <CodeBlock
          code={JSON_SCHEMA_EXAMPLE}
          language="json"
          filename="report.json (excerpt)"
          caption="Condensed from a real 0.8.0 report. The headers object and findings list are truncated here."
        />

        <Callout tone="warning" title="Batch exports use one filename">
          With multiple URLs, each report is rendered in sequence to the same
          output path. The last target overwrites the previous file. Run one
          command per target when you need separate reports.
        </Callout>
      </DocSection>

      <DocSection id="config" title="Configuration file" kicker="YAML or JSON">
        <p>
          Use <code>--config FILE</code> to load a YAML or JSON configuration.
          Without the flag, the current working directory is checked for{' '}
          <code>.argus.yml</code>, <code>.argus.yaml</code>, or{' '}
          <code>.argus.json</code>, in that order.
        </p>
        <CodeBlock
          code={CONFIG_EXAMPLE}
          language="yaml"
          filename=".argus.yml"
          caption="Rule keys use underscores. Only keys inside the rules block are read."
        />
        <p>
          The <code>rules</code> block toggles whole rule families. Disabling a
          family removes its findings and changes the achievable score. The{' '}
          <code>target</code> block supplies request defaults.
        </p>

        <DocSubheading id="config-policy">Policy precedence</DocSubheading>
        <ul className="doc-list">
          <li>
            <code>--fail-on</code> overrides <code>policy.fail_on</code>.
          </li>
          <li>
            <code>--min-score</code> overrides <code>policy.minimum_score</code>.
          </li>
          <li>
            A loaded config whose <code>policy.fail_on</code> is not{' '}
            <code>none</code> activates CI mode even without a CLI gate flag.
          </li>
        </ul>
        <Callout tone="danger" title="A config file activates policy defaults">
          A configuration file with no <code>policy</code> block still receives
          the default policy values <code>fail_on: high</code> and{' '}
          <code>minimum_score: 80</code>. In 0.8.0 that is enough to enable CI
          gating. Add <code>policy.fail_on: none</code> if you want a config file
          for request/rules settings without a gate.
        </Callout>
        <Callout tone="warning" title="A config file also overrides request flags">
          The upstream docstrings say CLI flags take precedence over a config
          file. The 0.8.0 scan pipeline does the opposite. When a config file
          is loaded, its <code>target.method</code>, <code>target.timeout</code>{' '}
          and <code>target.redirects</code> values replace the ones resolved
          from the command line, so <code>--method</code>, <code>--timeout</code>{' '}
          and <code>--no-redirect</code> are ignored. Without a config file,
          those flags work as expected.
        </Callout>
      </DocSection>

      <DocSection id="diff" title="Report diff" kicker="Subcommand">
        <p>
          Compare two previously saved JSON reports. The command prints the
          before and after score, the delta, fixed findings, new findings and an
          overall posture.
        </p>
        <CodeBlock
          code={`argus-header diff before.json after.json`}
          language="bash"
          filename="diff"
          caption="Both inputs must be 0.8-style JSON reports. A successful comparison exits 0 even when findings changed."
        />
        <p>
          Typical workflow: save a baseline report in the morning, save another
          after a deployment, then diff the two files. Keep separate report
          files for each target; a multi-URL export does not create per-target
          files in 0.8.0.
        </p>
        <ButtonLink to="/docs/examples#diff" variant="secondary">
          Diff workflow example
        </ButtonLink>
      </DocSection>

      <DocSection id="environment" title="Environment and network" kicker="Runtime">
        <div className="doc-spec-grid doc-spec-grid--three">
          <div>
            <span className="data-label">Runtime</span>
            <strong>{PRODUCT.python}</strong>
            <p>Tests cover 3.9 and 3.12 in the repository CI.</p>
          </div>
          <div>
            <span className="data-label">User-Agent</span>
            <strong><code>HeaderScan-Tool/1.0</code></strong>
            <p>The CLI sends a fixed polite User-Agent.</p>
          </div>
          <div>
            <span className="data-label">Retries</span>
            <strong>3 retries</strong>
            <p>
              urllib3 is configured with <code>total=3</code> retries and
              backoff for 429, 500, 502, 503 and 504 responses.
            </p>
          </div>
          <div>
            <span className="data-label">Parallelism</span>
            <strong>5 workers</strong>
            <p>
              <code>--parallel</code> uses a ThreadPoolExecutor capped at five
              workers.
            </p>
          </div>
          <div>
            <span className="data-label">Redirects</span>
            <strong>Followed by default</strong>
            <p>
              <code>--no-redirect</code> inspects the redirect response itself.
            </p>
          </div>
          <div>
            <span className="data-label">Output files</span>
            <strong>Relative to CWD</strong>
            <p>
              Filenames are written as supplied. Report directories must already
              exist.
            </p>
          </div>
        </div>
        <Callout tone="info" title="Only one response per target">
          Argus does not crawl, replay a request with a custom Origin, or test
          every route. A target can return different headers for different
          paths, methods or environments. Scan the specific surfaces that matter
          to you.
        </Callout>
        <p>
          Looking for commands rather than definitions? The{' '}
          <Link className="text-link" to="/docs/examples">
            examples page
          </Link>{' '}
          has copy-ready recipes for scans, exports, CI and configuration.
        </p>
      </DocSection>
    </>
  )
}
