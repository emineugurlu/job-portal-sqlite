// frontend/src/App.jsx

import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import Hero   from './Hero'

import Register from './Register'
import Login    from './Login'
import Jobs     from './Jobs'
import JobForm  from './JobForm'
import JobEdit  from './JobEdit'
import Category from './Category'
import Profile  from './Profile'

export default function App() {
  const [page, setPage]            = useState('home')
  const [token, setToken]          = useState(localStorage.getItem('token'))
  const [userRole, setUserRole]    = useState(null)
  const [editingJobId, setEditing] = useState(null)

  // ①: token değiştiğinde profile’ı çek
  useEffect(() => {
    if (!token) {
      setUserRole(null)
      return
    }

    fetch('/api/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Yetkisiz')
        return res.json()
      })
      .then(data => {
        setUserRole(data.role)      // backend’den dönen role
      })
      .catch(() => {
        setUserRole(null)
      })
  }, [token])

  const handleLogin = newToken => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setPage('jobs')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setPage('login')
  }

  const renderPage = () => {
    if (page === 'home') {
      return <Hero onExplore={() => setPage('jobs')} />
    }

    switch (page) {
      case 'jobs':
        return (
          <Jobs
            token={token}
            userRole={userRole}
            onEdit={id => { setEditing(id); setPage('edit') }}
          />
        )
      case 'new':
        return (token && userRole === 'admin') ? <JobForm onCreated={() => setPage('jobs')} /> : null
      case 'edit':
        return (token && userRole === 'admin')
          ? <JobEdit jobId={editingJobId} onUpdated={() => setPage('jobs')} onCancel={() => setPage('jobs')} />
          : null
      case 'categories':
        return (token && userRole === 'admin') ? <Category /> : null
      case 'profile':
        return token ? <Profile /> : null
      case 'register':
        return !token ? <Register /> : null
      case 'login':
        return !token ? <Login onLogin={handleLogin} /> : null
      default:
        return null
    }
  }

  return (
    <Layout
      page={page}
      token={token}
      userRole={userRole}
      onNav={setPage}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  )
}
