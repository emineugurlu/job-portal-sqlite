// frontend/src/Layout.jsx
import React from 'react';

export default function Layout({ page, token, onNav, onLogout, children }) {
  const headerStyle = {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'center',
    padding:        '0 24px',
    height:         64,
    background:     '#6A1B9A',   // derin mor
    color:          '#fff',
    fontFamily:     'Arial, sans-serif',
  };
  const leftGroup = {
    display:    'flex',
    alignItems: 'center',
    gap:        16,
  };
  const navStyle = {
    display:    'flex',
    gap:        12,
    marginLeft: 24,
  };
  const rightGroup = {
    display: 'flex',
    gap:     12,
    alignItems: 'center'
  };
  const btn = {
    border:        'none',
    padding:       '8px 16px',
    borderRadius:  4,
    cursor:        'pointer',
    fontSize:      14,
    background:    'transparent',
    color:         '#fff',
  };
  const btnPrimary = {
    ...btn,
    background:    '#9575CD',  // açık mor
  };

  return (
    <>
      <header style={headerStyle}>
        {/* sol taraf: logo + menüler */}
        <div style={leftGroup}>
          <img
            src="/logo.png"
            alt="JobPortal"
            style={{ height: 40, objectFit: 'contain' }}
          />
          <span style={{ fontSize: 20, fontWeight: 'bold' }}>
            JobPortal
          </span>
          <nav style={navStyle}>
            <button style={btn} onClick={() => onNav('jobs')}>
              İlanlar
            </button>
            {token && (
              <>
                <button style={btn} onClick={() => onNav('new')}>
                  Yeni İlan
                </button>
                <button style={btn} onClick={() => onNav('categories')}>
                  Kategoriler
                </button>
                <button style={btn} onClick={() => onNav('profile')}>
                  Profil
                </button>
              </>
            )}
          </nav>
        </div>

        {/* sağ taraf: oturum butonları */}
        <div style={rightGroup}>
          {!token ? (
            <>
              <button style={btn} onClick={() => onNav('register')}>
                Kayıt Ol
              </button>
              <button style={btnPrimary} onClick={() => onNav('login')}>
                Giriş Yap
              </button>
            </>
          ) : (
            <button style={btnPrimary} onClick={onLogout}>
              Çıkış Yap
            </button>
          )}
        </div>
      </header>

      <main style={{ padding: 24, minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </main>
    </>
  );
}
