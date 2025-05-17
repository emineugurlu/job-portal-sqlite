// frontend/src/Profile.jsx

import React, { useState, useEffect } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [name, setName]       = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile]       = useState(null);
  const [message, setMessage] = useState('');

  // Kullanıcının profilini çek
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setName(data.name);
      })
      .catch(() => setMessage('Profil alınamadı'));
  }, []);

  // Profil güncelle
  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, password })
    });
    if (res.ok) {
      setMessage('Profil güncellendi!');
      setPassword('');
    } else {
      setMessage('Profil güncelleme başarısız');
    }
  };

  // CV dosyası seçildi
  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  // CV yükle
  const handleCvUpload = async () => {
    if (!file) {
      setMessage('Önce bir dosya seçin');
      return;
    }
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('cv', file);

    const res = await fetch('/api/profile/cv', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: form
    });

    if (res.ok) {
      const data = await res.json();
      // profile.cv güncelle
      setProfile(prev => ({ ...prev, cv: data.cv }));
      setMessage('CV yüklendi!');
    } else {
      setMessage('CV yükleme başarısız');
    }
  };

  if (!profile) return <p>Yükleniyor...</p>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Profilim</h2>
      <p><strong>Email:</strong> {profile.email}</p>

      <div style={{ marginBottom: 20 }}>
        <label>İsim:</label><br/>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        /><br/><br/>

        <label>Yeni Şifre:</label><br/>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br/><br/>

        <button onClick={handleUpdate}>Güncelle</button>
      </div>

      <hr/>

      <div>
        <h3>CV</h3>

        {/* Eğer daha önce yüklenmiş bir CV varsa linki göster */}
        {profile.cv && (
          <p>
            <a
              href={`/uploads/${profile.cv}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              [Göster]
            </a>
          </p>
        )}

        <input type="file" onChange={handleFileChange} />
        {file && <span style={{ marginLeft: 10 }}>{file.name}</span>}<br/><br/>

        <button onClick={handleCvUpload}>CV Yükle</button>
      </div>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}
