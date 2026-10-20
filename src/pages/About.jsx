import { Link } from 'react-router-dom'
import { Eyebrow } from '../components/DocBlocks'
import Icon from '../components/Icon'
import { ArgusMark } from '../components/Logo'
import { ExternalLink } from '../components/Links'
import { LINKS, PRODUCT } from '../data/site'

const PRINCIPLES = [
  {
    icon: 'eye',
    title: 'Show the response, not a verdict',
    body:
      'A header finding is an observation about configuration. The tool states what it saw and why it matters, without pretending that a clean report proves an application secure.',
  },
  {
    icon: 'file',
    title: 'Make results reproducible',
    body:
      'Stable rule IDs, a documented schema and file-based exports let a team compare scans over time instead of relying on a screenshot of terminal output.',
  },
  {
    icon: 'terminal',
    title: 'Stay small and local',
    body:
      'One Python package, a normal HTTP request and local report rendering. No account, hosted scan service or browser automation is required for the CLI.',
  },
  {
    icon: 'git',
    title: 'Keep the work inspectable',
    body:
      'The analyzers, scoring model, tests and release history are in the public repository under the MIT license. Anyone can check how a finding is produced.',
  },
]

export default function About() {
  return (
    <div className="container page-shell">
      <header className="page-hero about-hero">
        <div className="about-hero__copy">
          <Eyebrow>Project · about</Eyebrow>
          <h1>Security headers are easy to miss. Reading them should not be.</h1>
          <p className="page-hero__lead">
            Argus Header is an open-source Python CLI for the response-header
            layer: the policies a server sends to tell browsers how to handle
            HTTPS, framing, scripts, cookies and cross-origin requests.
          </p>
          <div className="page-hero__actions">
            <ExternalLink href={LINKS.github} className="button button--primary button--md" showIcon={false}>
              View the source
              <Icon name="git" size={16} />
            </ExternalLink>
            <Link className="button button--secondary button--md" to="/docs">
              Read the documentation
              <Icon name="book" size={16} />
            </Link>
          </div>
        </div>
        <div className="about-hero__mark" aria-hidden="true">
          <VectorMark />
          <span>ARGUS<br />HEADER</span>
        </div>
      </header>

      <div className="page-layout">
        <div className="page-content">
          <section className="page-section" id="why">
            <div className="page-section__head">
              <span className="page-section__index">01</span>
              <div>
                <h2>Why a header analyzer</h2>
                <p>A small surface with a large blast radius when it is wrong.</p>
              </div>
            </div>
            <p>
              Response headers carry browser-enforced controls. A missing
              Content-Security-Policy can make an injection bug easier to
              exploit. A missing HSTS policy leaves a window for downgrade
              attacks. A cookie without the right attributes travels where it
              should not. These are not exotic issues; they are configuration
              decisions that are easy to defer and hard to see in a code review.
            </p>
            <p>
              Argus Header turns one HTTP response into a readable checklist:
              what is missing, what value is risky, why it matters and what to
              change. It is meant to shorten the distance between noticing a
              header and fixing it.
            </p>
          </section>

          <section className="page-section" id="not">
            <div className="page-section__head">
              <span className="page-section__index">02</span>
              <div>
                <h2>What the project deliberately is not</h2>
                <p>Narrow scope makes the output easier to trust.</p>
              </div>
            </div>
            <div className="about-not-grid">
              <div>
                <Icon name="close" size={16} />
                <p>
                  <strong>Not a scanner replacement.</strong> It does not crawl,
                  authenticate, fuzz, exploit or inspect the application body.
                </p>
              </div>
              <div>
                <Icon name="close" size={16} />
                <p>
                  <strong>Not a certification.</strong> A perfect header report
                  does not mean the application, dependencies or infrastructure
                  are secure.
                </p>
              </div>
              <div>
                <Icon name="close" size={16} />
                <p>
                  <strong>Not an active probing service.</strong> CORS checks
                  read a single response; they do not send attacker-controlled
                  Origin headers.
                </p>
              </div>
              <div>
                <Icon name="close" size={16} />
                <p>
                  <strong>Not a hosted data collection product.</strong> The CLI
                  runs locally and fetches the target you specify. Reports stay
                  on your machine unless you move them.
                </p>
              </div>
            </div>
          </section>

          <section className="page-section" id="principles">
            <div className="page-section__head">
              <span className="page-section__index">03</span>
              <div>
                <h2>How the project is built</h2>
                <p>Four principles shape the tool and this website.</p>
              </div>
            </div>
            <div className="principles-grid">
              {PRINCIPLES.map((principle) => (
                <article key={principle.title}>
                  <span className="principles-grid__icon">
                    <Icon name={principle.icon} size={19} />
                  </span>
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="page-section" id="history">
            <div className="page-section__head">
              <span className="page-section__index">04</span>
              <div>
                <h2>Release history</h2>
                <p>From a public beta to a small, documented security tool.</p>
              </div>
            </div>
            <div className="about-timeline">
              <div>
                <span>July 2026</span>
                <strong>First public beta</strong>
                <p>
                  v0.5.0 shipped GET/HEAD requests, Rich terminal output and JSON
                  export. v0.5.1 added the <code>python -m argus_header</code>{' '}
                  entry point.
                </p>
              </div>
              <div>
                <span>August 2026</span>
                <strong>Scoring and reports</strong>
                <p>
                  v0.6.0 added the legacy verbose report; v0.7.0 added a numeric
                  score, grades, cookie analysis, stable rule IDs, Markdown and
                  HTML reports.
                </p>
              </div>
              <div>
                <span>September 2026</span>
                <strong>Deep analysis</strong>
                <p>
                  v0.8.0 replaced the analyzer layer with nine modular rule
                  families, Score 2.0, SARIF, YAML configuration, CI gates and
                  report diffing.
                </p>
              </div>
              <div>
                <span>Next</span>
                <strong>0.9.0 is planned</strong>
                <p>
                  The upstream roadmap lists 0.9.0 as the next release. There is
                  no tag or PyPI publication, so this site does not present it as
                  available.
                </p>
              </div>
            </div>
            <Link className="text-link" to="/changelog">
              Read the full changelog
              <Icon name="arrowRight" size={14} />
            </Link>
          </section>

          <section className="page-section" id="responsible">
            <div className="page-section__head">
              <span className="page-section__index">05</span>
              <div>
                <h2>Responsible use</h2>
                <p>Authorization is a requirement, not a footnote.</p>
              </div>
            </div>
            <p>
              Argus Header is intended for defensive security, authorized
              auditing and education. Only assess systems you own or have
              explicit permission to test. A public endpoint is not implicit
              permission, and a tool&apos;s ability to send a request is not
              authorization to send it.
            </p>
            <p>
              Findings should be validated in context. A header that is wrong
              for one application can be intentional for another. Report
              vulnerabilities in Argus itself through the GitHub security policy,
              not a public issue.
            </p>
            <div className="page-inline-links">
              <ExternalLink href={LINKS.securityPolicy} className="text-link">
                Security policy
              </ExternalLink>
              <ExternalLink href={LINKS.reportVulnerability} className="text-link">
                Report a vulnerability
              </ExternalLink>
              <ExternalLink href={LINKS.license} className="text-link">
                MIT license
              </ExternalLink>
            </div>
          </section>
        </div>

        <aside className="page-aside" aria-label="Project facts">
          <div className="page-aside__card about-facts">
            <span className="data-label">Project</span>
            <h2>{PRODUCT.name}</h2>
            <dl>
              <div><dt>Package</dt><dd><code>{PRODUCT.packageName}</code></dd></div>
              <div><dt>Stable</dt><dd>{PRODUCT.versionLabel}</dd></div>
              <div><dt>Runtime</dt><dd>{PRODUCT.python}</dd></div>
              <div><dt>License</dt><dd>{PRODUCT.license}</dd></div>
              <div>
                <dt>Maintainer</dt>
                <dd><ExternalLink href={LINKS.author} className="text-link">{PRODUCT.author}</ExternalLink></dd>
              </div>
              <div><dt>Repository</dt><dd><ExternalLink href={LINKS.github} className="text-link">heyshreee/argus-header</ExternalLink></dd></div>
            </dl>
          </div>
          <div className="page-aside__card">
            <span className="data-label">Dependencies</span>
            <h2>Runtime</h2>
            <ul className="about-deps">
              <li><code>requests&gt;=2.32.0</code></li>
              <li><code>rich&gt;=13.7.0</code></li>
              <li><code>pyyaml&gt;=6.0.0</code></li>
            </ul>
            <p>
              The optional <code>api</code> extra adds FastAPI, Uvicorn and
              Pydantic for the repository&apos;s API layer. The CLI does not need
              it.
            </p>
          </div>
          <div className="page-aside__note">
            <ArgusMark size={34} />
            <p>
              An independent open-source project. Not affiliated with any cloud
              provider or security vendor.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function VectorMark() {
  return (
    <svg viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <circle cx="80" cy="80" r="66" stroke="currentColor" strokeOpacity=".2" />
      <circle cx="80" cy="80" r="48" stroke="currentColor" strokeOpacity=".35" />
      <path
        d="M20 80c18-27 102-27 120 0-18 27-102 27-120 0Z"
        stroke="#22C55E"
        strokeWidth="2"
      />
      <circle cx="80" cy="80" r="15" fill="#22C55E" fillOpacity=".12" stroke="#22C55E" strokeWidth="2" />
      <circle cx="80" cy="80" r="5" fill="#22C55E" />
      <path d="M80 8v20M80 132v20M8 80h20M132 80h20" stroke="#9CA3AF" strokeWidth="2" />
    </svg>
  )
}
