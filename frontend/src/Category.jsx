import React, { useState, useEffect } from 'react';

export default function Category() {
  const [cats, setCats] = useState([]);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const fetchCats = async () => {
    const res = await fetch('/api/categories');
    setCats(await res.json());
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      setName(''); 
      fetchCats(); 
      setMsg('Kategori eklendi');
    } else {
      setMsg('Hata oluştu');
    }
  };

  useEffect(() => { fetchCats(); }, []);

  return (
    <div style={{ maxWidth:600, margin:'auto', padding:20 }}>
      <h2>Kategoriler</h2>
      <form onSubmit={handleSubmit}>
        <input 
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Yeni kategori"
          required
        />
        <button type="submit">Ekle</button>
      </form>
      {msg && <p>{msg}</p>}
      <ul>
        {cats.map(c => <li key={c.id}>{c.name}</li>)}
      </ul>
    </div>
  );
}
