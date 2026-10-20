export function ArgusMark({ size = 30, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="Argus Header mark"
    >
      <rect x="1" y="1" width="30" height="30" fill="#000000" />
      <rect x="1" y="1" width="30" height="30" fill="none" stroke="#374151" />
      <path
        d="M6.5 16c3.2-4.8 15.8-4.8 19 0-3.2 4.8-15.8 4.8-19 0Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="3.1" fill="#22C55E" />
      <circle cx="16" cy="16" r="1.1" fill="#000000" />
      <path
        d="M16 5.5v3M16 23.5v3M5.5 16h3M23.5 16h3"
        stroke="#6B7280"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  )
}

export default function Logo({ compact = false, className = '' }) {
  return (
    <span className={`brand${className ? ` ${className}` : ''}`}>
      <span className="brand__lights" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      {!compact && (
        <span className="brand__type">
          <span className="brand__word">ARGUS</span>{' '}
          <span className="brand__sub">CLI</span>
        </span>
      )}
    </span>
  )
}
