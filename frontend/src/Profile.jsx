import React, { useState, useEffect } from 'react'
import './Profile.css'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [name, setName]       = useState('')
  const [password, setPassword] = useState('')
  const [cvFile, setCvFile]   = useState(null)
  const [msg, setMsg]         = useState('')

  const token = localStorage.getItem('token')

  // Profil verisini çek
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setProfile(data)
        setName(data.name)
      } catch (err) {
        console.error(err)
      }
    }
    fetchProfile()
  }, [token])

  // İsim/şifre güncelle
  const updateProfile = async e => {
    e.preventDefault()
    try {
      const res = await fetch('/api/profile', {
        method:  'PUT',
        headers: {
          'Content-Type':  'application/json',
          Authorization:   `Bearer ${token}`
        },
        body: JSON.stringify({ name, password })
      })
      if (res.ok) {
        setMsg('Profil güncellendi')
        setPassword('')
        setTimeout(() => setMsg(''), 2000)
      } else {
        setMsg('Güncelleme başarısız')
      }
    } catch {
      setMsg('Sunucu hatası')
    }
  }

  // CV yükleme
  const uploadCv = async () => {
    if (!cvFile) {
      setMsg('Önce dosya seçin')
      return
    }
    const fd = new FormData()
    fd.append('cv', cvFile)
    try {
      const res = await fetch('/api/profile/cv', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      })
      if (res.ok) {
        setMsg('CV yüklendi!')
        setTimeout(() => setMsg(''), 2000)
      } else {
        setMsg('CV yükleme başarısız')
      }
    } catch {
      setMsg('Sunucu hatası')
    }
  }

  if (!profile) return <p className="loading">Yükleniyor…</p>

  return (
    <div className="profile-card">
      <div className="profile-left">
        <h2>Profilim</h2>
        <p><strong>Email:</strong> {profile.email}</p>
        <form className="profile-form" onSubmit={updateProfile}>
          <label>İsim:</label>
          <input
            type="text"
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
        {msg && <div className="profile-msg">{msg}</div>}
      </div>

      <div className="profile-right">
        <h3>CV {profile.cv && (
          <a
            href={`/uploads/${profile.cv}`}
            target="_blank"
            rel="noopener noreferrer"
          >[Göster]</a>
        )}</h3>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={e => setCvFile(e.target.files[0])}
        />
        <button onClick={uploadCv}>CV Yükle</button>
      </div>
    </div>
  )
}
