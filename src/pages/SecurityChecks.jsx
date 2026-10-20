import { Link } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'
import { Callout, DocHeader, DocSection, DocSubheading, DocTOC } from '../components/DocBlocks'
import Icon from '../components/Icon'
import { CHECK_FAMILIES, SCORING } from '../data/checks'
import { SEVERITY_DEFINITIONS } from '../data/reports'

const TOC = [
  { href: '#how-checks-work', label: 'How checks work' },
  { href: '#scoring', label: 'Scoring model' },
  { href: '#severity', label: 'Severity levels' },
  ...CHECK_FAMILIES.map((family) => ({
    href: `#${family.id}`,
    label: family.name,
  })),
  { href: '#limitations', label: 'Limitations' },
]

export default function SecurityChecks() {
  return (
    <>
      <DocHeader
        eyebrow="Reference · rule catalogue"
        title="Security checks"
        lead="The nine configurable rule families in Argus Header 0.8.0, documented as implemented. Trigger conditions, severities, remediation examples and the limitations you should know before acting on a finding."
      />

      <DocTOC items={TOC} />

      <DocSection id="how-checks-work" title="How checks work" kicker="Rule engine">
        <p>
          The engine normalizes header names to lowercase, then runs each
          enabled rule family independently. Every finding is a small record
          with a stable ID, a category, a severity, evidence from the response,
          an impact statement and a recommendation.
        </p>
        <div className="doc-spec-grid doc-spec-grid--three">
          <div>
            <span className="data-label">Configurable families</span>
            <strong>9</strong>
            <p>
              CSP, CORS, cookies, HSTS, cache, cross-origin, referrer,
              permissions and base headers.
            </p>
          </div>
          <div>
            <span className="data-label">Groups on this page</span>
            <strong>11</strong>
            <p>
              Base headers are split out for readability into X-Frame-Options,
              X-Content-Type-Options and information leakage.
            </p>
          </div>
          <div>
            <span className="data-label">Input</span>
            <strong>One response</strong>
            <p>
              The headers from a single GET or HEAD response. No body analysis,
              no crawling and no active probing.
            </p>
          </div>
        </div>
        <Callout tone="info" title="Header presence is not the whole story">
          Many rules parse values — CSP directives, HSTS max-age, cookie
          attributes, CORS origins. Others are intentionally simple presence
          checks. The limitations section for each family states what the
          analyzer does not do.
        </Callout>
      </DocSection>

      <DocSection id="scoring" title="Scoring model" kicker="Score 2.0">
        <p>
          Each finding is classified into one of five categories. Every category
          starts with a fixed budget; each finding deducts points based on
          severity, down to a floor of zero. The overall score is the sum of the
          surviving category scores.
        </p>

        <div className="scoring-grid">
          <div className="scoring-grid__budgets">
            <h3>Category budgets</h3>
            {SCORING.budgets.map((budget) => (
              <div className="scoring-budget" key={budget.name}>
                <span>{budget.name}</span>
                <span className="scoring-budget__bar" aria-hidden="true">
                  <span style={{ width: `${budget.max}%` }} />
                </span>
                <strong>{budget.max}</strong>
              </div>
            ))}
            <p className="scoring-grid__note">Budgets total 100 points.</p>
          </div>

          <div className="scoring-grid__deductions">
            <h3>Deductions per finding</h3>
            {SCORING.deductions.map((deduction) => (
              <div className="deduction-row" key={deduction.severity}>
                <span className={`severity severity--${deduction.severity.toLowerCase()}`}>
                  {deduction.severity}
                </span>
                <span>−{deduction.points} points</span>
              </div>
            ))}
            <p className="scoring-grid__note">
              A category cannot fall below zero, so heavy duplication saturates
              its budget instead of pushing the overall score negative.
            </p>
          </div>

          <div className="scoring-grid__grades">
            <h3>Grades</h3>
            {SCORING.grades.map((grade) => (
              <div className="grade-row" key={grade.grade}>
                <strong>{grade.grade}</strong>
                <span>{grade.threshold}</span>
              </div>
            ))}
          </div>
        </div>

        <DocSubheading id="category-mapping">Category classification</DocSubheading>
        <div className="table-wrap">
          <table>
            <caption>Category mapping used by the 0.8.0 score engine.</caption>
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">Rule families and IDs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Content</th>
                <td>
                  CSP, CORS and Cache-Control findings, plus{' '}
                  <code>ARGUS-SERVER-001</code>. These are the findings most
                  directly tied to content injection and caching.
                </td>
              </tr>
              <tr>
                <th scope="row">Transport</th>
                <td>HSTS findings.</td>
              </tr>
              <tr>
                <th scope="row">Browser</th>
                <td>
                  X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
                  Permissions-Policy and <code>ARGUS-SERVER-002</code>.
                </td>
              </tr>
              <tr>
                <th scope="row">Isolation</th>
                <td>COOP, COEP and CORP findings.</td>
              </tr>
              <tr>
                <th scope="row">Cookies</th>
                <td>Cookie attribute and prefix findings.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout tone="warning" title="The leakage rules land in different categories">
          The two information-leakage rules score under different categories
          because the 0.8.0 classifier matches on the rule ID and on
          substrings of the finding title. <code>ARGUS-SERVER-002</code> matches
          on <code>&quot;frame&quot;</code> inside <code>&quot;framework&quot;</code>,
          so it is scored under Browser, while <code>ARGUS-SERVER-001</code>{' '}
          falls through to Content.
        </Callout>

        <Callout tone="warning" title="Score and risk level are different signals">
          The letter grade comes from the numeric score. The <code>risk_level</code>{' '}
          is the highest severity present: any HIGH finding makes the report
          HIGH risk even if the score is relatively high. An empty category
          keeps its full budget, which is why a response with no cookies can
          show 15/15 for Cookies without proving cookie security.
        </Callout>

        <p>
          For the real example.com snapshot, two HIGH findings deduct 7 points
          each from Content and Transport. The remaining findings reduce the
          other categories. The resulting score is 71 (grade C), while the risk
          level is HIGH because HIGH findings are present.
        </p>
      </DocSection>

      <DocSection id="severity" title="Severity levels" kicker="Triage">
        <p>
          Built-in 0.8.0 analyzers emit HIGH, MEDIUM and LOW. CRITICAL exists in
          the scoring and CI gate model but is not produced by any built-in
          check.
        </p>
        <div className="severity-definitions">
          {SEVERITY_DEFINITIONS.map((severity) => (
            <div className="severity-definition" key={severity.level}>
              <span className={`severity severity--${severity.tone}`}>
                {severity.level}
              </span>
              <p>{severity.definition}</p>
            </div>
          ))}
        </div>
        <p>
          Severity describes the weight of the missing control in this rule set,
          not the exploitability of a specific application. Context still
          matters: a missing <code>no-store</code> on a public documentation page
          is not equivalent to the same finding on an account dashboard.
        </p>
      </DocSection>

      <div className="rule-catalogue">
        {CHECK_FAMILIES.map((family) => (
          <section
            className="rule-family"
            id={family.id}
            key={family.id}
            aria-labelledby={`${family.id}-title`}
          >
            <div className="rule-family__head">
              <span className="rule-family__index">{family.index}</span>
              <div>
                <span className="data-label">{family.header}</span>
                <h2 id={`${family.id}-title`}>{family.name}</h2>
              </div>
              <span className="rule-family__count">
                {family.rules.length} {family.rules.length === 1 ? 'rule' : 'rules'}
              </span>
            </div>

            <p className="rule-family__summary">{family.summary}</p>

            <div className="table-wrap">
              <table>
                <caption>{family.name} rule catalogue</caption>
                <thead>
                  <tr>
                    <th scope="col">Rule ID</th>
                    <th scope="col">Severity</th>
                    <th scope="col">Trigger</th>
                  </tr>
                </thead>
                <tbody>
                  {family.rules.map((rule) => (
                    <tr key={`${rule.id}-${rule.trigger}`}>
                      <th scope="row"><code>{rule.id}</code></th>
                      <td>
                        <span
                          className={`severity severity--${String(rule.severity)
                            .toLowerCase()
                            .split(' ')[0]}`}
                        >
                          {rule.severity}
                        </span>
                      </td>
                      <td>{rule.trigger}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rule-family__guidance">
              <div>
                <h3>Remediation</h3>
                <p>{family.remediation}</p>
              </div>
              <div>
                <h3>Example header</h3>
                <CodeBlock code={family.example} language="http" showCopy />
              </div>
            </div>

            <aside className="rule-family__limitation">
              <span className="data-label">
                <Icon name="alert" size={14} /> Limitation
              </span>
              <p>{family.limitations}</p>
            </aside>
          </section>
        ))}
      </div>

      <DocSection id="limitations" title="Cross-cutting limitations" kicker="Before you act">
        <ul className="doc-list doc-list--cross">
          <li>
            A response can vary by route, method, environment, CDN edge and
            authenticated state. One scan covers one observed response.
          </li>
          <li>
            The analyzer does not execute JavaScript, render the page or verify
            whether a policy breaks or protects a specific application flow.
          </li>
          <li>
            No active tests are performed: no injection, no CORS origin
            reflection probe, no certificate inspection and no HTTP/2 detection.
          </li>
          <li>
            Built-in checks have no CRITICAL findings. Do not infer that a clean
            report means there are no critical vulnerabilities in the
            application.
          </li>
          <li>
            Disabling rule families changes the score. A high score only means
            the enabled checks found little.
          </li>
        </ul>
        <Callout tone="danger" title="Responsible use">
          Use Argus Header only on systems you own or have explicit permission
          to assess. Findings are configuration observations, not exploit
          proofs. Validate remediation in the application&apos;s real browser and
          threat context.
        </Callout>
        <div className="doc-inline-links">
          <Link className="text-link" to="/docs/cli-reference#reports">
            Report formats
          </Link>
          <Link className="text-link" to="/docs/examples">
            Example scans
          </Link>
          <Link className="text-link" to="/contributing">
            Add or improve a rule
          </Link>
        </div>
      </DocSection>
    </>
  )
}
