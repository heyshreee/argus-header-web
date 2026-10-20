import Icon from './Icon'

const STEPS = [
  {
    number: '01',
    label: 'Target',
    detail: 'A URL, normalized to https:// when no scheme is supplied.',
    icon: 'crosshair',
  },
  {
    number: '02',
    label: 'Request',
    detail: 'requests.Session with GET or HEAD, optional redirects and up to three retries on transient failures.',
    icon: 'terminal',
  },
  {
    number: '03',
    label: 'Headers',
    detail: 'The response headers are collected and normalized to lowercase names for case-insensitive rules.',
    icon: 'layers',
  },
  {
    number: '04',
    label: 'Rules',
    detail: 'Nine rule families run independently: CSP, CORS, cookies, HSTS, cache, cross-origin, referrer, permissions and base headers.',
    icon: 'scan',
  },
  {
    number: '05',
    label: 'Report',
    detail: 'Findings are scored by category and rendered to the terminal, JSON, SARIF, Markdown or HTML.',
    icon: 'file',
  },
]

export default function ArchitectureFlow() {
  return (
    <div className="architecture">
      <ol className="architecture__flow" aria-label="Scan pipeline">
        {STEPS.map((step) => (
          <li className="architecture__step" key={step.number}>
            <span className="architecture__index">{step.number}</span>
            <span className="architecture__icon" aria-hidden="true">
              <Icon name={step.icon} size={19} />
            </span>
            <h3>{step.label}</h3>
            <p>{step.detail}</p>
          </li>
        ))}
      </ol>

      <div className="scope">
        <div className="scope__column">
          <div className="scope__heading scope__heading--yes">
            <Icon name="check" size={15} />
            In scope
          </div>
          <ul>
            <li>One HTTP response per target</li>
            <li>Response-header parsing and rule evaluation</li>
            <li>Rule-based score and letter grade</li>
            <li>Terminal, JSON, SARIF, Markdown and HTML output</li>
            <li>CI exit codes and saved-report comparison</li>
          </ul>
        </div>
        <div className="scope__column">
          <div className="scope__heading scope__heading--no">
            <Icon name="close" size={15} />
            Not in scope
          </div>
          <ul>
            <li>Browser rendering or JavaScript execution</li>
            <li>Crawling, authenticated sessions or asset discovery</li>
            <li>Active exploitation or proof-of-concept payloads</li>
            <li>TLS certificates, HTTP/2 detection or full pentesting</li>
            <li>A guarantee that a site is secure</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
