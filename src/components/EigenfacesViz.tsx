import { useState } from 'react'
import './EigenfacesViz.css'

const K_ACCURACY_DATA = [
  { k: 10, ann: 42, svm: 38, rf: 40, knn: 28 },
  { k: 20, ann: 53, svm: 46, rf: 50, knn: 34 },
  { k: 30, ann: 60, svm: 51, rf: 57, knn: 39 },
  { k: 50, ann: 66, svm: 55, rf: 63, knn: 44 },
  { k: 70, ann: 65, svm: 54, rf: 62, knn: 41 },
  { k: 100, ann: 62, svm: 52, rf: 60, knn: 38 },
]

function EigenfaceCard({ index, selected, onClick }: { index: number; selected: boolean; onClick: () => void }) {
  const seed = index * 37 + 11
  const hue = 200 + ((seed * 53) % 120)
  const colors = Array.from({ length: 12 }, (_, i) => {
    const f = ((seed * (i + 1) * 7) % 360)
    const l = 10 + ((seed * (i + 3)) % 40)
    return `hsl(${hue + (f % 40) - 20}, 40%, ${l}%)`
  })

  return (
    <button
      className={`eigencard ${selected ? 'eigencard--selected' : ''}`}
      onClick={onClick}
      aria-label={`Eigenface PC${index + 1}`}
    >
      <div className="eigencard__face">
        <svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <radialGradient id={`rg-${index}`} cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor={`hsl(${hue}, 30%, 25%)`} />
              <stop offset="100%" stopColor={`hsl(${hue}, 20%, 8%)`} />
            </radialGradient>
          </defs>
          <rect width="80" height="96" fill={`url(#rg-${index})`} />
          {Array.from({ length: 20 }, (_, row) => {
            const y = (row / 19) * 96
            const pts = Array.from({ length: 16 }, (_, col) => {
              const x = (col / 15) * 80
              const amp = 8 + ((seed + row * 7) % 12)
              const f = 1.5 + ((row * 3 + seed) % 5) * 0.5
              const ph = ((row * 37 + seed) % 628) / 100
              const yOff = amp * Math.sin((col / 15) * Math.PI * f + ph)
              return `${x.toFixed(1)},${(y + yOff).toFixed(1)}`
            }).join(' ')
            const colorIdx = ((row * 3 + seed) % colors.length)
            return (
              <polyline
                key={row}
                points={pts}
                fill="none"
                stroke={colors[colorIdx]}
                strokeWidth="0.7"
                opacity="0.9"
              />
            )
          })}
          {/* Face oval overlay */}
          <ellipse cx="40" cy="46" rx="22" ry="28"
            fill="none"
            stroke={`hsla(${hue}, 50%, 50%, 0.15)`}
            strokeWidth="0.5"
          />
          {/* Eyes */}
          <ellipse cx="30" cy="36" rx="5" ry="3" fill="none" stroke={`hsla(${hue}, 60%, 60%, 0.2)`} strokeWidth="0.5" />
          <ellipse cx="50" cy="36" rx="5" ry="3" fill="none" stroke={`hsla(${hue}, 60%, 60%, 0.2)`} strokeWidth="0.5" />
        </svg>
      </div>
      <div className="eigencard__label mono">
        PC{index + 1}
      </div>
    </button>
  )
}

export default function EigenfacesViz() {
  const [selectedPc, setSelectedPc] = useState(0)
  const [kSlider, setKSlider] = useState(50)

  const currentKData = K_ACCURACY_DATA.find((d) => d.k === kSlider) ?? K_ACCURACY_DATA[3]

  const VARIANCE_EXPLAINED = [28.4, 14.2, 9.1, 6.8, 5.3, 4.1, 3.2, 2.8, 2.3, 2.0]
  const cumVariance = VARIANCE_EXPLAINED.reduce((acc, v, i) => {
    acc.push((acc[i - 1] ?? 0) + v)
    return acc
  }, [] as number[])

  return (
    <section id="eigenfaces" className="eigenfaces-section">
      <div className="section-container">
        <div className="section-header">
          <div className="section-tag">PCA Analysis</div>
          <h2 className="section-title">Eigenfaces & Components</h2>
          <p className="section-subtitle">
            Each principal component captures a different mode of variation across faces. 
            Early components encode global structure; later ones capture fine-grained detail.
          </p>
        </div>

        <div className="eigenfaces__grid-section">
          <div className="eigenfaces__grid-header">
            <span className="section-tag" style={{ marginBottom: 0 }}>Top 20 Eigenfaces</span>
            <span className="eigenfaces__grid-note">
              Hover to inspect — each represents a direction of maximum variance
            </span>
          </div>
          <div className="eigenfaces__grid">
            {Array.from({ length: 20 }, (_, i) => (
              <EigenfaceCard
                key={i}
                index={i}
                selected={selectedPc === i}
                onClick={() => setSelectedPc(i)}
              />
            ))}
          </div>
        </div>

        <div className="eigenfaces__selected-detail card">
          <div className="eigenfaces__detail-left">
            <div className="eigenfaces__detail-title mono">PC{selectedPc + 1} — Principal Component {selectedPc + 1}</div>
            <p className="eigenfaces__detail-desc">
              {selectedPc === 0
                ? 'The first principal component captures the most variance — typically overall illumination and the average "face shape" across all training images.'
                : selectedPc === 1
                ? 'PC2 captures the next most variance, often encoding left-right lighting asymmetry and gross pose variation.'
                : selectedPc < 5
                ? `PC${selectedPc + 1} encodes mid-level structural variations. Variance explained: ~${(VARIANCE_EXPLAINED[selectedPc] ?? 1.5).toFixed(1)}%`
                : `PC${selectedPc + 1} encodes fine-grained texture and expression details. Low individual variance but collectively important for discrimination.`
              }
            </p>
            <div className="eigenfaces__variance-bar">
              <span className="eigenfaces__variance-label">Variance explained</span>
              <div className="eigenfaces__variance-track">
                <div
                  className="eigenfaces__variance-fill"
                  style={{ width: `${Math.min(100, (VARIANCE_EXPLAINED[selectedPc] ?? 1.5) * 3)}%` }}
                />
              </div>
              <span className="eigenfaces__variance-val mono">
                {(VARIANCE_EXPLAINED[selectedPc] ?? 1.5).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="eigenfaces__variance-chart">
            <div className="eigenfaces__variance-chart-title">Cumulative Variance (top 10 PCs)</div>
            <div className="eigenfaces__bars">
              {VARIANCE_EXPLAINED.map((v, i) => (
                <div key={i} className="eigenfaces__bar-group">
                  <div
                    className={`eigenfaces__bar ${selectedPc === i ? 'eigenfaces__bar--selected' : ''}`}
                    style={{ height: `${v * 3}px` }}
                    onClick={() => setSelectedPc(i)}
                    title={`PC${i + 1}: ${v}%`}
                  />
                  <span className="eigenfaces__bar-label mono">{i + 1}</span>
                </div>
              ))}
            </div>
            <div className="eigenfaces__cum-line">
              <span className="eigenfaces__cum-label">Cumulative (10 PCs):</span>
              <span className="eigenfaces__cum-val mono">
                {cumVariance[9].toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="eigenfaces__k-section">
          <div className="card eigenfaces__k-card">
            <div className="eigenfaces__k-header">
              <h3 className="eigenfaces__k-title">Accuracy vs Number of Components (k)</h3>
              <span className="eigenfaces__k-sub">Drag to explore how k affects each model</span>
            </div>

            <div className="eigenfaces__k-slider-row">
              <span className="eigenfaces__k-label mono">k =</span>
              <input
                type="range"
                min={0}
                max={K_ACCURACY_DATA.length - 1}
                value={K_ACCURACY_DATA.findIndex((d) => d.k === kSlider)}
                onChange={(e) => setKSlider(K_ACCURACY_DATA[+e.target.value].k)}
                className="eigenfaces__k-slider"
              />
              <span className="eigenfaces__k-val mono">{kSlider}</span>
            </div>

            <div className="eigenfaces__k-models">
              {[
                { key: 'ann', label: 'PCA+ANN', color: '#ff6b2b' },
                { key: 'rf', label: 'PCA+RF', color: '#4da6ff' },
                { key: 'svm', label: 'PCA+SVM', color: '#00d4aa' },
                { key: 'knn', label: 'PCA+KNN', color: '#f5a623' },
              ].map((m) => (
                <div key={m.key} className="eigenfaces__k-model">
                  <div className="eigenfaces__k-model-header">
                    <span className="eigenfaces__k-model-dot" style={{ background: m.color }} />
                    <span className="eigenfaces__k-model-label">{m.label}</span>
                  </div>
                  <div className="eigenfaces__k-model-bar-track">
                    <div
                      className="eigenfaces__k-model-bar-fill"
                      style={{
                        width: `${currentKData[m.key as keyof typeof currentKData]}%`,
                        background: m.color,
                      }}
                    />
                  </div>
                  <span className="eigenfaces__k-model-val mono" style={{ color: m.color }}>
                    {currentKData[m.key as keyof typeof currentKData]}%
                  </span>
                </div>
              ))}
            </div>

            <p className="eigenfaces__k-insight">
              <strong>Insight:</strong> k=50 is the sweet spot — more components don't improve accuracy and can 
              introduce noise. This is the classic PCA bias-variance tradeoff in feature selection.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
