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
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('İlan oluşturuldu!');
        onCreated();          // parent’a haber verir
        setForm({             // formu sıfırla
          title: '', company: '', location: '',
          salary: '', description: ''
        });
      } else {
        setMsg(data.error || 'Oluşturulamadı');
      }
    } catch {
      setMsg('Sunucuya bağlanılamadı');
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
