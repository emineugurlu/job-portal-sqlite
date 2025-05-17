// frontend/src/App.jsx
import React, { useState } from 'react';
import Layout from './Layout.jsx';

import Register  from './Register.jsx';
import Login     from './Login.jsx';
import Jobs      from './Jobs.jsx';
import JobForm   from './JobForm.jsx';
import JobEdit   from './JobEdit.jsx';
import Category  from './Category.jsx';
import Profile   from './Profile.jsx';

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

  // Hangi bileşenin görüntüleneceğini belirleyen fonksiyon
  const renderPage = () => {
    switch (page) {
      case 'jobs':
        return (
          <Jobs
            token={token}
            onEdit={id => {
              setEditing(id);
              setPage('edit');
            }}
          />
        );
      case 'new':
        return token ? <JobForm onCreated={() => setPage('jobs')} /> : null;
      case 'edit':
        return (
          <JobEdit
            jobId={editingJobId}
            onUpdated={() => setPage('jobs')}
            onCancel={() => setPage('jobs')}
          />
        );
      case 'categories':
        return <Category />;
      case 'profile':
        return <Profile />;
      case 'register':
        return <Register />;
      case 'login':
        return <Login onLogin={handleLogin} />;
      default:
        return <Jobs />;
    }
  };

  return (
    <Layout
      page={page}
      token={token}
      onNav={key => setPage(key)}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}
