import Icon from './Icon'
import { LINKS } from '../data/site'
import useGitHubStars from '../lib/useGitHubStars'

const compactNumber = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const exactNumber = new Intl.NumberFormat('en-US')

function formatStars(count) {
  if (count === null) return '—'
  return count >= 10000 ? compactNumber.format(count) : exactNumber.format(count)
}

export default function GitHubStars({ className = '' }) {
  const { count, status } = useGitHubStars()
  const value = formatStars(count)

  return (
    <a
      className={`nav__stars${className ? ` ${className}` : ''}`}
      href={LINKS.github}
      target="_blank"
      rel="noopener noreferrer"
      data-status={status}
      title={count === null ? 'View the GitHub repository' : `${value} GitHub stars`}
    >
      <Icon name="star" size={14} />
      <span className="visually-hidden">GitHub stars: </span>
      <span className="nav__stars-count">{value}</span>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  )
}
