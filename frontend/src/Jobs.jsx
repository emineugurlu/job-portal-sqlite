import React, { useEffect, useState } from 'react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data);
    } catch {
      console.error('İlanlar yüklenemedi');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Silmek istediğine emin misin?')) return;
    try {
      await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      fetchJobs();
    } catch {
      console.error('Silme başarısız');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>İş İlanları</h2>
      {jobs.length === 0 && <p>Henüz ilan yok.</p>}
      <ul>
        {jobs.map(j => (
          <li key={j.id} style={{ marginBottom: 20 }}>
            <h3>{j.title}</h3>
            <p><strong>Firma:</strong> {j.company}</p>
            <p><strong>Konum:</strong> {j.location}</p>
            <p>{j.description}</p>
            <p><strong>Maaş:</strong> {j.salary || 'Belirtilmemiş'}</p>
            <button onClick={() => handleDelete(j.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
