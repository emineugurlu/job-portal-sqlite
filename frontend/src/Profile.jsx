import React, { useState, useEffect } from 'react';
import './Profile.css'; // Aşağıdaki CSS’i buraya koyacağız

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');
  const [showInline, setShowInline] = useState(false);

  const token = localStorage.getItem('token');

  // Profil verisini çek
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setProfile(data);
        setName(data.name);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, [token]);

  // İsim/şifre güncelle
  const updateProfile = async e => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, password })
      });
      if (res.ok) {
        setPassword('');
        // Yeniden profil çek
        const updated = await res.json();
        setProfile(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CV yükleme
  const uploadCv = async () => {
    if (!cvFile) return setUploadMsg('Önce bir dosya seçin');
    const fd = new FormData();
    fd.append('cv', cvFile);
    setUploadMsg('Yükleniyor…');
    try {
      const res = await fetch('/api/profile/cv', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      if (res.ok) {
        setUploadMsg('Yükleme başarılı ✔️');
        // Profili yenile
        const { cv } = await res.json();
        setProfile(p => ({ ...p, cv }));
      } else {
        setUploadMsg('Yükleme başarısız ❌');
      }
    } catch (err) {
      console.error(err);
      setUploadMsg('Sunucu hatası ❌');
    }
  };

  if (!profile) return <p>Yükleniyor…</p>;

  return (
    <div className="profile-container">
      <h2>Profilim</h2>
      <p><strong>Email:</strong> {profile.email}</p>

      <form onSubmit={updateProfile} className="profile-form">
        <label>İsim:</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label>Yeni Şifre:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Güncelle</button>
      </form>

      <hr />

      {/** CV Adım Şeması **/}
      <div className="cv-wizard">
        <div className={`cv-step completed`}>
          <span>1</span> Profilde Mevcut
        </div>
        <div className={`cv-step ${cvFile ? 'completed' : ''}`}>
          <span>2</span> Dosya Seç
        </div>
        <div className={`cv-step ${uploadMsg.includes('başarılı') ? 'completed' : ''}`}>
          <span>3</span> Yükle
        </div>
        <div className={`cv-status ${uploadMsg.includes('başarılı') ? 'success' : uploadMsg.includes('Yükleniyor') ? '' : 'error'}`}>
          {uploadMsg || 'Henüz başlamadı'}
        </div>
      </div>

      {/** Inline Önizleme Butonu **/}
      {profile.cv && (
        <button className="cv-inline-btn" onClick={() => setShowInline(s => !s)}>
          {showInline ? 'Önizlemeyi Kapat' : 'CV Önizle'}
        </button>
      )}
      {showInline && profile.cv && (
        <iframe
          src={`/uploads/${profile.cv}`}
          className="cv-inline-frame"
          title="CV Önizleme"
        />
      )}

      {/** İkonlu buton + input + yükleme **/}
      <div className="cv-row">
        <label className="cv-label">CV Aktar:</label>
        <div className="cv-actions">
          {profile.cv && (
            <button className="cv-icon-btn" onClick={() => window.open(`/uploads/${profile.cv}`, '_blank')}>
              📄 Önizle
            </button>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={e => {
              setCvFile(e.target.files[0]);
              setUploadMsg('');
            }}
            className="cv-input"
          />
          <button className="cv-upload-btn" disabled={!cvFile} onClick={uploadCv}>
            ⬆️ Yükle
          </button>
        </div>
      </div>
    </div>
  );
}
