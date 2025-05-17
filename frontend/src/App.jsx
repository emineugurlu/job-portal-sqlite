import React, { useState } from 'react'
import Layout from './Layout'
import Hero   from './Hero'      // Hero bileşenini import ettik

import Register from './Register'
import Login    from './Login'
import Jobs     from './Jobs'
import JobForm  from './JobForm'
import JobEdit  from './JobEdit'
import Category from './Category'
import Profile  from './Profile'

export default function App() {
  // Başlangıçta ana sayfa (Hero)
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
    // 'home' için sadece Hero
    if (page === 'home') {
      // onExplore ile ilanlar sayfasına geçiş yapıyoruz
      return <Hero onExplore={() => setPage('jobs')} />
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
