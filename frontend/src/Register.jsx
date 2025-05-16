import React, { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Kayıt başarılı! Giriş yapabilirsiniz.');
      } else {
        setMessage(data.error || 'Kayıt başarısız.');
      }
    } catch (err) {
      setMessage('Sunucuya bağlanılamadı.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Ad" value={form.name} onChange={handleChange} required /><br /><br />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br /><br />
        <input type="password" name="password" placeholder="Şifre" value={form.password} onChange={handleChange} required /><br /><br />
        <button type="submit">Kayıt Ol</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
