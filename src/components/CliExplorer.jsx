import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CodeBlock from './CodeBlock'
import CopyButton from './CopyButton'
import Icon from './Icon'
import Terminal from './Terminal'
import { CLI_EXAMPLES } from '../data/cli'

export default function CliExplorer() {
  const [active, setActive] = useState(CLI_EXAMPLES[0].id)
  const tabRefs = useRef([])
  const currentIndex = CLI_EXAMPLES.findIndex((item) => item.id === active)
  const current = CLI_EXAMPLES[currentIndex]

  function select(index) {
    setActive(CLI_EXAMPLES[index].id)
  }

  function onKeyDown(event) {
    let nextIndex = currentIndex
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % CLI_EXAMPLES.length
    else if (event.key === 'ArrowLeft')
      nextIndex = (currentIndex - 1 + CLI_EXAMPLES.length) % CLI_EXAMPLES.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = CLI_EXAMPLES.length - 1
    else return

    event.preventDefault()
    select(nextIndex)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="cli-explorer">
      <div className="cli-explorer__tabs-wrap">
        <div
          className="cli-explorer__tabs"
          role="tablist"
          aria-label="Argus Header CLI examples"
          onKeyDown={onKeyDown}
        >
          {CLI_EXAMPLES.map((example, index) => (
            <button
              key={example.id}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              type="button"
              role="tab"
              id={`cli-tab-${example.id}`}
              aria-selected={active === example.id}
              aria-controls={`cli-panel-${example.id}`}
              tabIndex={active === example.id ? 0 : -1}
              className={`cli-explorer__tab${active === example.id ? ' is-active' : ''}`}
              onClick={() => select(index)}
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="cli-explorer__panel"
        role="tabpanel"
        id={`cli-panel-${current.id}`}
        aria-labelledby={`cli-tab-${current.id}`}
        tabIndex={0}
      >
        <div className="cli-explorer__command">
          <span className="cli-explorer__prompt" aria-hidden="true">
            $
          </span>
          <code>{current.command}</code>
          <CopyButton
            value={current.command}
            label="Copy command"
            compact
            className="cli-explorer__copy"
          />
        </div>

        <div className="cli-explorer__output">
          {current.output.kind === 'terminal' ? (
            <Terminal
              lines={current.output.lines}
              title={current.output.title}
              badge="ILLUSTRATIVE OUTPUT"
              note="Illustrative transcript, not a live scan. Findings and score come from a captured v0.8.0 scan; the layout is condensed."
            />
          ) : (
            <CodeBlock
              code={current.output.code}
              language={current.output.language}
              filename={current.output.filename}
            />
          )}
        </div>

        <div className="cli-explorer__info">
          <p>{current.description}</p>
          <Link className="text-link" to={current.docs}>
            Read the reference
            <Icon name="arrowRight" size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
