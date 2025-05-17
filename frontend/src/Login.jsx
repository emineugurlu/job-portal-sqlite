// frontend/src/Login.jsx
import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg]           = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res  = await fetch('/api/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) onLogin(data.token);
      else setMsg(data.error || 'Giriş başarısız');
    } catch {
      setMsg('Sunucu hatası');
    }
  };

  const container = {
    display:       'flex',
    width:         '700px',
    maxWidth:      '95%',
    margin:        '60px auto',
    borderRadius:  '16px',
    boxShadow:     '0 8px 24px rgba(0,0,0,0.1)',
    overflow:      'hidden',
    fontFamily:    'Arial, sans-serif'
  };

  const left = {
    flex:            1,
    padding:         '48px 32px',
    backgroundColor: '#fff'
  };

  const right = {
    flex:            1,
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    background:      'linear-gradient(135deg, #7E57C2 0%, #B39DDB 100%)',
    color:           'white',
    padding:         '32px'
  };

  const title = {
    marginBottom: '32px',
    fontSize:     '28px',
    fontWeight:   '600',
    textAlign:    'center'    // ← burası eklendi
  };

  const input = {
    width:          '100%',
    padding:        '12px 16px',
    marginBottom:   '20px',
    border:         '2px solid #9575CD',
    borderRadius:   '8px',
    fontSize:       '15px',
    outline:        'none'
  };

  const button = {
    width:          '100%',
    padding:        '14px',
    background:     '#6A1B9A',
    color:          '#fff',
    border:         'none',
    borderRadius:   '8px',
    fontSize:       '16px',
    fontWeight:     '500',
    cursor:         'pointer'
  };

  const msgStyle = {
    marginTop: '16px',
    fontSize:  '14px',
    color:     '#E53935',
    textAlign: 'center'
  };

  const welcome = {
    textAlign:  'center',
    lineHeight: '1.4'
  };

  return (
    <div style={container}>
      <div style={left}>
        <h2 style={title}>Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={input}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={input}
            required
          />
          <button type="submit" style={button}>Giriş</button>
        </form>
        {msg && <div style={msgStyle}>{msg}</div>}
      </div>
      <div style={right}>
        <div style={welcome}>
          <h3 style={{ fontSize: '26px', marginBottom: '12px' }}>Hoş Geldiniz!</h3>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>
            Hesabınıza giriş yaparak<br/>
            en güncel iş ilanlarına ulaşın.
          </p>
        </div>
      </div>
    </div>
  );
}
