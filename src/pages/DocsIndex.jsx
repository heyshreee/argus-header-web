import { Link } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'
import { Callout, DocHeader, DocSection, DocSubheading, DocTOC, StepList } from '../components/DocBlocks'
import Icon from '../components/Icon'
import { ButtonLink, ExternalLink } from '../components/Links'
import {
  FIRST_SCAN_COMMAND,
  INSTALL_COMMAND,
  LINKS,
  PRODUCT,
  VERIFY_COMMAND,
  VERIFY_OUTPUT,
} from '../data/site'

const TOC = [
  { href: '#what-it-does', label: 'What Argus Header does' },
  { href: '#start-here', label: 'Start here' },
  { href: '#scan-lifecycle', label: 'The scan lifecycle' },
  { href: '#versions', label: 'Versions and releases' },
  { href: '#limits', label: 'Scope and limits' },
]

const DOC_CARDS = [
  {
    index: '01',
    title: 'Installation',
    description:
      'Requirements, virtual environments, verification and troubleshooting for Windows, Linux and macOS.',
    to: '/docs/installation',
    icon: 'package',
    meta: 'Python 3.9+ · pip',
  },
  {
    index: '02',
    title: 'Quick start',
    description:
      'Run one authorized scan, read the findings, understand the score and save your first report.',
    to: '/docs/quickstart',
    icon: 'terminal',
    meta: 'One command',
  },
  {
    index: '03',
    title: 'CLI reference',
    description:
      'Every flag, default, exit code and report format in the published 0.8.0 command line.',
    to: '/docs/cli-reference',
    icon: 'code',
    meta: '18 options and commands',
  },
  {
    index: '04',
    title: 'Security checks',
    description:
      'The complete rule catalogue, severity model, Score 2.0 budgets and remediation guidance.',
    to: '/docs/security-checks',
    icon: 'shield',
    meta: '11 header groups',
  },
  {
    index: '05',
    title: 'Examples',
    description:
      'Copyable recipes for scans, exports, configuration, CI gating and report comparison.',
    to: '/docs/examples',
    icon: 'file',
    meta: 'Copy-ready',
  },
  {
    index: '06',
    title: 'Changelog',
    description:
      'What shipped on PyPI, what changed in each release, and what is planned next.',
    to: '/changelog',
    icon: 'layers',
    meta: 'v0.5.0 → v0.8.0',
  },
]

export default function DocsIndex() {
  return (
    <>
      <DocHeader
        eyebrow={`Documentation · stable ${PRODUCT.versionLabel}`}
        title="Everything you need to inspect a response."
        lead="Argus Header is a passive HTTP security-header analyzer for the command line. These pages cover installation, the full CLI, every built-in rule family and the limits of what a header-only scan can tell you."
        actions={
          <>
            <ButtonLink to="/docs/installation">Install Argus Header</ButtonLink>
            <ButtonLink
              href={LINKS.github}
              variant="secondary"
              icon="git"
              external
            >
              Source repository
            </ButtonLink>
          </>
        }
      />

      <div className="doc-facts" aria-label="Documentation facts">
        <div>
          <span className="data-label">Stable release</span>
          <strong>{PRODUCT.versionLabel}</strong>
        </div>
        <div>
          <span className="data-label">Runtime</span>
          <strong>{PRODUCT.python}</strong>
        </div>
        <div>
          <span className="data-label">License</span>
          <strong>{PRODUCT.license}</strong>
        </div>
        <div>
          <span className="data-label">Dependencies</span>
          <strong>requests · rich · pyyaml</strong>
        </div>
      </div>

      <DocTOC items={TOC} />

      <DocSection id="what-it-does" title="What Argus Header does" kicker="Overview">
        <p>
          Point the CLI at a single URL. Argus makes one HTTP request, records
          the response status and headers, then runs nine independently
          configurable rule families over them. The result is a set of findings
          with stable rule IDs, a weighted score from 0 to 100, and an optional
          report in JSON, SARIF, Markdown or HTML.
        </p>
        <p>
          It is deliberately narrow. There is no browser, crawler, proxy,
          account or database. The tool reviews what a server exposes in one
          response and turns that into a reviewable hardening checklist.
        </p>

        <div className="doc-feature-grid">
          <article>
            <span className="doc-feature-grid__icon">
              <Icon name="shield" size={20} />
            </span>
            <h3>Header policy review</h3>
            <p>
              Parses CSP, HSTS, CORS, cookie and cache values instead of merely
              checking whether a header exists.
            </p>
          </article>
          <article>
            <span className="doc-feature-grid__icon">
              <Icon name="scan" size={20} />
            </span>
            <h3>Nine rule families</h3>
            <p>
              CSP, CORS, cookies, HSTS, Cache-Control, cross-origin policies,
              Referrer-Policy, Permissions-Policy and base headers.
            </p>
          </article>
          <article>
            <span className="doc-feature-grid__icon">
              <Icon name="scale" size={20} />
            </span>
            <h3>Score 2.0</h3>
            <p>
              Five weighted categories, severity deductions and an A+ to F
              grade. The score is a triage signal, not a certification.
            </p>
          </article>
          <article>
            <span className="doc-feature-grid__icon">
              <Icon name="file" size={20} />
            </span>
            <h3>Reports and gates</h3>
            <p>
              JSON, SARIF 2.1.0, Markdown and HTML exports, CI exit codes and a
              diff command for two saved reports.
            </p>
          </article>
        </div>

        <Callout tone="info" title="Passive by design">
          Argus reads the headers returned by an ordinary GET or HEAD request.
          It does not attempt exploitation, authentication bypass, content
          discovery or browser execution. A report describes header
          configuration; it cannot prove an application is secure.
        </Callout>
      </DocSection>

      <DocSection id="start-here" title="Start here" kicker="Guides">
        <p>
          New to the tool? Follow the path from installation to a saved report.
          If you already have the CLI installed, jump to the quick start.
        </p>

        <div className="doc-index-grid">
          {DOC_CARDS.map((card) => (
            <Link className="doc-index-card" to={card.to} key={card.title}>
              <span className="doc-index-card__top">
                <span className="doc-index-card__icon">
                  <Icon name={card.icon} size={19} />
                </span>
                <span className="doc-index-card__index">{card.index}</span>
              </span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <span className="doc-index-card__meta">
                {card.meta}
                <Icon name="arrowRight" size={14} />
              </span>
            </Link>
          ))}
        </div>

        <DocSubheading id="first-commands">The first three commands</DocSubheading>
        <CodeBlock code={INSTALL_COMMAND} language="bash" filename="install" />
        <div className="doc-command-pair">
          <CodeBlock code={VERIFY_COMMAND} language="bash" filename="verify" />
          <p className="doc-command-pair__expected">
            Expected output
            <code>{VERIFY_OUTPUT}</code>
          </p>
        </div>
        <CodeBlock
          code={FIRST_SCAN_COMMAND}
          language="bash"
          filename="scan"
          caption="Use only on a target you own or are authorized to assess."
        />
      </DocSection>

      <DocSection id="scan-lifecycle" title="The scan lifecycle" kicker="How it works">
        <p>
          Each target is processed independently. The canonical report is built
          once, then used by every renderer.
        </p>
        <StepList
          steps={[
            {
              index: '01',
              title: 'Normalize the target',
              body: 'A URL without a scheme is prefixed with https://. The request is sent with a fixed polite User-Agent and the configured method.',
            },
            {
              index: '02',
              title: 'Fetch one response',
              body: 'requests.Session follows redirects by default, applies a per-request timeout and retries transient 429/5xx responses up to three times with backoff.',
            },
            {
              index: '03',
              title: 'Normalize headers',
              body: 'Header names are lowercased for case-insensitive matching. Repeated Set-Cookie fields are preserved as separate values for cookie analysis.',
            },
            {
              index: '04',
              title: 'Run enabled rules',
              body: 'Each rule family produces findings with a stable ARGUS-* ID, severity, evidence, impact and recommendation. Disabled families are skipped.',
            },
            {
              index: '05',
              title: 'Score and render',
              body: 'Findings are classified into five categories, deducted from fixed budgets, and rendered to the terminal or an export. CI gates evaluate the same report.',
            },
          ]}
        />
      </DocSection>

      <DocSection id="versions" title="Versions and releases" kicker="Versioning">
        <p>
          This documentation describes the published{' '}
          <strong>{PRODUCT.versionLabel}</strong> package on PyPI. The upstream
          roadmap lists <code>{PRODUCT.nextVersion}</code> as the next planned
          release, but no branch declares that version and there is no v0.9.0
          tag, GitHub release or PyPI publication. Features mentioned in the
          roadmap are not documented here as available.
        </p>
        <div className="doc-inline-links">
          <ExternalLink href={LINKS.pypi} className="text-link">
            PyPI release history
          </ExternalLink>
          <ExternalLink href={LINKS.releases} className="text-link">
            GitHub releases
          </ExternalLink>
          <Link className="text-link" to="/changelog">
            Changelog
          </Link>
        </div>
        <Callout tone="warning" title="Behavior notes are part of the docs">
          A few 0.8.0 flags behave differently from what their names suggest.
          The reference calls these out explicitly — notably <code>--score</code>,{' '}
          <code>--verbose</code> and JSON output to stdout.
        </Callout>
      </DocSection>

      <DocSection id="limits" title="Scope and limits" kicker="Read this first">
        <div className="doc-two-col">
          <div>
            <h3>What a scan covers</h3>
            <ul className="doc-list doc-list--check">
              <li>One HTTP response per target</li>
              <li>Response-header parsing and rule evaluation</li>
              <li>A rule-based score and letter grade</li>
              <li>Terminal, JSON, SARIF, Markdown and HTML output</li>
              <li>CI gates and saved-report comparison</li>
            </ul>
          </div>
          <div>
            <h3>What it does not cover</h3>
            <ul className="doc-list doc-list--cross">
              <li>Browser rendering or JavaScript execution</li>
              <li>Crawling, authenticated sessions or asset discovery</li>
              <li>Active exploitation or proof-of-concept payloads</li>
              <li>TLS certificates, HTTP/2 detection or full penetration testing</li>
              <li>A guarantee that a site is secure</li>
            </ul>
          </div>
        </div>
        <Callout tone="danger" title="Authorized use only">
          Only assess systems you own or have explicit permission to test.
          Header analysis cannot guarantee that an application is secure, and a
          clean report is not an authorization to stop reviewing the rest of
          the stack.
        </Callout>
      </DocSection>
    </>
  )
}
