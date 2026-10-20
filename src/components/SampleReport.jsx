import { useMemo, useState } from 'react'
import Icon from './Icon'
import { SAMPLE_SCAN } from '../data/reports'
import { Link } from 'react-router-dom'

const FILTERS = [
  { id: 'all', label: 'All findings' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
]

export default function SampleReport() {
  const [filter, setFilter] = useState('all')

  const findings = useMemo(() => {
    if (filter === 'all') return SAMPLE_SCAN.findings
    return SAMPLE_SCAN.findings.filter(
      (finding) => finding.severity.toLowerCase() === filter
    )
  }, [filter])

  const counts = SAMPLE_SCAN.score.counts

  return (
    <div className="sample-report">
      <div className="sample-report__score">
        <div className="sample-report__meta">
          <span className="data-label">Sample report</span>
          <span className="sample-report__stamp">
            v{SAMPLE_SCAN.toolVersion} · {SAMPLE_SCAN.capturedAt}
          </span>
        </div>

        <div className="score-summary">
          <div
            className="score-dial"
            style={{ '--score': SAMPLE_SCAN.score.value }}
            role="img"
            aria-label={`Security score ${SAMPLE_SCAN.score.value} out of 100, grade ${SAMPLE_SCAN.score.grade}, risk ${SAMPLE_SCAN.score.risk}`}
          >
            <span className="score-dial__value">{SAMPLE_SCAN.score.value}</span>
            <span className="score-dial__max">/ 100</span>
          </div>
          <div className="score-summary__copy">
            <span className="score-summary__grade">Grade {SAMPLE_SCAN.score.grade}</span>
            <span className="score-summary__risk">
              <span className="status-dot status-dot--high" aria-hidden="true" />
              {SAMPLE_SCAN.score.risk} risk
            </span>
            <span className="score-summary__target">
              {SAMPLE_SCAN.target}
              <span className="score-summary__status">HTTP {SAMPLE_SCAN.status}</span>
            </span>
          </div>
        </div>

        <div className="category-list" aria-label="Score by category">
          {SAMPLE_SCAN.score.categories.map((category) => {
            const percent = Math.round((category.score / category.max) * 100)
            return (
              <div className="category-row" key={category.name}>
                <div className="category-row__head">
                  <span>{category.name}</span>
                  <span>
                    {category.score}/{category.max}
                  </span>
                </div>
                <div
                  className="category-bar"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={category.max}
                  aria-valuenow={category.score}
                  aria-label={`${category.name}: ${category.score} of ${category.max}`}
                >
                  <span style={{ width: `${percent}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="severity-counts" aria-label="Finding counts">
          <div>
            <span className="severity-counts__value">{counts.high}</span>
            <span className="severity-counts__label">High</span>
          </div>
          <div>
            <span className="severity-counts__value">{counts.medium}</span>
            <span className="severity-counts__label">Medium</span>
          </div>
          <div>
            <span className="severity-counts__value">{counts.low}</span>
            <span className="severity-counts__label">Low</span>
          </div>
          <div>
            <span className="severity-counts__value">{counts.critical}</span>
            <span className="severity-counts__label">Critical</span>
          </div>
        </div>

        <Link className="text-link" to="/docs/security-checks#scoring">
          How the score works
          <Icon name="arrowRight" size={14} />
        </Link>
      </div>

      <div className="sample-report__findings">
        <div className="findings-toolbar">
          <div className="findings-toolbar__filters" role="group" aria-label="Filter findings by severity">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`filter-chip${filter === item.id ? ' is-active' : ''}`}
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
                <span>
                  {item.id === 'all'
                    ? SAMPLE_SCAN.findings.length
                    : counts[item.id]}
                </span>
              </button>
            ))}
          </div>
          <span className="findings-toolbar__count" role="status">
            Showing {findings.length} of {SAMPLE_SCAN.findings.length}
          </span>
        </div>

        <ol className="finding-list">
          {findings.map((finding) => (
            <li key={finding.id}>
              <details className="finding">
                <summary>
                  <span className={`severity severity--${finding.severity.toLowerCase()}`}>
                    {finding.severity}
                  </span>
                  <span className="finding__id">{finding.id}</span>
                  <span className="finding__title">{finding.title}</span>
                  <Icon name="chevronDown" size={16} className="finding__chevron" />
                </summary>
                <div className="finding__detail">
                  <dl>
                    <div>
                      <dt>Evidence</dt>
                      <dd>{finding.evidence}</dd>
                    </div>
                    <div>
                      <dt>Impact</dt>
                      <dd>{finding.impact}</dd>
                    </div>
                    <div>
                      <dt>Recommendation</dt>
                      <dd>{finding.recommendation}</dd>
                    </div>
                  </dl>
                </div>
              </details>
            </li>
          ))}
        </ol>

        <p className="sample-report__note">
          Snapshot captured with the published <code>argus-header 0.8.0</code>{' '}
          against <code>example.com</code>, the IANA-reserved documentation
          domain. Targets differ, and a clean report does not prove an
          application is secure.
        </p>
      </div>
    </div>
  )
}
