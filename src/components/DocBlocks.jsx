import { Link } from 'react-router-dom'
import Icon from './Icon'

export function Eyebrow({ index, children, className = '' }) {
  return (
    <p className={`eyebrow${className ? ` ${className}` : ''}`}>
      {index && <span className="eyebrow__index">{index}</span>}
      <span className="eyebrow__dot" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

export function SectionHeading({ id, index, label, title, lead, align = 'split' }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <div>
        <Eyebrow index={index}>{label}</Eyebrow>
        <h2 id={id}>{title}</h2>
      </div>
      {lead && <p className="section-heading__lead">{lead}</p>}
    </div>
  )
}

export function DocHeader({ eyebrow = 'Documentation', title, lead, actions }) {
  return (
    <header className="doc-header">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      {lead && <p className="doc-header__lead">{lead}</p>}
      {actions && <div className="doc-header__actions">{actions}</div>}
    </header>
  )
}

export function DocSection({ id, title, kicker, children, className = '' }) {
  return (
    <section className={`doc-section${className ? ` ${className}` : ''}`} aria-labelledby={id}>
      {kicker && <p className="doc-section__kicker">{kicker}</p>}
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  )
}

export function DocSubheading({ id, children, level = 3 }) {
  const Tag = `h${level}`
  return (
    <Tag className="doc-subheading" id={id}>
      {children}
    </Tag>
  )
}

export function Callout({ tone = 'info', title, children, icon }) {
  const iconName = icon || (tone === 'warning' ? 'alert' : tone === 'danger' ? 'alert' : 'info')
  return (
    <aside className={`callout callout--${tone}`} role="note">
      <span className="callout__icon" aria-hidden="true">
        <Icon name={iconName} size={18} />
      </span>
      <div>
        {title && <p className="callout__title">{title}</p>}
        <div className="callout__body">{children}</div>
      </div>
    </aside>
  )
}

export function DocTable({ caption, head, rows, className = '' }) {
  return (
    <div className={`table-wrap${className ? ` ${className}` : ''}`}>
      <table>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th key={cellIndex} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={cellIndex}>{cell}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DocTOC({ items, label = 'On this page' }) {
  return (
    <nav className="doc-toc" aria-label={label}>
      <p className="doc-toc__label">{label}</p>
      <ol>
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function DocPager({ prev, next }) {
  return (
    <nav className="doc-pager" aria-label="Documentation pagination">
      {prev ? (
        <Link className="doc-pager__link doc-pager__link--prev" to={prev.to}>
          <span className="doc-pager__direction">
            <Icon name="arrowLeft" size={14} /> Previous
          </span>
          <span className="doc-pager__title">{prev.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="doc-pager__link doc-pager__link--next" to={next.to}>
          <span className="doc-pager__direction">
            Next <Icon name="arrowRight" size={14} />
          </span>
          <span className="doc-pager__title">{next.label}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

export function StepList({ steps }) {
  return (
    <ol className="step-list">
      {steps.map((step) => (
        <li className="step-list__item" key={step.title}>
          <span className="step-list__index">{step.index}</span>
          <div>
            <h3>{step.title}</h3>
            {step.body && <p>{step.body}</p>}
            {step.children}
          </div>
        </li>
      ))}
    </ol>
  )
}
