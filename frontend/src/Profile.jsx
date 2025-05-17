// frontend/src/Profile.jsx
import React, { useState, useEffect } from 'react';

export default function Profile() {
  const [profile, setProfile]   = useState(null);
  const [name, setName]         = useState('');
  const [password, setPassword] = useState('');
  const [cvFile, setCvFile]     = useState(null);
  const [msg, setMsg]           = useState('');

  // 1) Profile yükleyecek async fonksiyon
  const loadProfile = async () => {
    const token = localStorage.getItem('token');
    console.log('🔑 loading profile, token=', token);
    try {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📥 /api/profile status=', res.status);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      console.log('✅ profile data=', data);
      setProfile(data);
      setName(data.name);
    } catch (err) {
      console.error('❌ loadProfile error', err);
      setMsg('Profil yüklenemedi');
    }
  };

  // 2) useEffect içinde async fonksiyonu çağırıyoruz
  useEffect(() => {
    loadProfile();
  }, []);

  // 3) Render öncesi basit hata / yükleniyor kontrolü
  if (msg) return <p style={{ color: 'red' }}>{msg}</p>;
  if (!profile) return <p>Yükleniyor…</p>;

  // 4) Burası artık hata olmadan render edecektir
  return (
    <div style={{ maxWidth:600, margin:'auto', padding:20 }}>
      <h2>Profilim</h2>
      <p><strong>Email:</strong> {profile.email}</p>

      <form onSubmit={e => {
        e.preventDefault();
        (async () => {
          const token = localStorage.getItem('token');
          const res = await fetch('/api/profile', {
            method: 'PUT',
            headers: {
              'Content-Type':'application/json',
              'Authorization':`Bearer ${token}`
            },
            body: JSON.stringify({ name, password })
          });
          if (res.ok) {
            setMsg('Profil güncellendi');
            setPassword('');
            loadProfile();
          } else {
            setMsg('Güncelleme başarısız');
          }
        })();
      }}>
        <label>İsim:</label><br/>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
        /><br/><br/>

        <label>Yeni Şifre:</label><br/>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br/><br/>

        <button type="submit">Güncelle</button>
      </form>

      <hr style={{ margin:'20px 0' }}/>

      <h3>CV {profile.cv && (
        <a
          href={`/uploads/${profile.cv}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          [Göster]
        </a>
      )}</h3>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={e => setCvFile(e.target.files[0])}
      /><br/><br/>

      <button onClick={async () => {
        if (!cvFile) return setMsg('Önce dosya seçin');
        const token = localStorage.getItem('token');
        const fd = new FormData();
        fd.append('cv', cvFile);
        const res = await fetch('/api/profile/cv', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd
        });
        if (res.ok) {
          setMsg('CV yüklendi!');
          loadProfile();
        } else {
          setMsg('CV yükleme başarısız');
        }
      }}>CV Yükle</button>

      {msg && <p style={{ marginTop:20 }}>{msg}</p>}
    </div>
  );
}
