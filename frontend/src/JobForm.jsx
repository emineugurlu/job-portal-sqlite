// frontend/src/JobForm.jsx
import React, { useState } from 'react';

export default function JobForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: ''
  });
  const [msg, setMsg] = useState('');

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return setMsg('Önce giriş yapmalısınız.');

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('İlan oluşturuldu!');
        onCreated();
        setForm({ title:'', company:'', location:'', salary:'', description:'' });
      } else {
        setMsg(data.error || 'Oluşturulamadı.');
      }
    } catch {
      setMsg('Sunucuya bağlanılamadı.');
    }
  };

  const container = {
    maxWidth:     700,
    margin:       '40px auto',
    padding:      20,
    borderRadius: 8,
    background:   '#FFF',
    boxShadow:    '0 4px 12px rgba(0,0,0,0.05)',
    fontFamily:   'Arial, sans-serif'
  };
  const title = {
    marginBottom: 24,
    fontSize:     22,
    fontWeight:   600,
    color:        '#4A148C',
    textAlign:    'center'
  };
  const formGrid = {
    display:          'grid',
    gridTemplateCols: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap:              16
  };
  const inputBase = {
    width:         '100%',
    padding:       '10px 12px',
    borderRadius:  4,
    border:        '1px solid #B39DDB',
    outline:       'none',
    fontSize:      14
  };
  const textarea = {
    ...inputBase,
    gridColumn: '1 / -1',
    minHeight:  100,
    resize:     'vertical'
  };
  const button = {
    gridColumn:      '1 / -1',
    padding:         '12px 0',
    background:      '#6A1B9A',
    color:           '#fff',
    border:          'none',
    borderRadius:    4,
    fontSize:        16,
    fontWeight:      500,
    cursor:          'pointer'
  };

  return (
    <div style={container}>
      <h2 style={title}>Yeni İş İlanı Oluştur</h2>
      <form style={formGrid} onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Başlık"
          value={form.title}
          onChange={handleChange}
          style={inputBase}
          required
        />
        <input
          name="company"
          placeholder="Firma"
          value={form.company}
          onChange={handleChange}
          style={inputBase}
          required
        />
        <input
          name="location"
          placeholder="Konum"
          value={form.location}
          onChange={handleChange}
          style={inputBase}
          required
        />
        <input
          name="salary"
          placeholder="Maaş"
          value={form.salary}
          onChange={handleChange}
          style={inputBase}
        />
        <textarea
          name="description"
          placeholder="Açıklama"
          value={form.description}
          onChange={handleChange}
          style={textarea}
          required
        />
        <button type="submit" style={button}>Oluştur</button>
      </form>
      {msg && (
        <p style={{
          marginTop: 16,
          textAlign: 'center',
          color:     msg.includes('başarılı') ? '#388E3C' : '#D32F2F'
        }}>{msg}</p>
      )}
    </div>
  );
}
