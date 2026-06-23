import { GitBranch, ExternalLink, BookOpen, ChevronDown } from 'lucide-react'
import './Hero.css'

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="hero">
      <div className="hero__bg">
        <div className="hero__grid" />
        <div className="hero__glow hero__glow--1" />
        <div className="hero__glow hero__glow--2" />
      </div>

      <div className="hero__inner section-container">
        <div className="hero__content">
          <div className="hero__badges">
            <span className="badge badge-muted">
              <span className="mono">v1.0</span>
            </span>
          </div>

          <h1 className="hero__title">
            <span className="gradient-text">EigenVision</span>
            <br />
            Face Recognition
            <br />
            Benchmark System
          </h1>

          <p className="hero__description">
            A rigorous multi-model face recognition benchmark using PCA / Eigenfaces 
            as the feature extractor, evaluated across four classifiers — including 
            a hand-built neural network trained with pure NumPy — with full biometric 
            evaluation: FAR, FRR, and EER.
          </p>

          <div className="hero__stats">
            {[
              { label: 'PCA + ANN', value: '65.9%', sub: 'Top accuracy' },
              { label: 'Dataset', value: '450', sub: '9 subjects' },
              { label: 'Impostors', value: '2', sub: 'EER ~24.9%' },
              { label: 'Classifiers', value: '4', sub: 'Benchmarked' },
            ].map((s) => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat-value">{s.value}</span>
                <span className="hero__stat-label">{s.label}</span>
                <span className="hero__stat-sub">{s.sub}</span>
              </div>
            ))}
          </div>

          <div className="hero__actions">
            <a
              href="https://github.com/siri159/EigenVision"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <GitBranch size={16} />
              View on GitHub
            </a>
            <button className="btn btn-outline" onClick={() => scrollTo('demo')}>
              <ExternalLink size={15} />
              Try the Demo
            </button>
            <button className="btn btn-outline" onClick={() => scrollTo('benchmark')}>
              <BookOpen size={15} />
              Results
            </button>
          </div>

          <div className="hero__tech-stack">
            <span className="hero__tech-label">Built with</span>
            {['Python', 'NumPy', 'OpenCV', 'SciPy', 'scikit-learn', 'Gradio'].map((t) => (
              <span key={t} className="hero__tech-tag mono">{t}</span>
            ))}
          </div>
        </div>

        <div className="hero__visual">
          <EigenfaceGrid />
        </div>
      </div>

      <button
        className="hero__scroll-indicator"
        onClick={() => scrollTo('overview')}
        aria-label="Scroll down"
      >
        <ChevronDown size={20} />
      </button>
    </section>
  )
}

function EigenfaceGrid() {
  const rows = 4
  const cols = 5

  const cells = Array.from({ length: rows * cols }, (_, i) => {
    const seed = i * 7 + 13
    return {
      brightness: 30 + ((seed * 37) % 50),
      contrast: ((seed * 17) % 40),
      hue: ((seed * 53) % 60) - 30,
    }
  })

  return (
    <div className="eigenface-grid">
      <div className="eigenface-grid__label">
        <span className="mono">eigenfaces</span>
        <span className="eigenface-grid__count">Top {rows * cols} principal components</span>
      </div>
      <div className="eigenface-grid__cells" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cells.map((cell, i) => (
          <div
            key={i}
            className="eigenface-cell"
            style={{
              '--brightness': `${cell.brightness}%`,
              '--contrast': `${cell.contrast}%`,
              '--index': i,
            } as React.CSSProperties}
          >
            <div className="eigenface-cell__inner">
              <EigenfaceSVG index={i} />
            </div>
            <span className="eigenface-cell__label mono">PC{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EigenfaceSVG({ index }: { index: number }) {
  const seed = index * 31 + 7
  const freq1 = 1.2 + (seed % 8) * 0.3
  const freq2 = 2.1 + ((seed * 7) % 6) * 0.4
  const phase1 = (seed % 628) / 100
  const phase2 = ((seed * 13) % 628) / 100

  const points = Array.from({ length: 20 }, (_, j) => {
    const t = j / 19
    const x = t * 100
    const y =
      50 +
      20 * Math.sin(t * Math.PI * freq1 + phase1) +
      10 * Math.cos(t * Math.PI * freq2 + phase2)
    return `${x},${y}`
  }).join(' ')

  const hue = 200 + ((seed * 53) % 120)
  const saturation = 30 + ((seed * 17) % 40)

  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="eigenface-svg">
      <defs>
        <filter id={`blur-${index}`}>
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      <rect width="100" height="100" fill={`hsl(${hue}, ${saturation}%, 8%)`} />
      {Array.from({ length: 8 }, (_, k) => {
        const yk = (k / 7) * 80 + 10
        const amp = 15 + ((seed + k * 11) % 20)
        const f = 1.5 + ((k * 3 + seed) % 5) * 0.5
        const ph = ((k * 37 + seed) % 628) / 100
        const pts = Array.from({ length: 15 }, (_, j) => {
          const t = j / 14
          const x = t * 100
          const y = yk + amp * Math.sin(t * Math.PI * f + ph)
          return `${x.toFixed(1)},${y.toFixed(1)}`
        }).join(' ')
        const lightness = 15 + ((k * 7 + seed) % 35)
        return (
          <polyline
            key={k}
            points={pts}
            fill="none"
            stroke={`hsl(${hue}, ${saturation + 10}%, ${lightness}%)`}
            strokeWidth="0.8"
            opacity="0.7"
          />
        )
      })}
      <polyline
        points={points}
        fill="none"
        stroke={`hsl(${hue}, 80%, 60%)`}
        strokeWidth="1.2"
        opacity="0.5"
        filter={`url(#blur-${index})`}
      />
    </svg>
  )
}
