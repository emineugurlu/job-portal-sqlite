import React from 'react'
import { motion } from 'framer-motion'
import './Hero.css'

export default function Hero({ onExplore }) {
  return (
    <section className="hero">
      {/* Yarı saydam overlay */}
      <div className="hero-overlay" />

      {/* Dalga filtresi (isteğe bağlı) */}
      <svg className="hero-svgFilter">
        <filter id="wavy">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01"
            numOctaves="2"
            seed="5"
            result="noise"
          />
          <feDisplacementMap in2="noise" in="SourceGraphic" scale="20" />
        </filter>
      </svg>

      {/* Başlık */}
      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        İş Arkadaşı Arıyoruz!
      </motion.h1>

      {/* Alt metin */}
      <motion.p
        className="hero-subtitle"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Ekibimize katılacak yeni yetenekleri arıyoruz. Özgeçmişinizi{' '}
        <strong>merhaba@harikasite.com.tr</strong>’ye gönderin!
      </motion.p>

      {/* CTA Buton */}
      <motion.button
        className="hero-button"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
        onClick={onExplore}
      >
        İlanlara Göz At
      </motion.button>

      {/* Keyframes */}
      <style>{`
        @keyframes move {
          0%   { transform: translate(0, 0); }
          100% { transform: translate(50%, 50%); }
        }
      `}</style>
    </section>
  )
}
