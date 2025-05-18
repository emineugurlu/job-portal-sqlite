// frontend/src/Layout.jsx
import React from 'react';

export default function Layout({ page, token, userRole, onNav, onLogout, children }) {
  const headerStyle = {
    display:    'flex',
    alignItems: 'center',
    padding:    '0 20px',
    height:     60,
    background: '#6A1B9A',  // koyu mor
    color:      'white',
    fontFamily: 'sans-serif',
  };

  const leftGroup = {
    display:    'flex',
    alignItems: 'center',
    gap:        12,
  };

  const centerGroup = {
    display:    'flex',
    gap:        16,
    marginLeft: 'auto',   // menüyü sağa iter
    alignItems: 'center',
  };

  const rightGroup = {
    marginLeft: 16,
  };

  const btnBase = {
    background:   'transparent',
    border:       'none',
    color:        'white',
    padding:      '8px 12px',
    borderRadius: 4,
    cursor:       'pointer',
    fontSize:     14,
  };

  const loginBtn = {
    ...btnBase,
    background: '#D1C4E9',   // açık mor
    color:      '#4A148C',
  };

  const logoutBtn = {
    ...btnBase,
    background: '#F48FB1',   // yumuşak pembe
    color:      '#6A1B9A',
  };

  return (
    <>
      <header style={headerStyle}>
        {/* Logo ve başlık */}
        <div style={leftGroup}>
          <img
            src="/logo.png"
            alt="JobPortal"
            style={{ height: 40, width: 40, objectFit: 'contain' }}
          />
          <span style={{ fontSize: 20, fontWeight: 'bold' }}>JobPortal</span>
        </div>

        {/* Menü butonları */}
        <nav style={centerGroup}>
          <button style={btnBase} onClick={() => onNav('home')}>
            Anasayfa
          </button>
          <button style={btnBase} onClick={() => onNav('jobs')}>
            İlanlar
          </button>

          {/* Sadece admin görebilir */}
          {token && userRole === 'admin' && (
            <>
              <button style={btnBase} onClick={() => onNav('new')}>
                Yeni İlan
              </button>
              <button style={btnBase} onClick={() => onNav('categories')}>
                Kategoriler
              </button>
            </>
          )}

          {/* Girişli herkes görebilir */}
          {token && (
            <button style={btnBase} onClick={() => onNav('profile')}>
              Profil
            </button>
          )}

          {/* Giriş yapmamış kullanıcılar */}
          {!token && (
            <button style={btnBase} onClick={() => onNav('register')}>
              Kayıt Ol
            </button>
          )}
        </nav>

        {/* Giriş / Çıkış butonları */}
        <div style={rightGroup}>
          {!token ? (
            <button style={loginBtn} onClick={() => onNav('login')}>
              Giriş Yap
            </button>
          ) : (
            <button style={logoutBtn} onClick={onLogout}>
              Çıkış Yap
            </button>
          )}
        </div>
      </header>

      <main style={{ padding: 0 }}>
        {children}
      </main>
    </>
  );
}
