// frontend/src/JobForm.jsx

import React, { useState, useEffect } from 'react';

export default function JobForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    categoryId: ''
  });
  const [cats, setCats] = useState([]);
  const [msg, setMsg] = useState('');

  // Kategorileri yükle
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCats(data))
      .catch(err => console.error('Kategoriler alınamadı:', err));
  }, []);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setMsg('Önce giriş yapmalısınız.');
      return;
    }

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        setMsg('İlan oluşturuldu!');
        onCreated();  // parent’a haber verir
        setForm({     // formu sıfırla
          title: '',
          company: '',
          location: '',
          salary: '',
          description: '',
          categoryId: ''
        });
      } else if (res.status === 401 || res.status === 403) {
        setMsg('Yetkisiz. Lütfen tekrar giriş yapın.');
      } else {
        setMsg(data.error || 'Oluşturulamadı.');
      }
    } catch (err) {
      console.error(err);
      setMsg('Sunucuya bağlanılamadı.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Yeni İş İlanı Oluştur</h2>
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
        <button type="submit">Oluştur</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
