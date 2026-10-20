import { Link } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'
import { Callout, Eyebrow, StepList } from '../components/DocBlocks'
import Icon from '../components/Icon'
import { ExternalLink } from '../components/Links'
import { LINKS, PRODUCT } from '../data/site'

const CHECK_COMMANDS = `# Tests
pytest tests/ -v

# Tests with coverage
pytest tests/ --cov=src/argus_header --cov-report=term-missing

# Static checks used by CI
ruff check src tests
black --check src tests
mypy src`

export default function Contributing() {
  return (
    <div className="container page-shell">
      <header className="page-hero">
        <Eyebrow>Project · contribute</Eyebrow>
        <h1>Build a better header analyzer.</h1>
        <p className="page-hero__lead">
          Argus Header is an MIT-licensed Python project. Contributions are
          welcome — from a documentation fix to a new analyzer with tests. The
          project is small enough that a focused pull request can be reviewed
          carefully.
        </p>
        <div className="page-hero__actions">
          <ExternalLink href={LINKS.github} className="button button--primary button--md" showIcon={false}>
            Open the repository
            <Icon name="git" size={16} />
          </ExternalLink>
          <ExternalLink href={LINKS.issues} className="button button--secondary button--md" showIcon={false}>
            Browse issues
            <Icon name="bug" size={16} />
          </ExternalLink>
        </div>
        <div className="page-hero__meta">
          <span>{PRODUCT.python}</span>
          <span className="page-hero__divider" aria-hidden="true">/</span>
          <span>{PRODUCT.license} license</span>
          <span className="page-hero__divider" aria-hidden="true">/</span>
          <span>pytest · ruff · black · mypy</span>
        </div>
      </header>

      <div className="page-layout">
        <div className="page-content">
          <section className="page-section" id="before-you-start">
            <div className="page-section__head">
              <span className="page-section__index">01</span>
              <div>
                <h2>Before you start</h2>
                <p>Look for an existing issue before opening a new one.</p>
              </div>
            </div>
            <p>
              For a bug, include the installed version, the command you ran,
              the target category (not sensitive response data), the expected
              result and the actual result. For a feature request, describe the
              security question the change helps answer. For a new rule, include
              the header behavior and a false-positive analysis.
            </p>
            <Callout tone="danger" title="Do not report vulnerabilities publicly">
              Do not open a public issue for a security vulnerability in Argus
              Header. Use{' '}
              <ExternalLink href={LINKS.reportVulnerability} className="text-link">
                GitHub private vulnerability reporting
              </ExternalLink>{' '}
              instead. The project security policy describes scope and response
              targets.
            </Callout>
            <div className="page-inline-links">
              <ExternalLink href={LINKS.issues} className="text-link">Issue tracker</ExternalLink>
              <ExternalLink href={LINKS.pulls} className="text-link">Pull requests</ExternalLink>
              <ExternalLink href={LINKS.securityPolicy} className="text-link">Security policy</ExternalLink>
            </div>
          </section>

          <section className="page-section" id="setup">
            <div className="page-section__head">
              <span className="page-section__index">02</span>
              <div>
                <h2>Set up the repository</h2>
                <p>Clone, create a virtual environment, and install development dependencies.</p>
              </div>
            </div>
            <CodeBlock
              code={`git clone ${LINKS.github}.git
cd argus-header
python -m venv .venv
source .venv/bin/activate`}
              language="bash"
              filename="clone and activate"
              caption="On Windows use .venv\\Scripts\\Activate.ps1."
            />
            <p>
              The one-shot bootstrap creates the environment, installs the
              package with the <code>api</code> extra and the development
              requirements, then runs tests and static checks:
            </p>
            <CodeBlock code={`python bootstrap.py`} language="bash" filename="quick bootstrap" />
            <p>Or install the pieces manually:</p>
            <CodeBlock
              code={`pip install -e ".[api]"
pip install -r requirements.txt -r requirements-dev.txt`}
              language="bash"
              filename="manual setup"
            />
            <p>
              The development requirements include <code>build</code>,{' '}
              <code>twine</code>, <code>pytest</code>, <code>pytest-cov</code>,{' '}
              <code>ruff</code>, <code>black</code> and <code>mypy</code>.
            </p>
          </section>

          <section className="page-section" id="workflow">
            <div className="page-section__head">
              <span className="page-section__index">03</span>
              <div>
                <h2>Make a focused change</h2>
                <p>Branch from main, keep the diff small, and add tests with behavior.</p>
              </div>
            </div>
            <StepList
              steps={[
                {
                  index: '01',
                  title: 'Create a branch',
                  body: 'Use a descriptive name such as feat/csp-report-only or fix/hsts-max-age. Branch from the default main branch.',
                },
                {
                  index: '02',
                  title: 'Write the change',
                  body: 'Follow the existing module boundaries. Keep functions small and avoid comments that only restate the code.',
                },
                {
                  index: '03',
                  title: 'Add or update tests',
                  body: 'New analyzer rules need a matching test. New scoring penalties need scoring tests. CI gate, SARIF and diff changes have dedicated test files.',
                },
                {
                  index: '04',
                  title: 'Run the suite and checks',
                  body: 'Run the commands below before committing. CI runs ruff, black --check, mypy and pytest on Python 3.9 and 3.12.',
                },
                {
                  index: '05',
                  title: 'Update documentation',
                  body: 'User-visible changes need a CHANGELOG.md entry and, where relevant, README.md or docs/DOCUMENTATION.md.',
                },
              ]}
            />
            <CodeBlock
              code={CHECK_COMMANDS}
              language="bash"
              filename="verification"
              caption="The requester tests make live network calls; allow extra time."
            />
            <Callout tone="info" title="Use the formatter of record">
              <code>black</code> formats the codebase. Run <code>black src tests</code>{' '}
              to apply formatting, then <code>black --check src tests</code> to
              verify what CI will see. Ruff findings must be zero without adding
              blanket suppressions.
            </Callout>
          </section>

          <section className="page-section" id="adding-a-rule">
            <div className="page-section__head">
              <span className="page-section__index">04</span>
              <div>
                <h2>Add an analyzer rule</h2>
                <p>Keep rule IDs stable, severities deliberate, and findings specific.</p>
              </div>
            </div>
            <p>A new rule usually touches five places:</p>
            <ol className="page-numbered-list">
              <li>
                <strong>Analyzer</strong> — implement parsing and a finding in the
                relevant module under <code>src/argus_header/analyzers/</code>.
              </li>
              <li>
                <strong>Registration</strong> — new families register in{' '}
                <code>src/argus_header/engine/rules.py</code> inside{' '}
                <code>RULES</code>.
              </li>
              <li>
                <strong>Configuration</strong> — a configurable family needs a key
                in <code>models/configuration.py</code> and its CLI/config
                toggle.
              </li>
              <li>
                <strong>Tests</strong> — cover the trigger, the non-trigger and a
                representative edge case.
              </li>
              <li>
                <strong>Documentation</strong> — add the rule to the catalogue,
                note its limitation, and update the changelog.
              </li>
            </ol>
            <p>
              Do not renumber existing <code>ARGUS-*</code> IDs. A finding should
              carry a stable ID, a severity, evidence from the response, an
              impact statement and a concrete recommendation.
            </p>
          </section>

          <section className="page-section" id="pull-request">
            <div className="page-section__head">
              <span className="page-section__index">05</span>
              <div>
                <h2>Open a pull request</h2>
                <p>Explain the security behavior and how you tested it.</p>
              </div>
            </div>
            <div className="checklist">
              <h3>Before you push</h3>
              <ul>
                <li><Icon name="check" size={15} /> Tests pass locally with <code>pytest tests/ -v</code></li>
                <li><Icon name="check" size={15} /> <code>ruff check src tests</code> reports no findings</li>
                <li><Icon name="check" size={15} /> <code>black --check src tests</code> passes</li>
                <li><Icon name="check" size={15} /> <code>mypy src</code> passes</li>
                <li><Icon name="check" size={15} /> User-visible changes are in the changelog</li>
                <li><Icon name="check" size={15} /> Tests avoid depending on live external targets where possible</li>
                <li><Icon name="check" size={15} /> The PR description includes the command or fixture used to verify</li>
              </ul>
            </div>
            <p>
              Use a conventional commit subject where practical:{' '}
              <code>feat:</code>, <code>fix:</code>, <code>docs:</code>,{' '}
              <code>refactor:</code>, <code>chore:</code> or{' '}
              <code>release:</code>. Keep unrelated formatting out of a
              behavioral change.
            </p>
            <div className="page-cta">
              <div>
                <span className="data-label">Ready?</span>
                <h3>Open a pull request against main.</h3>
                <p>The repository&apos;s CONTRIBUTING guide has the full maintainer checklist.</p>
              </div>
              <ExternalLink href={LINKS.pulls} className="button button--primary button--md" showIcon={false}>
                Pull requests
                <Icon name="arrowUpRight" size={16} />
              </ExternalLink>
            </div>
          </section>

          <section className="page-section" id="releases">
            <div className="page-section__head">
              <span className="page-section__index">06</span>
              <div>
                <h2>Release process</h2>
                <p>Maintainers publish tagged releases to PyPI.</p>
              </div>
            </div>
            <p>
              Release steps are documented in the repository: bump the version,
              update the changelog and docs, build clean distributions, validate
              with twine, create a signed tag, upload to PyPI, then verify a
              fresh install. Contributors do not need to bump versions or create
              tags.
            </p>
            <div className="page-inline-links">
              <ExternalLink href={LINKS.contributing} className="text-link">
                Full contributing guide
              </ExternalLink>
              <Link className="text-link" to="/changelog">Release history</Link>
              <Link className="text-link" to="/about">About the project</Link>
            </div>
          </section>
        </div>

        <aside className="page-aside" aria-label="Contribution quick reference">
          <div className="page-aside__card">
            <span className="data-label">Quick reference</span>
            <h2>Commands</h2>
            <code>pytest tests/ -v</code>
            <code>ruff check src tests</code>
            <code>black --check src tests</code>
            <code>mypy src</code>
          </div>
          <div className="page-aside__card">
            <span className="data-label">Project</span>
            <h2>Repository facts</h2>
            <dl>
              <div><dt>License</dt><dd>MIT</dd></div>
              <div><dt>Runtime</dt><dd>Python 3.9+</dd></div>
              <div><dt>Default branch</dt><dd><code>main</code></dd></div>
              <div><dt>Stable</dt><dd>{PRODUCT.versionLabel}</dd></div>
            </dl>
          </div>
          <div className="page-aside__note">
            <Icon name="shield" size={18} />
            <p>
              Security reports belong in GitHub private vulnerability reporting,
              not the public issue tracker.
            </p>
            <ExternalLink href={LINKS.reportVulnerability} className="text-link">
              Report privately
            </ExternalLink>
          </div>
        </aside>
      </div>
    </div>
  )
}
