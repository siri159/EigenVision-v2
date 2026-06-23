import { GitBranch, ExternalLink } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer__inner">
          <div className="footer__left">
            <div className="footer__brand">
              <span className="footer__brand-icon">E</span>
              <span className="footer__brand-text">EigenVision</span>
            </div>
            <p className="footer__desc">
              A face recognition benchmark system comparing PCA-based classifiers 
              with biometric evaluation metrics. B.Tech AI/ML, 3rd Year project.
            </p>
            <div className="footer__links">
              <a href="https://github.com/siri159/EigenVision" target="_blank" rel="noopener noreferrer" className="footer__link">
                <GitBranch size={14} />
                GitHub
              </a>
              <a href="https://huggingface.co/spaces" target="_blank" rel="noopener noreferrer" className="footer__link">
                <ExternalLink size={14} />
                Hugging Face
              </a>
            </div>
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <div className="footer__col-title">Models</div>
              <ul className="footer__col-list">
                <li>PCA + ANN (65.93%)</li>
                <li>PCA + Random Forest (62.96%)</li>
                <li>PCA + SVM (54.81%)</li>
                <li>PCA + KNN (44.44%)</li>
              </ul>
            </div>
            <div className="footer__col">
              <div className="footer__col-title">Tech Stack</div>
              <ul className="footer__col-list">
                <li>Python + NumPy</li>
                <li>OpenCV + SciPy</li>
                <li>scikit-learn</li>
                <li>Gradio + HF Spaces</li>
              </ul>
            </div>
            <div className="footer__col">
              <div className="footer__col-title">Metrics</div>
              <ul className="footer__col-list">
                <li>FAR: 25.33%</li>
                <li>FRR: 24.44%</li>
                <li>EER: 24.89%</li>
                <li>Dataset: 450 images</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span className="footer__credit">
            Built by <a href="https://github.com/siri159" target="_blank" rel="noopener noreferrer">@siri159</a>
            {' '}— B.Tech AI/ML, 3rd Year
          </span>
          <span className="footer__paper">
            Based on Turk & Pentland, 1991 — "Eigenfaces for Recognition"
          </span>
        </div>
      </div>
    </footer>
  )
}
