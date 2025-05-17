// frontend/src/Login.jsx
import React, { useState } from 'react';
import './App.css'; // veya kendi stil dosyan

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg]           = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token);
      } else {
        setMsg(data.error || 'Giriş başarısız');
      }
    } catch {
      setMsg('Sunucuya bağlanılamadı');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">Hoş Geldiniz</div>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Kullanıcı Adı veya E-posta"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {msg && <p style={{ color: '#ffcccb', textAlign: 'center' }}>{msg}</p>}
          <button className="btn" type="submit">Giriş</button>
        </form>
        <button
          className="btn btn--facebook"
          onClick={() => window.alert('Facebook ile Giriş (henüz yok)')}
        >
          Facebook ile Giriş Yap
        </button>
      </div>
    </div>
  );
}
