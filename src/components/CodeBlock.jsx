import CopyButton from './CopyButton'

export default function CodeBlock({
  code,
  language = 'text',
  filename,
  caption,
  showCopy = true,
  className = '',
}) {
  const value = String(code).replace(/\n$/, '')

  return (
    <figure className={`code-block${className ? ` ${className}` : ''}`}>
      {(filename || showCopy) && (
        <div className="code-block__bar">
          <span className="code-block__filename">
            {filename || (language === 'bash' ? 'shell' : language)}
          </span>
          {showCopy && <CopyButton value={value} label={`Copy ${filename || 'code'}`} />}
        </div>
      )}
      <pre className="code-block__pre" tabIndex={0} aria-label={`${filename || language} code`}>
        <code data-language={language}>{value}</code>
      </pre>
      {caption && <figcaption className="code-block__caption">{caption}</figcaption>}
    </figure>
  )
}
