import React, { useState } from 'react';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Jobs from './Jobs.jsx';
import JobForm from './JobForm.jsx';

export default function App() {
  const [page, setPage] = useState('jobs');

  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        <button onClick={() => setPage('jobs')}>İlanlar</button>
        <button onClick={() => setPage('new')}>Yeni İlan</button>
        <button onClick={() => setPage('register')}>Kayıt</button>
        <button onClick={() => setPage('login')}>Giriş</button>
      </nav>

      {page === 'jobs' && <Jobs />}
      {page === 'new' && <JobForm onCreated={() => setPage('jobs')} />}
      {page === 'register' && <Register />}
      {page === 'login' && <Login />}
    </div>
  );
}
