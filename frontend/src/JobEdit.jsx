import React, { useState, useEffect } from 'react';

export default function JobEdit({ jobId, onUpdated, onCancel }) {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  useEffect(async () => {
    const res = await fetch(`/api/jobs/${jobId}`);
    const job = await res.json();
    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      description: job.description,
      categoryId: job.categoryId || ''
    });
  }, [jobId]);

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`/api/jobs/${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setMsg('Güncellendi!');
      onUpdated();
    } else setMsg('Hata oluştu');
  };

  if (!form) return <p>Yükleniyor…</p>;

  return (
    <div style={{ maxWidth:600, margin:'auto', padding:20 }}>
      <h2>İlanı Düzenle</h2>
      <form onSubmit={handleSubmit}>
        {/* input’ları JobForm ile aynen koy, + kategori seç */}
        {/* örn: <input name="title" value={form.title} onChange={...} /> */}
        <button type="submit">Güncelle</button>
        <button type="button" onClick={onCancel}>İptal</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
