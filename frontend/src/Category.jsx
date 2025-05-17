import React, { useEffect, useState } from 'react';

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const fetchCats = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleCreate = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return setMsg('Önce giriş yapın.');
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      setMsg('Kategori oluşturuldu!');
      setName('');
      fetchCats();
    } else {
      const err = await res.json();
      setMsg(err.error || 'Hata');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Kategoriler</h2>
      <form onSubmit={handleCreate}>
        <input
          placeholder="Yeni kategori adı"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button style={{ marginLeft: 8 }}>Ekle</button>
      </form>
      {msg && <p>{msg}</p>}
      <ul style={{ marginTop: 20 }}>
        {categories.map(c => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}
