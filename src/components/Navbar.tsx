import { useState, useEffect } from 'react'
import { GitBranch, ExternalLink, Menu, X } from 'lucide-react'
import './Navbar.css'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'methodology', label: 'Methodology' },
  { id: 'benchmark', label: 'Benchmark' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'demo', label: 'Demo' },
]

interface Props {
  activeSection: string
}

export default function Navbar({ activeSection }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <button className="navbar__brand" onClick={() => scrollTo('hero')}>
          <span className="navbar__brand-icon">E</span>
          <span className="navbar__brand-text">EigenVision</span>
        </button>

        <ul className="navbar__links">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                className={`navbar__link ${activeSection === item.id ? 'navbar__link--active' : ''}`}
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          <a
            href="https://github.com/siri159/EigenVision"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__action-btn"
            aria-label="GitHub"
          >
            <GitBranch size={16} />
            <span>GitHub</span>
          </a>
          <a
            href="https://huggingface.co/spaces"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__action-btn navbar__action-btn--primary"
          >
            <ExternalLink size={14} />
            <span>Live Demo</span>
          </a>
        </div>

        <button
          className="navbar__mobile-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="navbar__mobile-menu">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`navbar__mobile-link ${activeSection === item.id ? 'navbar__mobile-link--active' : ''}`}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
