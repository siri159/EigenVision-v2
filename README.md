# 🚀 EigenVision

> Research Oriented Face Recognition Benchmark using PCA (Eigenfaces) and Hand Built Neural Networks

<p align="center">

![Python](https://img.shields.io/badge/Python-3.x-blue)
![NumPy](https://img.shields.io/badge/NumPy-Scientific-green)
![Computer Vision](https://img.shields.io/badge/Computer-Vision-orange)
![License](https://img.shields.io/badge/License-MIT-purple)

</p>

## 📖 Overview

EigenVision is a computer vision benchmark system designed to evaluate classical face recognition techniques through a research focused approach.

The project implements Principal Component Analysis (Eigenfaces) from scratch and compares multiple machine learning models trained on identical feature representations. Performance is evaluated using biometric metrics including False Accept Rate (FAR), False Reject Rate (FRR), Receiver Operating Characteristic (ROC), and Equal Error Rate (EER).

This project emphasizes algorithm understanding, benchmarking methodology, and transparent evaluation rather than maximizing accuracy alone.

---

## ✨ Key Features

✅ PCA (Eigenfaces) implemented from scratch

✅ Surrogate covariance eigendecomposition

✅ Hand built Neural Network using pure NumPy

✅ Random Forest, Support Vector Machine, and K Nearest Neighbors benchmark

✅ Fair comparison across identical PCA features

✅ ROC, FAR, FRR, and EER biometric evaluation

✅ Interactive web interface

✅ Modern responsive dashboard

---

## 🛠 Technology Stack

| Category | Technologies |
|------------|---------------------------|
| Programming | Python, TypeScript |
| Machine Learning | NumPy, SciPy, scikit learn |
| Computer Vision | OpenCV |
| Frontend | React, Vite |
| Deployment | Gradio, Hugging Face |
| Visualization | Matplotlib |

---

## 📊 Benchmark Results

| Model | Test Accuracy |
|-------------------------|--------------|
| PCA + ANN | **65.93%** |
| PCA + Random Forest | **62.96%** |
| PCA + Support Vector Machine | **54.81%** |
| PCA + K Nearest Neighbors | **44.44%** |

---

## 🔒 Biometric Evaluation

| Metric | Value |
|--------------------|------------|
| False Accept Rate | 25.33% |
| False Reject Rate | 24.44% |
| Equal Error Rate | 24.89% |

The Equal Error Rate is calculated from ROC analysis using previously unseen impostor subjects, providing an objective evaluation of system performance.

---

## 🔄 System Pipeline

```
Input Face Image

        │

        ▼

Image Preprocessing

        │

        ▼

PCA Feature Extraction

        │

        ▼

Feature Standardization

        │

        ▼

ANN | Random Forest | SVM | KNN

        │

        ▼

Prediction

        │

        ▼

ROC • FAR • FRR • EER Analysis
```

---

## 📁 Project Structure

```
EigenVision/

├── src/

├── public/

├── assets/

├── models/

├── app.py

├── package.json

├── requirements.txt

└── README.md
```

---

## 🎯 Research Highlights

Feature standardization improved Neural Network accuracy from approximately 12 percent to nearly 66 percent.

PCA combined with a custom NumPy Neural Network achieved the highest benchmark performance.

Biometric evaluation was performed using unseen impostor identities rather than arbitrary thresholds.

Every classifier was trained and tested on identical PCA feature representations to ensure a fair comparison.

---

## 🌐 Live Demo

Coming Soon

---

## 🤗 Hugging Face Demo

Coming Soon

---

## 💻 GitHub Repository

Coming Soon

---

## 👩‍💻 Author

**Siri Chandana**

AI and Machine Learning Student

Computer Vision Enthusiast

Open Source Contributor

GitHub: https://github.com/siri159

LinkedIn: https://linkedin.com/in/kanneboina-siri-chandana

---

## ⭐ Project Vision

EigenVision demonstrates how classical computer vision techniques can be implemented from first principles and evaluated through rigorous benchmarking. The project serves as both an educational resource and a practical reference for understanding PCA based face recognition systems.
