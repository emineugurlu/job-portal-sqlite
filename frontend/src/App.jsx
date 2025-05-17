// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Jobs from './Jobs.jsx';
import JobForm from './JobForm.jsx';
import JobEdit from './JobEdit.jsx';

export default function App() {
  const [page, setPage] = useState('jobs');
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Bu fonksiyon Login’den çağrılacak:
  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setPage('jobs');          // girişten sonra ilanlar sayfasına dön
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setPage('login');
  };

  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        <button onClick={() => setPage('jobs')}>İlanlar</button>
        {token && <button onClick={() => setPage('new')}>Yeni İlan</button>}
        {!token && <button onClick={() => setPage('register')}>Kayıt</button>}
        {!token && <button onClick={() => setPage('login')}>Giriş</button>}
        {token && <button onClick={handleLogout}>Çıkış Yap</button>}
      </nav>

      {page === 'jobs' && <Jobs />}

      {page === 'new' && token && (
        <JobForm onCreated={() => setPage('jobs')} />
      )}

      {page === 'register' && <Register />}

      {page === 'login' && (
        <Login onLogin={handleLogin} />
      )}

      {/* Eğer JobEdit’i doğrudan App’den yönetiyorsan */}
      {/* {page === 'edit' && <JobEdit jobId={...} onUpdated={...} onCancel={() => setPage('jobs')} />} */}
    </div>
  );
}
