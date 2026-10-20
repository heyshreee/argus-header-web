import { Link } from 'react-router-dom'
import CommandButton from '../components/CommandButton'
import CopyButton from '../components/CopyButton'
import Icon from '../components/Icon'
import Terminal from '../components/Terminal'
import { CHECK_FAMILIES } from '../data/checks'
import {
  FIRST_SCAN_COMMAND,
  INSTALL_COMMAND,
  LINKS,
  PRODUCT,
} from '../data/site'

const ASCII = ` █████╗ ██████╗  ██████╗ ██╗   ██╗███████╗     ██████╗██╗     ██╗
██╔══██╗██╔══██╗██╔════╝ ██║   ██║██╔════╝    ██╔════╝██║     ██║
███████║██████╔╝██║  ███╗██║   ██║███████╗    ██║     ██║     ██║
██╔══██║██╔══██╗██║   ██║██║   ██║╚════██║    ██║     ██║     ██║
██║  ██║██║  ██║╚██████╔╝╚██████╔╝███████║    ╚██████╗███████╗██║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝     ╚═════╝╚══════╝╚═╝`

const HERO_LINES = [
  { tone: 'prompt', text: '$ argus-header https://example.com --score' },
  { tone: 'blank', text: '' },
  { tone: 'heading', text: 'ARGUS-HEADER v0.8.0' },
  { tone: 'muted', text: 'DEEP SECURITY ANALYSIS' },
  { tone: 'blank', text: '' },
  { tone: 'text', text: 'Target:   https://example.com' },
  { tone: 'text', text: 'Status:   200 OK · Headers found: 12' },
  { tone: 'blank', text: '' },
  { tone: 'high', text: 'HIGH     ARGUS-CSP-001    Missing Content Security Policy' },
  { tone: 'high', text: 'HIGH     ARGUS-HSTS-001   Missing Strict-Transport-Security' },
  { tone: 'medium', text: 'MEDIUM   ARGUS-XFO-001    Missing X-Frame-Options' },
  { tone: 'medium', text: 'MEDIUM   ARGUS-XCTO-001   Missing X-Content-Type-Options' },
  { tone: 'low', text: 'LOW      ARGUS-CACHE-001  Missing Cache-Control header' },
  { tone: 'muted', text: '… 6 more findings' },
  { tone: 'blank', text: '' },
  { tone: 'heading', text: 'SCORE 71/100  [C]  RISK HIGH' },
  { tone: 'text', text: 'Content 16/25 · Transport 13/20 · Browser 15/25' },
  { tone: 'text', text: 'Isolation 12/15 · Cookies 15/15' },
]

const WORKFLOW_ROWS = [
  ['Security headers', 'CSP · HSTS · XFO · XCTO'],
  ['CORS', 'Origins · credentials · methods · preflight cache'],
  ['Cookies', 'Secure · HttpOnly · SameSite'],
  ['Isolation', 'COOP · COEP · CORP'],
  ['Cache', 'Cache-Control'],
  ['Leakage', 'Server · X-Powered-By'],
]

const FAMILY_IDS = ['csp', 'hsts', 'cors', 'cookies', 'xfo', 'xcto']

const FAMILY_META = {
  csp: 'Policy parsing',
  hsts: 'Transport policy',
  cors: 'Origin policy',
  cookies: 'Session flags',
  xfo: 'Frame policy',
  xcto: 'Sniffing policy',
}

const FAMILY_ROWS = FAMILY_IDS.map((id, index) => {
  const family = CHECK_FAMILIES.find((item) => item.id === id)
  return {
    index: String(index + 1).padStart(2, '0'),
    name: family?.name || id,
    count: family?.rules.length || 0,
    meta: FAMILY_META[id],
  }
})

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero__inner">
          <pre className="hero__ascii" aria-hidden="true">
            {ASCII}
          </pre>
          <h1 className="hero__title">
            Built to help you <span className="hero__pulse">ship</span>,
            <br />
            right from your{' '}
            <span className="hero__gradient">terminal</span>.
          </h1>
          <p className="hero__lead">
            Argus inspects HTTP responses for security headers, CORS
            misconfigurations, information leakage, and cache-related issues.
            One request. No agents. No account.
          </p>

          <div className="hero__actions">
            <CommandButton
              value={INSTALL_COMMAND}
              label="Copy install command"
              className="hero__install"
            />
            <Link className="button button--ghost button--lg hero__docs" to="/docs">
              <span aria-hidden="true">→</span> View Documentation
            </Link>
          </div>

          <div className="hero__terminal" id="sample">
            <Terminal
              lines={HERO_LINES}
              title="argus-header — example.com"
              badge="SAMPLE OUTPUT"
              copyValue={`${FIRST_SCAN_COMMAND} --score`}
              stats={[
                { value: '71/100', label: 'score' },
                { value: 'C', label: 'grade' },
                { value: '11', label: 'findings' },
                { value: PRODUCT.versionLabel, label: 'release' },
              ]}
              note="Condensed from a real v0.8.0 scan of example.com, the IANA-reserved documentation domain. Formatting condensed; not a live scan of this site."
              showSweep
            />
          </div>
          <p className="hero__caption">
            Stable {PRODUCT.versionLabel} · {PRODUCT.python} · {PRODUCT.license}{' '}
            licensed · header analysis only, never exploitation.
          </p>
        </div>
      </section>

      <section className="home-section" id="features" aria-labelledby="features-title">
        <div className="home-section__inner">
          <div className="home-head">
            <h2 id="features-title">HTTP security, without the noise.</h2>
            <p>
              Argus focuses on the HTTP layer and surfaces the security signals
              that actually matter — no asset inventory, no agents, no noise.
            </p>
          </div>

          <div className="workflow-panel">
            <div className="terminal">
              <div className="terminal__bar">
                <span className="terminal__lights" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="terminal__title">argus-header — coverage</span>
                <span className="terminal__badge">6 GROUPS</span>
              </div>
              <div className="workflow-list">
                {WORKFLOW_ROWS.map(([name, meta], index) => (
                  <div className="workflow-row" key={name}>
                    <span className="workflow-row__name">
                      <span className="workflow-row__index">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="workflow-row__dot" aria-hidden="true" />
                      <span className="workflow-row__label">{name}</span>
                    </span>
                    <span className="workflow-row__meta">{meta}</span>
                  </div>
                ))}
              </div>
              <div className="workflow-foot">
                <div className="workflow-usage">
                  <div>
                    <code>$ argus-header https://example.com</code>
                  </div>
                  <div>
                    <code>$ argus-header https://example.com --json report.json</code>
                  </div>
                </div>
                <div className="workflow-status">
                  <span>
                    <i />
                    One request
                  </span>
                  <span>
                    <i />
                    No agents
                  </span>
                  <span>
                    <i />
                    No account
                  </span>
                </div>
              </div>
            </div>
            <p className="home-footnote">
              <span className="status-dot" aria-hidden="true" />
              48 built-in rules · 9 configurable families · active response
              analysis only
            </p>
          </div>
        </div>
      </section>

      <section className="home-section" id="checks" aria-labelledby="checks-title">
        <div className="home-section__inner">
          <div className="home-head">
            <h2 id="checks-title">One response. Multiple security signals.</h2>
            <p>
              Run focused rule families against every response your target sends
              back, then read the weighted score or fail a CI gate on severity.
            </p>
          </div>

          <div className="workflow-panel">
            <div className="terminal">
              <div className="terminal__bar">
                <span className="terminal__lights" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="terminal__title">argus-header — rule families</span>
                <span className="terminal__badge">48 RULES</span>
              </div>
              <div className="workflow-list">
                {FAMILY_ROWS.map((family) => (
                  <div className="workflow-row" key={family.name}>
                    <span className="workflow-row__name">
                      <span className="workflow-row__index">[{family.index}]</span>
                      <span className="workflow-row__dot" aria-hidden="true" />
                      <span className="workflow-row__label">{family.name}</span>
                    </span>
                    <span className="workflow-row__meta">
                      {family.count} rules · {family.meta}
                    </span>
                  </div>
                ))}
              </div>
              <div className="workflow-foot">
                <div className="workflow-usage">
                  <div>
                    <code>$ argus-header https://example.com --score</code>
                  </div>
                  <div>
                    <code>
                      $ argus-header https://example.com --fail-on high --min-score 90
                    </code>
                  </div>
                  <div>
                    <code>$ argus-header diff before.json after.json</code>
                  </div>
                </div>
                <div className="workflow-status">
                  <span>
                    <i />
                    6 rules
                  </span>
                  <span>
                    <i className="is-yellow" />
                    Score 2.0
                  </span>
                  <span>
                    <i className="is-gray" />
                    JSON · SARIF
                  </span>
                </div>
              </div>
            </div>
            <p className="home-footnote">
              <span className="status-dot" aria-hidden="true" />
              48 rules across the full catalogue · scores are a starting point,
              not a security guarantee
            </p>
          </div>
        </div>
      </section>

      <section
        className="home-section"
        id="integrations"
        aria-labelledby="integrations-title"
      >
        <div className="home-section__inner">
          <div className="home-head">
            <h2 id="integrations-title">See what your headers reveal.</h2>
            <p>
              Install the CLI, scan a target you own, then wire the same command
              into your CI pipeline. Reports are plain files you can diff and
              archive.
            </p>
          </div>

          <div className="step-grid">
            <article className="step-card">
              <span className="step-card__num">01</span>
              <h3>Install</h3>
              <p>
                Install the published package from PyPI. Python 3.9 or newer,
                with pip available.
              </p>
              <div className="step-card__command">
                <code>{INSTALL_COMMAND}</code>
                <CopyButton value={INSTALL_COMMAND} label="Copy install command" compact />
              </div>
            </article>

            <article className="step-card">
              <span className="step-card__num">02</span>
              <h3>Scan</h3>
              <p>
                Point the CLI at one authorized target. It makes a single
                request and analyzes the response headers.
              </p>
              <div className="step-card__command">
                <code>{FIRST_SCAN_COMMAND}</code>
                <CopyButton value={FIRST_SCAN_COMMAND} label="Copy scan command" compact />
              </div>
            </article>

            <article className="step-card">
              <span className="step-card__num">03</span>
              <h3>Automate</h3>
              <p>
                Gate a pipeline on severity and score. Exit code 1 fails the
                step; JSON and SARIF reports are ready for tooling.
              </p>
              <div className="step-card__command">
                <code>argus-header URL --fail-on high --min-score 90</code>
                <CopyButton
                  value="argus-header URL --fail-on high --min-score 90"
                  label="Copy CI command"
                  compact
                />
              </div>
            </article>
          </div>

          <div className="home-cta">
            <Link className="button button--primary home-cta__button" to="/docs/quickstart">
              <span aria-hidden="true">▶</span> Get Started Now
            </Link>
            <CommandButton
              value={INSTALL_COMMAND}
              label="Copy install command"
              className="home-cta__command"
            />
            <p className="home-cta__note">
              Only scan systems you own or have explicit permission to assess.
              Header analysis cannot guarantee that an application is secure.
            </p>
            <div className="home-cta__links">
              <a className="text-link" href={LINKS.github} target="_blank" rel="noopener noreferrer">
                <Icon name="git" size={14} /> Source on GitHub
              </a>
              <a className="text-link" href={LINKS.pypi} target="_blank" rel="noopener noreferrer">
                <Icon name="package" size={14} /> PyPI package
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
