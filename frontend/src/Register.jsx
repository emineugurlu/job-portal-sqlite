// frontend/src/Register.jsx
import React, { useState } from 'react';

export default function Register() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg]           = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('/api/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Kayıt başarılı! Lütfen giriş yapın.');
        setName(''); setEmail(''); setPassword('');
      } else {
        setMsg(data.error || 'Kayıt başarısız');
      }
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
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    background:      'linear-gradient(135deg, #7E57C2 0%, #B39DDB 100%)',
    color:           'white',
    padding:         '32px'
  };

  const right = {
    flex:            1,
    padding:         '48px 32px',
    backgroundColor: '#fff'
  };

  const title = {
    marginBottom: '32px',
    fontSize:     '28px',
    fontWeight:   '600',
    textAlign:    'center'
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

  const sideText = {
    textAlign:  'center',
    lineHeight: '1.4'
  };

  return (
    <div style={container}>
      <div style={left}>
        <div style={sideText}>
          <h3 style={{ fontSize: '26px', marginBottom: '12px' }}>Hoş Geldiniz!</h3>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>
            Kişisel bilgilerinizle kayıt olarak<br/>
            tüm ilanlara hemen göz atın.
          </p>
        </div>
      </div>
      <div style={right}>
        <h2 style={title}>Kayıt Ol</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Adınız"
            value={name}
            onChange={e => setName(e.target.value)}
            style={input}
            required
          />
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
          <button type="submit" style={button}>Kayıt Ol</button>
        </form>
        {msg && <div style={msgStyle}>{msg}</div>}
      </div>
    </div>
  );
}
