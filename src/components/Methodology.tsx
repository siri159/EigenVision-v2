import { useState } from 'react'
import './Methodology.css'

const STEPS = [
  {
    id: 'load',
    step: '01',
    title: 'Load & Preprocess',
    desc: 'Load 450 grayscale 112×92 images. Flatten each to a 10,304-dim vector. Stack into matrix X (450 × 10,304).',
    code: `# Flatten image to 1D vector
img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
img = cv2.resize(img, (92, 112))
flat = img.flatten()  # shape: (10304,)

# Stack all images
X = np.array([flatten(p) for p in paths])
# X.shape → (450, 10304)`,
  },
  {
    id: 'pca',
    step: '02',
    title: 'Surrogate PCA',
    desc: 'Computing eigen-decomposition on a 10,304×10,304 matrix is infeasible. Instead: compute surrogate covariance L = AᵀA (450×450), solve eigenvectors, project back.',
    code: `mean_face = X.mean(axis=0)
A = X - mean_face            # (450, 10304)

# Surrogate trick: 450×450 is tractable
L = A @ A.T                  # (450, 450)
eigenvalues, V = eigh(L)

# Project eigenvectors back to image space
U = A.T @ V                  # (10304, 450)
U = U / np.linalg.norm(U, axis=0)

# Project faces into eigenspace
W = A @ U[:, :k]             # (450, k)`,
  },
  {
    id: 'std',
    step: '03',
    title: 'Standardize Features',
    desc: 'Critical step. PCA signatures have wildly different scales per component. Z-score normalization brings all components to unit variance — the difference between 12% and 66% accuracy.',
    code: `# Without this: ANN ~12% (near-random)
# With this: ANN ~66%

scaler = StandardScaler()
W_train = scaler.fit_transform(W_train)
W_test  = scaler.transform(W_test)`,
    highlight: true,
  },
  {
    id: 'ann',
    step: '04',
    title: 'Hand-built ANN',
    desc: 'Feedforward net: k→256→128→9 neurons. ReLU hidden activations, Softmax output. Manual backprop, cross-entropy loss, mini-batch SGD — zero sklearn/PyTorch.',
    code: `class NeuralNetwork:
  def forward(self, X):
    self.z1 = X @ self.W1 + self.b1
    self.a1 = relu(self.z1)
    self.z2 = self.a1 @ self.W2 + self.b2
    self.a2 = relu(self.z2)
    self.z3 = self.a2 @ self.W3 + self.b3
    return softmax(self.z3)      # (N, 9)

  def backward(self, X, y, lr):
    # Manual cross-entropy + backprop
    dL_dz3 = self.out - y        # (N, 9)
    dW3 = self.a2.T @ dL_dz3
    ...`,
  },
  {
    id: 'bench',
    step: '05',
    title: 'Multi-model Benchmark',
    desc: 'Same PCA features (same k, same scaler) fed into SVM, KNN, and Random Forest. Identical train/test split. Fair comparison.',
    code: `models = {
  'SVM':  SVC(kernel='rbf', C=1.0, probability=True),
  'KNN':  KNeighborsClassifier(n_neighbors=5),
  'RF':   RandomForestClassifier(n_estimators=100),
}
for name, clf in models.items():
  clf.fit(W_train, y_train)
  acc = clf.score(W_test, y_test)
  print(f"{name}: {acc:.2%}")`,
  },
  {
    id: 'biometric',
    step: '06',
    title: 'Biometric Evaluation',
    desc: 'Impostor set (2 unseen people) used to compute FAR, FRR, and EER. Optimal threshold found via ROC curve — not a manually picked magic number.',
    code: `# Softmax max-confidence as verification score
scores = model.predict_proba(W_impostors).max(axis=1)

fpr, tpr, thresholds = roc_curve(
  y_true,   # 1=genuine, 0=impostor
  scores
)

# EER: point where FAR ≈ FRR
eer_idx = np.argmin(np.abs(fpr - (1 - tpr)))
eer = (fpr[eer_idx] + (1 - tpr[eer_idx])) / 2`,
  },
]

export default function Methodology() {
  const [activeStep, setActiveStep] = useState('pca')

  const active = STEPS.find((s) => s.id === activeStep) ?? STEPS[0]

  return (
    <section id="methodology" className="methodology">
      <div className="section-container">
        <div className="section-header">
          <div className="section-tag">Pipeline</div>
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle">
            End-to-end pipeline from raw pixels to biometric evaluation, 
            with every non-trivial step implemented from scratch.
          </p>
        </div>

        <div className="methodology__layout">
          <div className="methodology__steps">
            {STEPS.map((s) => (
              <button
                key={s.id}
                className={`methodology__step-btn ${activeStep === s.id ? 'methodology__step-btn--active' : ''} ${s.highlight ? 'methodology__step-btn--highlight' : ''}`}
                onClick={() => setActiveStep(s.id)}
              >
                <span className="methodology__step-num mono">{s.step}</span>
                <span className="methodology__step-title">{s.title}</span>
                {s.highlight && <span className="methodology__step-badge">key fix</span>}
              </button>
            ))}
          </div>

          <div className="methodology__detail card">
            <div className="methodology__detail-header">
              <span className="mono methodology__detail-num">{active.step}</span>
              <h3 className="methodology__detail-title">{active.title}</h3>
              {active.highlight && <span className="badge badge-orange">Critical Insight</span>}
            </div>
            <p className="methodology__detail-desc">{active.desc}</p>
            <div className="methodology__code-block">
              <div className="methodology__code-header">
                <span className="mono">python</span>
              </div>
              <pre className="methodology__code"><code>{active.code}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
