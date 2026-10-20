import { Link } from 'react-router-dom'
import Icon from './Icon'

export function ExternalLink({ href, children, className = '', showIcon = true }) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      {showIcon && <Icon name="external" size={13} className="external-icon" />}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  )
}

export function ButtonLink({
  to,
  href,
  children,
  variant = 'primary',
  size = 'md',
  icon = 'arrowRight',
  className = '',
  external = false,
}) {
  const classes = `button button--${variant} button--${size}${className ? ` ${className}` : ''}`
  const content = (
    <>
      <span>{children}</span>
      {icon && <Icon name={icon} size={16} />}
    </>
  )

  if (to) {
    return (
      <Link className={classes} to={to}>
        {content}
      </Link>
    )
  }

  return (
    <a
      className={classes}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
      {external && <span className="visually-hidden"> (opens in a new tab)</span>}
    </a>
  )
}

export function Pill({ children, tone = 'neutral', className = '' }) {
  return <span className={`pill pill--${tone}${className ? ` ${className}` : ''}`}>{children}</span>
}
