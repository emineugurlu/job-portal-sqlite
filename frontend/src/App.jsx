// frontend/src/App.jsx

import React, { useState } from 'react'
import Layout from './Layout'
import Hero   from './Hero'      // 1) Hero bileşenini import ettik

import Register from './Register'
import Login    from './Login'
import Jobs     from './Jobs'
import JobForm  from './JobForm'
import JobEdit  from './JobEdit'
import Category from './Category'
import Profile  from './Profile'

export default function App() {
  // 2) Varsayılan sayfayı artık 'home' olarak ayarladık
  const [page, setPage]            = useState('home')
  const [token, setToken]          = useState(localStorage.getItem('token'))
  const [editingJobId, setEditing] = useState(null)

  const handleLogin = newToken => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setPage('jobs')  // Girişten sonra ilanlar sayfasına yönlendir
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setPage('login')
  }

  const renderPage = () => {
    // 3) 'home' sayfası yalnızca Hero bileşenini gösterir
    if (page === 'home') {
      return <Hero />
    }

    switch (page) {
      case 'jobs':
        return (
          <Jobs
            token={token}
            onEdit={id => {
              setEditing(id)
              setPage('edit')
            }}
          />
        )
      case 'new':
        return token ? <JobForm onCreated={() => setPage('jobs')} /> : null
      case 'edit':
        return (
          <JobEdit
            jobId={editingJobId}
            onUpdated={() => setPage('jobs')}
            onCancel={() => setPage('jobs')}
          />
        )
      case 'categories':
        return token ? <Category /> : null
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
      onNav={key => setPage(key)}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  )
}
