// frontend/src/Hero.jsx
import React from 'react';

export default function Hero() {
  const style = {
    container: {
      background: '#7B1FA2', // mor ton
      color: 'white',
      padding: '80px 20px',
      textAlign: 'center',
    },
    title: {
      fontSize: '2.5rem',
      marginBottom: '16px',
      fontWeight: 'bold'
    },
    subtitle: {
      fontSize: '1.25rem',
      maxWidth: 600,
      margin: '0 auto'
    }
  };
  return (
    <div style={style.container}>
      <h1 style={style.title}>İŞ ARKADAŞI ARIYORUZ!</h1>
      <p style={style.subtitle}>
        Ekibimize katılacak yeni yetenekler arıyoruz. Özgeçmişinizi ve portföyünüzü <strong>merhaba@harikasite.com.tr</strong>’ye gönderin!
      </p>
    </div>
  );
}
