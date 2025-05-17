// frontend/src/Hero.jsx
import React from 'react'
import { motion } from 'framer-motion'
import './Hero.css'  // keyframe animasyonu için

export default function Hero({ onExplore }) {
  return (
    <section className="hero">
      {/* yarı saydam overlay */}
      <div className="hero-overlay" />

      {/* animasyonlu başlık */}
      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        İş Arkadaşı Arıyoruz!
      </motion.h1>

      {/* animasyonlu alt metin */}
      <motion.p
        className="hero-subtitle"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Ekibimize katılacak yeni yetenekleri arıyoruz. Özgeçmişinizi{' '}
        <strong>merhaba@harikasite.com.tr</strong>’ye gönderin!
      </motion.p>

      {/* çağrı butonu */}
      <motion.button
        className="hero-button"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
        onClick={onExplore}
      >
        İlanlara Göz At
      </motion.button>
    </section>
  )
}
