// frontend/src/Jobs.jsx
import React, { useEffect, useState } from 'react';

export default function Jobs({ token, userRole, onEdit }) {
  const [jobsData, setJobsData] = useState({ jobs: [], page: 1, pages: 1, total: 0 });
  const [search, setSearch]   = useState('');
  const [sortBy, setSortBy]   = useState('createdAt');
  const [order, setOrder]     = useState('desc');
  const [limit, setLimit]     = useState(10);

  // İlanları çek
  const fetchJobs = async opts => {
    const qs = new URLSearchParams({
      search,
      page: opts?.page  || jobsData.page,
      sortBy,
      order,
      limit
    }).toString();
    const res = await fetch(`/api/jobs?${qs}`);
    const data = await res.json();
    setJobsData(data);
  };

  useEffect(() => {
    fetchJobs({ page: 1 });
  }, [search, sortBy, order, limit]);

  const { jobs, page, pages, total } = jobsData;

  return (
    <div>
      {/* Filtre / sıralama */}
      <div style={{
        maxWidth: 800,
        margin: '40px auto',
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap'
      }}>
        <input
          style={{
            flex: '1 1 200px',
            padding: '8px 12px',
            border: '1px solid #BDBDBD',
            borderRadius: 4,
            fontSize: 14
          }}
          type="text"
          placeholder="Ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          style={{ padding:'8px', borderRadius:4, border:'1px solid #BDBDBD' }}
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="createdAt">Tarih</option>
          <option value="salary">Maaş</option>
        </select>
        <select
          style={{ padding:'8px', borderRadius:4, border:'1px solid #BDBDBD' }}
          value={order}
          onChange={e => setOrder(e.target.value)}
        >
          <option value="asc">Artan</option>
          <option value="desc">Azalan</option>
        </select>
        <select
          style={{ padding:'8px', borderRadius:4, border:'1px solid #BDBDBD' }}
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
        >
          {[5,10,20,50].map(n => (
            <option key={n} value={n}>{n} / sayfa</option>
          ))}
        </select>
      </div>

      {/* İlan Listesi */}
      <div style={{ maxWidth:800, margin:'auto' }}>
        {jobs.length === 0 ? (
          <p style={{ textAlign: 'center' }}>İlan bulunamadı.</p>
        ) : (
          <ul style={{ listStyle:'none', padding:0 }}>
            {jobs.map(j => (
              <li key={j.id} style={{
                border: '1px solid #E0E0E0',
                borderRadius: 8,
                padding: 20,
                marginBottom: 16,
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                position: 'relative'
              }}>
                <h3 style={{ margin: '0 0 8px' }}>{j.title}</h3>
                <p style={{ margin:4 }}><strong>Firma:</strong> {j.company}</p>
                <p style={{ margin:4 }}><strong>Konum:</strong> {j.location}</p>
                <p style={{ margin:4 }}><strong>Maaş:</strong> {j.salary || 'Belirtilmemiş'}</p>
                <p style={{ margin: '12px 0 0' }}>{j.description}</p>

                {/* Admin-only Düzenle Butonu */}
                {token && userRole === 'admin' && (
                  <button
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      padding:'6px 12px',
                      background:'#6A1B9A',
                      color:'#fff',
                      border:'none',
                      borderRadius:4,
                      cursor:'pointer',
                      fontSize: 12
                    }}
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
        <div style={{ textAlign:'center', marginTop: 24 }}>
          <button
            disabled={page <= 1}
            onClick={() => fetchJobs({ page: page - 1 })}
            style={{ marginRight:8 }}
          >
            ‹ Önceki
          </button>
          <span>{page} / {pages}</span>
          <button
            disabled={page >= pages}
            onClick={() => fetchJobs({ page: page + 1 })}
            style={{ marginLeft:8 }}
          >
            Sonraki ›
          </button>
        </div>
      </div>
    </div>
  );
}
