import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

function legacyCopy(text) {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.inset = '0 auto auto -9999px'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  const copied = document.execCommand('copy')
  area.remove()
  if (!copied) throw new Error('Copy command was rejected')
}

export default function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied',
  className = '',
  compact = false,
}) {
  const [status, setStatus] = useState('idle')
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function handleCopy() {
    window.clearTimeout(timer.current)
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        legacyCopy(value)
      }
      setStatus('copied')
    } catch {
      try {
        legacyCopy(value)
        setStatus('copied')
      } catch {
        setStatus('error')
      }
    }
    timer.current = window.setTimeout(() => setStatus('idle'), 2200)
  }

  const text = status === 'copied' ? copiedLabel : status === 'error' ? 'Copy failed' : label

  return (
    <button
      type="button"
      className={`copy-button${compact ? ' copy-button--compact' : ''}${className ? ` ${className}` : ''}`}
      data-status={status}
      onClick={handleCopy}
      aria-label={compact ? `${label} to clipboard` : text}
    >
      <Icon name={status === 'copied' ? 'check' : 'copy'} size={14} />
      {!compact && <span>{text}</span>}
      <span className="visually-hidden" role="status" aria-live="polite">
        {status === 'copied'
          ? 'Copied to clipboard.'
          : status === 'error'
            ? 'Copy failed. Select the text manually.'
            : ''}
      </span>
    </button>
  )
}
