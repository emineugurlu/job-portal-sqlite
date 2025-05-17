// frontend/src/Jobs.jsx
import React, { useEffect, useState } from 'react';

export default function Jobs({ token, onEdit }) {
  const [jobsData, setJobsData] = useState({ jobs: [], page: 1, pages: 1, total: 0 });
  const [search, setSearch]   = useState('');
  const [sortBy, setSortBy]   = useState('createdAt');
  const [order, setOrder]     = useState('desc');
  const [limit, setLimit]     = useState(10);

  // Hero stilleri
  const heroStyle = {
    position:         'relative',
    backgroundImage:  `url('/hero-bg.jpg')`,
    backgroundSize:   'cover',
    backgroundPosition:'center',
    color:            '#fff',
    padding:          '120px 20px',
    marginBottom:     40,
    textAlign:        'center',
  };
  const heroOverlay = {
    position:  'absolute',
    top:       0,
    left:      0,
    right:     0,
    bottom:    0,
    background:'rgba(74,20,140,0.65)', // yarı şeffaf mor
  };
  const heroContent = {
    position: 'relative',
    zIndex:   1,
    maxWidth: 600,
    margin:   '0 auto',
  };
  const heroTitle = {
    fontSize:   36,
    fontWeight: 'bold',
    marginBottom: 16,
  };
  const heroText = {
    fontSize: 18,
    lineHeight: 1.4
  };

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
      {/* HERO BANNER */}
      <section style={heroStyle}>
        <div style={heroOverlay}></div>
        <div style={heroContent}>
          <h1 style={heroTitle}>İŞ ARKADAŞI ARIYORUZ!</h1>
          <p style={heroText}>
            Ekibimize katılacak yeni yetenekler arıyoruz.<br/>
            Özgeçmişinizi ve portföyünüzü <strong>merhaba@harikasite.com.tr</strong>’ye gönderin!
          </p>
        </div>
      </section>

      {/* Ara / filtre / sıralama */}
      <div style={{
        maxWidth: 800,
        margin: '0 auto 20px',
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
          {[5,10,20,50].map(n => <option key={n} value={n}>{n} / sayfa</option>)}
        </select>
      </div>

      {/* İlan Listesi */}
      <div style={{ maxWidth:800, margin:'auto' }}>
        {jobs.length === 0 ? (
          <p>İlan bulunamadı.</p>
        ) : (
          <ul style={{ listStyle:'none', padding:0 }}>
            {jobs.map(j => (
              <li key={j.id} style={{
                border: '1px solid #E0E0E0',
                borderRadius: 6,
                padding: 20,
                marginBottom: 16,
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ margin: '0 0 8px' }}>{j.title}</h3>
                <p style={{ margin:4 }}><strong>Firma:</strong> {j.company}</p>
                <p style={{ margin:4 }}><strong>Konum:</strong> {j.location}</p>
                <p style={{ margin:4 }}>{j.description}</p>
                <p style={{ margin:4 }}><strong>Maaş:</strong> {j.salary || 'Belirtilmemiş'}</p>
                {token && (
                  <button
                    style={{
                      marginTop: 12,
                      padding:'6px 12px',
                      background:'#6A1B9A',
                      color:'#fff',
                      border:'none',
                      borderRadius:4,
                      cursor:'pointer'
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
            disabled={page<=1}
            onClick={() => fetchJobs({ page: page-1 })}
            style={{ marginRight:8 }}
          >‹ Önceki</button>
          <span>{page} / {pages}</span>
          <button
            disabled={page>=pages}
            onClick={() => fetchJobs({ page: page+1 })}
            style={{ marginLeft:8 }}
          >Sonraki ›</button>
        </div>
      </div>
    </div>
  );
}
