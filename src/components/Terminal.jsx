import CopyButton from './CopyButton'

export default function Terminal({
  lines,
  title = 'argus-header — sample session',
  badge = 'SAMPLE OUTPUT',
  copyValue,
  note,
  stats,
  className = '',
  showSweep = false,
}) {
  return (
    <div className={`terminal${className ? ` ${className}` : ''}`}>
      <div className="terminal__bar">
        <span className="terminal__lights" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="terminal__title">{title}</span>
        <span className="terminal__badge">{badge}</span>
        {copyValue && (
          <CopyButton value={copyValue} label="Copy command" compact className="terminal__copy" />
        )}
      </div>
      <div className="terminal__body">
        {showSweep && <span className="terminal__sweep" aria-hidden="true" />}
        <pre
          className="terminal__output"
          tabIndex={0}
          aria-label={`${title} output`}
        >
          {lines.map((line, index) => (
            <span
              className={`terminal__line terminal__line--${line.tone || 'text'}`}
              key={`${index}-${line.text}`}
            >
              {line.text || '\u00A0'}
            </span>
          ))}
        </pre>
      </div>
      {stats?.length > 0 && (
        <div className="terminal__stats">
          {stats.map((stat) => (
            <span className="terminal__stat" key={stat.label}>
              <strong>{stat.value}</strong> {stat.label}
            </span>
          ))}
        </div>
      )}
      {note && <p className="terminal__note">{note}</p>}
    </div>
  )
}
