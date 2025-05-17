// frontend/src/Layout.jsx
import React from 'react';

export default function Layout({ page, token, onNav, onLogout, children }) {
  const headerStyle = {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'center',
    padding:        '0 20px',
    height:         60,
    background:     '#4A148C', // deep purple
    color:          'white',
    fontFamily:     'sans-serif',
  };

  const brandStyle = {
    display:    'flex',
    alignItems: 'center',
    gap:        12,
  };

  const titleStyle = {
    fontSize:   22,
    fontWeight: 'bold',
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  };

  const btnBase = {
    border:       'none',
    padding:      '6px 12px',
    borderRadius: 4,
    cursor:       'pointer',
    fontSize:     14,
  };

  const linkBtn = {
    ...btnBase,
    background: 'transparent',
    color:      'white',
  };

  const loginBtn = {
    ...btnBase,
    background: '#9575CD',  // light purple
    color:      'white',
  };

  const logoutBtn = {
    ...btnBase,
    background: '#D1C4E9',  // pale purple
    color:      '#4A148C',
  };

  return (
    <>
      <header style={headerStyle}>
        {/* Sol: logo + başlık */}
        <div style={brandStyle}>
          <img
            src="/logo.png"
            alt="JobPortal"
            style={{ height: 40, width: 40, objectFit: 'contain' }}
          />
          <span style={titleStyle}>JobPortal</span>
        </div>

        {/* Sağ: navigasyon + auth butonları */}
        <div style={navStyle}>
          {/* Ortak menüler */}
          <button style={linkBtn} onClick={() => onNav('jobs')}>İlanlar</button>
          {!token && (
            <button style={linkBtn} onClick={() => onNav('register')}>Kayıt</button>
          )}
          {token && (
            <>
              <button style={linkBtn} onClick={() => onNav('new')}>Yeni İlan</button>
              <button style={linkBtn} onClick={() => onNav('categories')}>Kategoriler</button>
              <button style={linkBtn} onClick={() => onNav('profile')}>Profil</button>
            </>
          )}

          {/* Auth butonları */}
          {!token ? (
            <button style={loginBtn} onClick={() => onNav('login')}>Giriş Yap</button>
          ) : (
            <button style={logoutBtn} onClick={onLogout}>Çıkış Yap</button>
          )}
        </div>
      </header>

      <main style={{ padding: 20 }}>
        {children}
      </main>
    </>
  );
}
