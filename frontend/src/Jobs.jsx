import React, { useEffect, useState } from 'react';
import JobEdit from './JobEdit.jsx';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchJobs = async () => {
    const res = await fetch('/api/jobs');
    const data = await res.json();
    setJobs(data);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async id => {
    if (!window.confirm('Silmek istediğine emin misin?')) return;
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    fetchJobs();
  };

  // Edit işlemi sonrası ve İptal’de listeye dön
  const handleUpdated = () => {
    setEditId(null);
    fetchJobs();
  };

  const handleCancel = () => setEditId(null);

  // Eğer editId doluysa JobEdit’i göster
  if (editId) {
    return <JobEdit
      jobId={editId}
      onUpdated={handleUpdated}
      onCancel={handleCancel}
    />;
  }

  // Normal liste görünümü
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
            <button onClick={() => setEditId(j.id)}>Düzenle</button>
            <button onClick={() => handleDelete(j.id)} style={{ marginLeft: 5 }}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
