// frontend/src/Jobs.jsx

import React, { useEffect, useState } from 'react';

export default function Jobs({ token, onEdit }) {
  const [jobsData, setJobsData]     = useState({ jobs: [], page: 1, pages: 1, total: 0 });
  const [search, setSearch]         = useState('');
  const [sortBy, setSortBy]         = useState('createdAt');
  const [order, setOrder]           = useState('desc');
  const [limit, setLimit]           = useState(10);
  const [cats, setCats]             = useState([]);
  const [filterCat, setFilterCat]   = useState('');

  const fetchJobs = async (opts = {}) => {
    const qs = new URLSearchParams({
      search,
      page: opts.page || jobsData.page,
      limit,
      sortBy,
      order,
      category: filterCat
    }).toString();

    const res  = await fetch(`/api/jobs?${qs}`);
    const data = await res.json();
    setJobsData(data);
  };

  const fetchCats = async () => {
    const res  = await fetch('/api/categories');
    const data = await res.json();
    setCats(data);
  };

  useEffect(() => {
    fetchCats();
    fetchJobs({ page: 1 });
  }, [search, sortBy, order, limit, filterCat]);

  const { jobs, page, pages, total } = jobsData;

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>İş İlanları</h2>
      <p>Toplam: {total} ilan</p>

      {/* Filtre & Sıralama */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="">Tüm kategoriler</option>
          {cats.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="createdAt">Tarih</option>
          <option value="salary">Maaş</option>
        </select>
        <select
          value={order}
          onChange={e => setOrder(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="asc">Artan</option>
          <option value="desc">Azalan</option>
        </select>
        <select
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
          style={{ marginLeft: 8 }}
        >
          {[5, 10, 20, 50].map(n => (
            <option key={n} value={n}>{n} / sayfa</option>
          ))}
        </select>
      </div>

      {/* İlan Listesi */}
      {jobs.length === 0 ? (
        <p>İlan bulunamadı.</p>
      ) : (
        <ul>
          {jobs.map(j => (
            <li key={j.id} style={{ marginBottom: 20 }}>
              <h3>{j.title}</h3>
              <p><strong>Firma:</strong> {j.company}</p>
              <p><strong>Konum:</strong> {j.location}</p>
              <p><strong>Kategori:</strong> {j.Category?.name || '—'}</p>
              <p>{j.description}</p>
              <p><strong>Maaş:</strong> {j.salary || 'Belirtilmemiş'}</p>
              {token && (
                <button
                  style={{ marginTop: 8 }}
                  onClick={() => onEdit(j.id)}
                >
                  Düzenle
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div style={{ marginTop: 20 }}>
        <button
          disabled={page <= 1}
          onClick={() => fetchJobs({ page: page - 1 })}
        >
          ‹ Önceki
        </button>
        <span style={{ margin: '0 8px' }}>{page} / {pages}</span>
        <button
          disabled={page >= pages}
          onClick={() => fetchJobs({ page: page + 1 })}
        >
          Sonraki ›
        </button>
      </div>
    </div>
  );
}
