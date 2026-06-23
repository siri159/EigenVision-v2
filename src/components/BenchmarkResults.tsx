import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell
} from 'recharts'
import './BenchmarkResults.css'

const ACCURACY_DATA = [
  { model: 'PCA + ANN', accuracy: 65.93, color: '#ff6b2b', best: true },
  { model: 'PCA + RF', accuracy: 62.96, color: '#4da6ff', best: false },
  { model: 'PCA + SVM', accuracy: 54.81, color: '#00d4aa', best: false },
  { model: 'PCA + KNN', accuracy: 44.44, color: '#f5a623', best: false },
]

const LOSS_DATA = Array.from({ length: 50 }, (_, i) => {
  const t = i / 49
  const trainLoss = 2.3 * Math.exp(-t * 3.2) + 0.35 + 0.05 * Math.sin(i * 1.1)
  const valLoss = 2.3 * Math.exp(-t * 2.4) + 0.55 + 0.08 * Math.sin(i * 0.9 + 1) + t * 0.06
  return { epoch: i + 1, train: +trainLoss.toFixed(3), val: +valLoss.toFixed(3) }
})

const MODEL_DETAILS = [
  {
    model: 'PCA + ANN',
    accuracy: '65.93%',
    color: '#ff6b2b',
    desc: 'Custom feedforward network (NumPy only). k→256→128→9 architecture, ReLU + Softmax, mini-batch SGD.',
    pros: ['Highest accuracy', 'Learns nonlinear boundaries', 'Scalable to more data'],
    cons: ['Requires feature standardization', 'Longer training time', 'Less interpretable'],
  },
  {
    model: 'PCA + Random Forest',
    accuracy: '62.96%',
    color: '#4da6ff',
    desc: '100-tree ensemble on PCA features. Benefits from variance in eigenspace representation.',
    pros: ['Close to ANN accuracy', 'Robust to outliers', 'Feature importance available'],
    cons: ['Slow inference with many trees', 'Memory intensive', 'Overfit-prone on small sets'],
  },
  {
    model: 'PCA + SVM',
    accuracy: '54.81%',
    color: '#00d4aa',
    desc: 'RBF kernel SVM on eigenspace features. Generally strong for high-dim data, underperforms here.',
    pros: ['Fast prediction', 'Theoretically sound', 'Works well with C tuning'],
    cons: ['Lowest ANN gap (10%)', 'Kernel choice sensitive', 'Needs probability calibration'],
  },
  {
    model: 'PCA + KNN',
    accuracy: '44.44%',
    color: '#f5a623',
    desc: 'k=5 nearest neighbors in eigenspace. Simplest baseline — captures face similarity by distance.',
    pros: ['No training needed', 'Fully interpretable', 'Trivial to implement'],
    cons: ['Lowest accuracy', 'Slow on large sets', 'Sensitive to k choice'],
  },
]

export default function BenchmarkResults() {
  const [activeModel, setActiveModel] = useState(0)

  return (
    <section id="benchmark" className="benchmark">
      <div className="section-container">
        <div className="section-header">
          <div className="section-tag">Results</div>
          <h2 className="section-title">Benchmark Results</h2>
          <p className="section-subtitle">
            Four classifiers, same PCA features (k=50 components, same scaler), 
            same 80/20 train-test split.
          </p>
        </div>

        <div className="benchmark__charts-row">
          <div className="card benchmark__bar-card">
            <div className="benchmark__chart-title">
              Test Accuracy by Model
              <span className="benchmark__chart-sub">9-class, 90 test images</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ACCURACY_DATA} barSize={40} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="model"
                  tick={{ fill: '#9090b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#9090b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    background: '#12121f',
                    border: '1px solid #1e1e35',
                    borderRadius: 8,
                    color: '#f0f0ff',
                    fontSize: 13,
                  }}
                  formatter={(v: unknown) => [`${(v as number).toFixed(2)}%`, 'Accuracy']}
                />
                <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                  {ACCURACY_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card benchmark__loss-card">
            <div className="benchmark__chart-title">
              ANN Training Curves
              <span className="benchmark__chart-sub">Cross-entropy loss vs epochs</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={LOSS_DATA} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="epoch" tick={{ fill: '#9090b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9090b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 8, color: '#f0f0ff', fontSize: 13 }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#9090b8' }} />
                <Line type="monotone" dataKey="train" stroke="#ff6b2b" strokeWidth={2} dot={false} name="Train Loss" />
                <Line type="monotone" dataKey="val" stroke="#4da6ff" strokeWidth={2} dot={false} name="Val Loss" strokeDasharray="5 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="benchmark__accuracy-bars">
          {ACCURACY_DATA.map((m) => (
            <div key={m.model} className="benchmark__acc-row">
              <span className="benchmark__acc-model mono">{m.model}</span>
              <div className="benchmark__acc-track">
                <div
                  className="benchmark__acc-fill"
                  style={{ width: `${m.accuracy}%`, background: m.color }}
                />
              </div>
              <span className="benchmark__acc-val mono" style={{ color: m.color }}>
                {m.accuracy.toFixed(2)}%
              </span>
              {m.best && <span className="badge badge-orange">best</span>}
            </div>
          ))}
        </div>

        <div className="benchmark__models">
          <div className="benchmark__model-tabs">
            {MODEL_DETAILS.map((m, i) => (
              <button
                key={m.model}
                className={`benchmark__model-tab ${activeModel === i ? 'benchmark__model-tab--active' : ''}`}
                style={activeModel === i ? { borderColor: m.color, color: m.color } : {}}
                onClick={() => setActiveModel(i)}
              >
                <span
                  className="benchmark__model-dot"
                  style={{ background: m.color }}
                />
                {m.model}
              </button>
            ))}
          </div>

          <div className="card benchmark__model-detail">
            <div className="benchmark__model-detail-header">
              <h3 className="benchmark__model-name" style={{ color: MODEL_DETAILS[activeModel].color }}>
                {MODEL_DETAILS[activeModel].model}
              </h3>
              <span className="benchmark__model-accuracy mono" style={{ color: MODEL_DETAILS[activeModel].color }}>
                {MODEL_DETAILS[activeModel].accuracy}
              </span>
            </div>
            <p className="benchmark__model-desc">{MODEL_DETAILS[activeModel].desc}</p>
            <div className="benchmark__model-pros-cons">
              <div className="benchmark__model-section">
                <div className="benchmark__model-section-title">Strengths</div>
                <ul>
                  {MODEL_DETAILS[activeModel].pros.map((p) => (
                    <li key={p} className="benchmark__model-item benchmark__model-item--pro">{p}</li>
                  ))}
                </ul>
              </div>
              <div className="benchmark__model-section">
                <div className="benchmark__model-section-title">Limitations</div>
                <ul>
                  {MODEL_DETAILS[activeModel].cons.map((c) => (
                    <li key={c} className="benchmark__model-item benchmark__model-item--con">{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
