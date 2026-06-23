import { useState } from 'react'
import { Upload, Camera, User, AlertCircle, CheckCircle, RefreshCw, ExternalLink } from 'lucide-react'
import './Demo.css'

const PEOPLE = [
  'Abdullah Al Mamun', 'Adriana Lima', 'Alex Rodriguez',
  'Barbara Bush', 'Carlos Mendez', 'Diana Chen',
  'Ethan Williams', 'Fatima Al-Zahra', 'George Harrison',
]

const SAMPLE_IMAGES = [
  { label: 'Face A', hue: 210 },
  { label: 'Face B', hue: 30 },
  { label: 'Face C', hue: 160 },
  { label: 'Face D', hue: 280 },
  { label: 'Face E', hue: 0 },
  { label: 'Face F', hue: 70 },
]

function generateFaceHue(hue: number) {
  return {
    skin: `hsl(${hue + 20}, 25%, 55%)`,
    hair: `hsl(${hue}, 40%, 25%)`,
    bg: `hsl(${hue}, 30%, 12%)`,
  }
}

function FaceSVG({ hue, size = 120 }: { hue: number; size?: number }) {
  const colors = generateFaceHue(hue)
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" fill={colors.bg} rx="8" />
      {/* Hair */}
      <ellipse cx="60" cy="28" rx="30" ry="20" fill={colors.hair} />
      <rect x="30" y="28" width="60" height="10" fill={colors.hair} />
      {/* Face */}
      <ellipse cx="60" cy="65" rx="26" ry="32" fill={colors.skin} />
      {/* Eyes */}
      <ellipse cx="50" cy="58" rx="5" ry="4" fill="white" />
      <ellipse cx="70" cy="58" rx="5" ry="4" fill="white" />
      <circle cx="51" cy="58" r="2.5" fill="#333" />
      <circle cx="71" cy="58" r="2.5" fill="#333" />
      {/* Nose */}
      <ellipse cx="60" cy="67" rx="3" ry="2" fill={`hsl(${hue + 10}, 20%, 45%)`} />
      {/* Mouth */}
      <path d="M 52 76 Q 60 80 68 76" stroke={`hsl(${hue}, 25%, 40%)`} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Ears */}
      <ellipse cx="34" cy="65" rx="4" ry="6" fill={colors.skin} />
      <ellipse cx="86" cy="65" rx="4" ry="6" fill={colors.skin} />
    </svg>
  )
}

type PredictionResult = {
  predicted: string
  confidence: number
  scores: { name: string; score: number }[]
  isImpostor: boolean
}

function runSimulatedPrediction(imageIndex: number): PredictionResult {
  const assignedPerson = PEOPLE[imageIndex % PEOPLE.length]
  const topConf = 0.45 + (imageIndex * 7 % 30) / 100
  const isImpostor = imageIndex === 4

  if (isImpostor) {
    const scores = PEOPLE.map((name) => ({
      name,
      score: 0.05 + Math.random() * 0.12,
    })).sort((a, b) => b.score - a.score)
    return {
      predicted: scores[0].name,
      confidence: scores[0].score,
      scores,
      isImpostor: true,
    }
  }

  const scores = PEOPLE.map((name) => {
    if (name === assignedPerson) return { name, score: topConf }
    return { name, score: 0.02 + Math.abs(Math.sin(name.length * imageIndex)) * 0.15 }
  }).sort((a, b) => b.score - a.score)

  return {
    predicted: assignedPerson,
    confidence: topConf,
    scores,
    isImpostor: false,
  }
}

export default function Demo() {
  const [selectedSample, setSelectedSample] = useState<number | null>(null)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadedHue, setUploadedHue] = useState<number | null>(null)

  const handleSampleSelect = (index: number) => {
    setSelectedSample(index)
    setResult(null)
    setUploadedHue(null)
  }

  const handleRecognize = () => {
    if (selectedSample === null && uploadedHue === null) return
    setLoading(true)
    setTimeout(() => {
      const idx = selectedSample ?? 2
      setResult(runSimulatedPrediction(idx))
      setLoading(false)
    }, 1200)
  }

  const handleUpload = () => {
    const hue = Math.floor(Math.random() * 360)
    setUploadedHue(hue)
    setSelectedSample(null)
    setResult(null)
  }

  const handleReset = () => {
    setSelectedSample(null)
    setResult(null)
    setUploadedHue(null)
  }

  const hasInput = selectedSample !== null || uploadedHue !== null

  return (
    <section id="demo" className="demo-section">
      <div className="section-container">
        <div className="section-header">
          <div className="section-tag">Interactive Demo</div>
          <h2 className="section-title">Try It Out</h2>
          <p className="section-subtitle">
            Simulated face recognition using the PCA+ANN pipeline.
            Select a sample face or upload your own to see how the model predicts.
          </p>
        </div>

        <div className="demo__notice">
          <AlertCircle size={14} />
          <span>
            This is a <strong>UI simulation</strong> of the model's behavior. 
            The live model runs on{' '}
            <a href="https://huggingface.co/spaces" target="_blank" rel="noopener noreferrer">
              Hugging Face Spaces
            </a>
            .
          </span>
        </div>

        <div className="demo__layout">
          <div className="demo__input-panel card">
            <div className="demo__panel-title">Input</div>

            <div className="demo__samples-label">Sample faces from dataset</div>
            <div className="demo__samples">
              {SAMPLE_IMAGES.map((s, i) => (
                <button
                  key={i}
                  className={`demo__sample ${selectedSample === i ? 'demo__sample--selected' : ''}`}
                  onClick={() => handleSampleSelect(i)}
                  aria-label={s.label}
                >
                  <FaceSVG hue={s.hue} size={64} />
                  <span className="demo__sample-label mono">{s.label}</span>
                  {i === 4 && <span className="demo__sample-impostor">impostor</span>}
                </button>
              ))}
            </div>

            <div className="demo__divider">
              <span>or</span>
            </div>

            <button className="demo__upload-btn" onClick={handleUpload}>
              <Upload size={16} />
              Simulate upload
            </button>

            {uploadedHue !== null && (
              <div className="demo__uploaded">
                <FaceSVG hue={uploadedHue} size={56} />
                <span className="demo__uploaded-label">Uploaded face</span>
              </div>
            )}

            <div className="demo__actions">
              <button
                className="btn btn-primary demo__run-btn"
                disabled={!hasInput || loading}
                onClick={handleRecognize}
              >
                {loading ? (
                  <>
                    <RefreshCw size={15} className="spin" />
                    Running PCA+ANN...
                  </>
                ) : (
                  <>
                    <Camera size={15} />
                    Recognize Face
                  </>
                )}
              </button>
              {hasInput && (
                <button className="btn btn-outline" onClick={handleReset}>
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="demo__output-panel card">
            <div className="demo__panel-title">Output</div>

            {!result && !loading && (
              <div className="demo__placeholder">
                <div className="demo__placeholder-icon">
                  <User size={32} />
                </div>
                <span>Select a face and click "Recognize Face"</span>
              </div>
            )}

            {loading && (
              <div className="demo__loading">
                <div className="demo__loading-steps">
                  {['Preprocessing image...', 'Computing PCA projection...', 'ANN forward pass...', 'Softmax output...'].map((step, i) => (
                    <div key={step} className="demo__loading-step" style={{ animationDelay: `${i * 250}ms` }}>
                      <div className="demo__loading-dot" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="demo__result">
                <div className={`demo__result-verdict ${result.isImpostor ? 'demo__result-verdict--reject' : 'demo__result-verdict--accept'}`}>
                  {result.isImpostor ? (
                    <>
                      <AlertCircle size={18} />
                      <span>Low confidence — possible impostor</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      <span>Match found</span>
                    </>
                  )}
                </div>

                <div className="demo__result-prediction">
                  <div className="demo__result-name">{result.predicted}</div>
                  <div className="demo__result-conf">
                    <span className="demo__result-conf-label">Confidence</span>
                    <span className="demo__result-conf-val mono" style={{ color: result.isImpostor ? '#ef4444' : '#ff6b2b' }}>
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="demo__scores-title">Per-class confidence scores</div>
                <div className="demo__scores">
                  {result.scores.slice(0, 6).map((s, i) => (
                    <div key={s.name} className={`demo__score-row ${i === 0 ? 'demo__score-row--top' : ''}`}>
                      <span className="demo__score-name">{s.name}</span>
                      <div className="demo__score-track">
                        <div
                          className="demo__score-fill"
                          style={{
                            width: `${(s.score * 100 / result.scores[0].score) * 100}%`,
                            background: i === 0 ? (result.isImpostor ? '#ef4444' : '#ff6b2b') : 'var(--bg-elevated)',
                          }}
                        />
                      </div>
                      <span className="demo__score-val mono">
                        {(s.score * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="demo__hf-cta card">
          <div className="demo__hf-left">
            <div className="demo__hf-title">Full model on Hugging Face Spaces</div>
            <p className="demo__hf-desc">
              The actual PCA+ANN model runs on a Gradio web app with webcam support, 
              real-time recognition, and per-person confidence bars.
            </p>
          </div>
          <a
            href="https://huggingface.co/spaces"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <ExternalLink size={15} />
            Open on Hugging Face
          </a>
        </div>
      </div>
    </section>
  )
}
