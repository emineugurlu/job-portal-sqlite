import React, { useEffect, useState } from 'react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');

  // İlanları getir (ister normal, ister aramalı)
  const fetchJobs = async (query = '') => {
    const url = query
      ? `/api/jobs?search=${encodeURIComponent(query)}`
      : '/api/jobs';
    const res = await fetch(url);
    const data = await res.json();
    setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Arama formu submit
  const handleSearch = e => {
    e.preventDefault();
    fetchJobs(search);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>İş İlanları</h2>

      {/* Arama Formu */}
      <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Arama: başlık, firma veya konum..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '70%', padding: 8 }}
        />
        <button type="submit" style={{ marginLeft: 8 }}>Ara</button>
        <button
          type="button"
          onClick={() => { setSearch(''); fetchJobs(); }}
          style={{ marginLeft: 8 }}
        >
          Sıfırla
        </button>
      </form>

      {jobs.length === 0 && <p>İlan bulunamadı.</p>}
      <ul>
        {jobs.map(j => (
          <li key={j.id} style={{ marginBottom: 20 }}>
            <h3>{j.title}</h3>
            <p><strong>Firma:</strong> {j.company}</p>
            <p><strong>Konum:</strong> {j.location}</p>
            <p>{j.description}</p>
            <p><strong>Maaş:</strong> {j.salary || 'Belirtilmemiş'}</p>
            {/* Düzenle / Sil butonları... */}
          </li>
        ))}
      </ul>
    </div>
  );
}
