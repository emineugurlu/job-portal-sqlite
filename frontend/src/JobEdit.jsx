// frontend/src/JobEdit.jsx

import React, { useState, useEffect } from 'react';

export default function JobEdit({ jobId, onUpdated, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: ''
  });
  const [msg, setMsg] = useState('');

  // Mevcut ilanı getir ve formu doldur (GET herkese açık olduğu için header gerek yok)
  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then(res => res.json())
      .then(data => setForm({
        title: data.title,
        company: data.company,
        location: data.location,
        salary: data.salary || '',
        description: data.description
      }))
      .catch(() => setMsg('İlan yüklenemedi'));
  }, [jobId]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    // 1) Önce token'ı oku
    const token = localStorage.getItem('token');
    if (!token) {
      setMsg('Önce giriş yapmalısınız.');
      return;
    }

    // 2) PUT isteğine Authorization header ekle
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setMsg('Güncellendi!');
        onUpdated();
      } else if (res.status === 401 || res.status === 403) {
        setMsg('Yetkisiz. Lütfen tekrar giriş yapın.');
      } else {
        const data = await res.json();
        setMsg(data.error || 'Güncelleme başarısız');
      }
    } catch {
      setMsg('Sunucuya bağlanılamadı');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>İlanı Düzenle</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Başlık"
          value={form.title}
          onChange={handleChange}
          required
        /><br/><br/>
        <input
          name="company"
          placeholder="Firma"
          value={form.company}
          onChange={handleChange}
          required
        /><br/><br/>
        <input
          name="location"
          placeholder="Konum"
          value={form.location}
          onChange={handleChange}
          required
        /><br/><br/>
        <input
          name="salary"
          placeholder="Maaş"
          value={form.salary}
          onChange={handleChange}
        /><br/><br/>
        <textarea
          name="description"
          placeholder="Açıklama"
          value={form.description}
          onChange={handleChange}
          required
        /><br/><br/>
        <button type="submit">Güncelle</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>İptal</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
