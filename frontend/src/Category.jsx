import React, { useState, useEffect } from 'react';
import './Category.css';

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat]         = useState('');
  const [msg, setMsg]               = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleAdd = async e => {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCat })
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setCategories([...categories, created]);
      setNewCat('');
      setMsg('Kategori eklendi!');
      setTimeout(() => setMsg(''), 2000);
    } catch {
      setMsg('Sunucu hatası');
      setTimeout(() => setMsg(''), 2000);
    }
  };

  return (
    <div className="category-card">
      <div className="category-left">
        <h2>Kategoriler</h2>
        <p>
          İlanlarınızı kategorilere ayırarak
          kullanıcıların aradıklarını daha
          hızlı bulmasını sağlayın.
        </p>
      </div>

      <div className="category-right">
        <form className="category-form" onSubmit={handleAdd}>
          <input
            className="category-input"
            placeholder="Yeni kategori"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
          />
          <button className="category-button">Ekle</button>
        </form>
        {msg && <div className="category-msg">{msg}</div>}

        <ul className="category-list">
          {categories.map(c => (
            <li key={c.id} className="category-item">
              {c.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
