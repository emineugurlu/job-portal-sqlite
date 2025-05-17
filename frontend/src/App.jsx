// frontend/src/App.jsx

import React, { useState } from 'react';
import Register   from './Register.jsx';
import Login      from './Login.jsx';
import Jobs       from './Jobs.jsx';
import JobForm    from './JobForm.jsx';
import JobEdit    from './JobEdit.jsx';
import Category   from './Category.jsx';
import Profile    from './Profile.jsx';

export default function App() {
  const [page, setPage]            = useState('jobs');
  const [token, setToken]          = useState(localStorage.getItem('token'));
  const [editingJobId, setEditing] = useState(null);

  const handleLogin = newToken => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setPage('jobs');
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
        {token && <button onClick={() => setPage('categories')}>Kategoriler</button>}
        {token && <button onClick={() => setPage('profile')}>Profil</button>}
        {!token && <button onClick={() => setPage('register')}>Kayıt</button>}
        {!token && <button onClick={() => setPage('login')}>Giriş</button>}
        {token   && <button onClick={handleLogout}>Çıkış Yap</button>}
      </nav>

      {page === 'jobs' && (
        <Jobs
          token={token}
          onEdit={id => {
            setEditing(id);
            setPage('edit');
          }}
        />
      )}

      {page === 'new' && token && (
        <JobForm onCreated={() => setPage('jobs')} />
      )}

      {page === 'edit' && editingJobId && (
        <JobEdit
          jobId={editingJobId}
          onUpdated={() => setPage('jobs')}
          onCancel={() => setPage('jobs')}
        />
      )}

      {page === 'categories' && token && <Category />}

      {page === 'profile' && token && <Profile />}

      {page === 'register' && !token && <Register />}

      {page === 'login' && !token && <Login onLogin={handleLogin} />}
    </div>
  );
}
