import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Overview from './components/Overview'
import Methodology from './components/Methodology'
import BenchmarkResults from './components/BenchmarkResults'
import BiometricMetrics from './components/BiometricMetrics'
import EigenfacesViz from './components/EigenfacesViz'
import Demo from './components/Demo'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    const sections = document.querySelectorAll('section[id]')
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="app">
      <Navbar activeSection={activeSection} />
      <main>
        <Hero />
        <Overview />
        <Methodology />
        <BenchmarkResults />
        <BiometricMetrics />
        <EigenfacesViz />
        <Demo />
      </main>
      <Footer />
    </div>
  )
}
