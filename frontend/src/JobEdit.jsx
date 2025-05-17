// frontend/src/JobEdit.jsx

import React, { useState, useEffect } from 'react';

export default function JobEdit({ jobId, onUpdated, onCancel }) {
  const [form, setForm] = useState({
    title:       '',
    company:     '',
    location:    '',
    salary:      '',
    description: '',
    categoryId:  ''      // ← burayı ekledik
  });
  const [cats, setCats] = useState([]);
  const [msg, setMsg]   = useState('');

  useEffect(() => {
    // 1) İlan verisini yükle
    fetch(`/api/jobs/${jobId}`)
      .then(r => r.json())
      .then(job => {
        setForm({
          title:       job.title,
          company:     job.company,
          location:    job.location,
          salary:      job.salary || '',
          description: job.description,
          categoryId:  job.categoryId || ''  // ← burada alıyoruz
        });
      })
      .catch(console.error);

    // 2) Kategori listesini yükle
    fetch('/api/categories')
      .then(r => r.json())
      .then(setCats)
      .catch(console.error);
  }, [jobId]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMsg('Önce giriş yapın.');
      return;
    }

    const res = await fetch(`/api/jobs/${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('Güncelleme başarılı!');
      onUpdated();
    } else {
      setMsg(data.error || 'Güncelleme başarısız.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>İlanı Düzenle</h2>
      <form onSubmit={handleSubmit}>
        {/* Başlık, Firma, Konum…  */}
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

        {/* → BURASI: Kategori Seçici */}
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">Kategori seçin</option>
          {cats.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select><br/><br/>

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
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
          İptal
        </button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
