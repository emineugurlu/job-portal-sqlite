// frontend/src/Login.jsx
import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        // 1) localStorage'a sakla
        // 2) App'e bildir
        onLogin(data.token);
        setMessage('Giriş başarılı!');
      } else {
        setMessage(data.error || 'Giriş başarısız.');
      }
    } catch {
      setMessage('Sunucuya bağlanılamadı.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Giriş Yap</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={form.password}
          onChange={handleChange}
          required
        /><br /><br />
        <button type="submit">Giriş Yap</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
