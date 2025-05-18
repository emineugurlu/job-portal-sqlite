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

  // 1) Token değiştiğinde payload'tan role'u çıkarıp state'e yazıyoruz
  useEffect(() => {
    if (token) {
      try {
        const base64Url = token.split('.')[1]
        const base64    = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('')
        )
        const payload = JSON.parse(jsonPayload)
        setUserRole(payload.role)
      } catch (err) {
        console.error('Token parse hatası:', err)
        setUserRole(null)
      }
    } else {
      setUserRole(null)
    }
  }, [token])

  // 2) Login'den hem token hem de user objesini alacak şekilde
  const handleLogin = ({ token: newToken, user }) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUserRole(user.role)
    setPage('jobs')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUserRole(null)
    setPage('login')
  }

  // 3) Sayfa seçimine göre hangi bileşeni göstereceğiz
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
            onEdit={id => {
              setEditing(id)
              setPage('edit')
            }}
          />
        )
      case 'new':
        // Sadece admin yeni ilan ekleyebilir
        return (token && userRole === 'admin')
          ? <JobForm onCreated={() => setPage('jobs')} />
          : null
      case 'edit':
        // Sadece admin düzenleyebilir
        return (token && userRole === 'admin')
          ? <JobEdit jobId={editingJobId} onUpdated={() => setPage('jobs')} onCancel={() => setPage('jobs')} />
          : null
      case 'categories':
        // Sadece admin kategori yönetebilir
        return (token && userRole === 'admin')
          ? <Category />
          : null
      case 'profile':
        // Tüm authenticated kullanıcılar
        return token
          ? <Profile />
          : null
      case 'register':
        return !token
          ? <Register />
          : null
      case 'login':
        return !token
          ? <Login onLogin={handleLogin} />
          : null
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
