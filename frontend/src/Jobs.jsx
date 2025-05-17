import React, { useEffect, useState } from 'react';

export default function Jobs({ token, onEdit }) {
  const [jobsData, setJobsData] = useState({ jobs: [], page:1, pages:1, total:0 });
  const [search, setSearch]     = useState('');
  const [sortBy, setSortBy]     = useState('createdAt');
  const [order, setOrder]       = useState('desc');
  const [limit, setLimit]       = useState(10);

  const fetchJobs = async (opts = {}) => {
    const qs = new URLSearchParams({
      search,
      page:  opts.page  || jobsData.page,
      limit,
      sortBy,
      order
    }).toString();
    const res = await fetch(`/api/jobs?${qs}`);
    const data = await res.json();
    setJobsData(data);
  };

  useEffect(() => {
    fetchJobs({ page: 1 });
  }, [search, sortBy, order, limit]);

  const { jobs, page, pages, total } = jobsData;

  const container = {
    maxWidth:   800,
    margin:     '0 auto',
    fontFamily: 'Arial, sans-serif'
  };
  const filterBar = {
    display:       'flex',
    gap:           12,
    marginBottom:  16,
    padding:       12,
    background:    '#9575CD',     // açık mor
    borderRadius:  6,
    alignItems:    'center'
  };
  const input = {
    flex:         1,
    padding:      '8px 12px',
    border:       'none',
    borderRadius: 4,
    fontSize:     14
  };
  const select = {
    padding:      '8px 12px',
    border:       'none',
    borderRadius: 4,
    fontSize:     14,
    background:   '#FFF',
    cursor:       'pointer'
  };
  const jobCard = {
    background:   '#FFF',
    borderRadius: 6,
    padding:      16,
    marginBottom: 16,
    boxShadow:    '0 2px 8px rgba(0,0,0,0.1)'
  };
  const title = {
    fontSize:   18,
    fontWeight: 600,
    color:      '#4A148C',
    marginBottom: 8
  };
  const editBtn = {
    background:   '#6A1B9A',
    color:        '#FFF',
    border:       'none',
    padding:      '6px 12px',
    borderRadius: 4,
    cursor:       'pointer',
    marginTop:    12
  };

  return (
    <div style={container}>
      <div style={filterBar}>
        <input
          style={input}
          placeholder="Ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select style={select} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="createdAt">Tarih</option>
          <option value="salary">Maaş</option>
        </select>
        <select style={select} value={order} onChange={e => setOrder(e.target.value)}>
          <option value="asc">Artan</option>
          <option value="desc">Azalan</option>
        </select>
        <select style={select} value={limit} onChange={e => setLimit(Number(e.target.value))}>
          {[5,10,20,50].map(n => (
            <option key={n} value={n}>{n} / sayfa</option>
          ))}
        </select>
      </div>

      {jobs.length === 0
        ? <p>İlan bulunamadı.</p>
        : jobs.map(job => (
          <div key={job.id} style={jobCard}>
            <h3 style={title}>{job.title}</h3>
            <p><strong>Firma:</strong> {job.company}</p>
            <p><strong>Konum:</strong> {job.location}</p>
            <p>{job.description}</p>
            <p><strong>Maaş:</strong> {job.salary || '–'}</p>
            {token && (
              <button style={editBtn} onClick={() => onEdit(job.id)}>
                Düzenle
              </button>
            )}
          </div>
        ))
      }

      {/* Pagination */}
      <div style={{ textAlign:'center', marginTop:24 }}>
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
  );
}
