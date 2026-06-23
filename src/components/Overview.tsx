import { Brain, Layers, ShieldCheck, BarChart3, Database, Zap } from 'lucide-react'
import './Overview.css'

const FEATURES = [
  {
    icon: <Layers size={20} />,
    title: 'PCA from Scratch',
    desc: 'Surrogate covariance trick for efficient eigendecomposition on high-dimensional 112×92 pixel images. No sklearn PCA — pure NumPy.',
    tag: 'Core',
  },
  {
    icon: <Brain size={20} />,
    title: 'Hand-built ANN',
    desc: 'Feedforward neural network implemented in NumPy only. Manual forward pass, backpropagation, and gradient descent with softmax output.',
    tag: 'Custom',
  },
  {
    icon: <BarChart3 size={20} />,
    title: 'Multi-model Benchmark',
    desc: 'PCA+ANN, PCA+SVM, PCA+KNN, and PCA+Random Forest evaluated on identical features. Fair, apples-to-apples comparison.',
    tag: 'Benchmark',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Biometric Evaluation',
    desc: 'FAR, FRR, and EER computed via ROC analysis on an impostor set (2 unseen people). No arbitrary thresholds — optimal threshold from curve.',
    tag: 'Metrics',
  },
  {
    icon: <Database size={20} />,
    title: '450 Image Dataset',
    desc: '9 subjects, ~50 images each, grayscale 112×92. Includes a held-out impostor folder for biometric verification testing.',
    tag: 'Data',
  },
  {
    icon: <Zap size={20} />,
    title: 'Standardization Fix',
    desc: 'Critical finding: without standardizing PCA signatures, ANN accuracy was ~12% (random). After z-score normalization: 66%. A hard-learned lesson.',
    tag: 'Insight',
    highlight: true,
  },
]

export default function Overview() {
  return (
    <section id="overview" className="overview">
      <div className="section-container">
        <div className="section-header">
          <div className="section-tag">Project Overview</div>
          <h2 className="section-title">Not just another PCA demo</h2>
          <p className="section-subtitle">
            Unlike most student eigenfaces projects that stop at "can PCA recognize faces" 
            (answered by Turk & Pentland in 1991), EigenVision benchmarks four classifiers 
            with proper biometric evaluation metrics.
          </p>
        </div>

        <div className="overview__grid">
          {FEATURES.map((f) => (
            <div key={f.title} className={`card card-orange-glow overview__card ${f.highlight ? 'overview__card--highlight' : ''}`}>
              <div className="overview__card-header">
                <div className="overview__icon">{f.icon}</div>
                <span className="badge badge-muted">{f.tag}</span>
              </div>
              <h3 className="overview__card-title">{f.title}</h3>
              <p className="overview__card-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="overview__context">
          <div className="overview__context-inner">
            <div className="overview__context-line">
              <span className="mono overview__context-key">paper</span>
              <span className="overview__context-val">Turk & Pentland, 1991 — "Eigenfaces for Recognition"</span>
            </div>
            <div className="overview__context-line">
              <span className="mono overview__context-key">deployment</span>
              <span className="overview__context-val">Hugging Face Spaces (CPU, recognition-only public demo)</span>
            </div>
            <div className="overview__context-line">
              <span className="mono overview__context-key">repo</span>
              <a
                href="https://github.com/siri159/EigenVision"
                target="_blank"
                rel="noopener noreferrer"
                className="overview__context-link"
              >
                github.com/siri159/EigenVision
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
