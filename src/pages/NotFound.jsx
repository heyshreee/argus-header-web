import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { Eyebrow } from '../components/DocBlocks'

export default function NotFound() {
  return (
    <div className="container not-found">
      <div className="not-found__code" aria-hidden="true">
        404
      </div>
      <div className="not-found__body">
        <Eyebrow>Page not found</Eyebrow>
        <h1>That header is not in the response.</h1>
        <p>
          The page you requested does not exist, or it has moved. The
          documentation and the homepage are good places to pick up the trail.
        </p>
        <div className="not-found__actions">
          <Link className="button button--primary button--md" to="/">
            Back to home
            <Icon name="arrowRight" size={16} />
          </Link>
          <Link className="button button--secondary button--md" to="/docs">
            Read the docs
            <Icon name="book" size={16} />
          </Link>
        </div>
        <div className="not-found__links">
          <Link className="text-link" to="/docs/installation">Installation</Link>
          <Link className="text-link" to="/docs/cli-reference">CLI reference</Link>
          <Link className="text-link" to="/docs/security-checks">Security checks</Link>
          <Link className="text-link" to="/changelog">Changelog</Link>
        </div>
      </div>
    </div>
  )
}
