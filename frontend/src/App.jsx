// frontend/src/App.jsx
import React, { useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode'
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

  // Token değiştiğinde role'u çıkar
  useEffect(() => {
    if (token) {
      try {
        const { role } = jwtDecode(token)
        setUserRole(role)
      } catch (err) {
        console.error('Token decode hatası:', err)
        setUserRole(null)
      }
    } else {
      setUserRole(null)
    }
  }, [token])

  const handleLogin = ({ token: newToken, user }) => {
    // Burada Login.jsx'den token ve user objesi nasıl geliyorsa ona göre uyarlayın
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUserRole(user.role)     // ilk ayarlama
    setPage('jobs')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUserRole(null)
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
            userRole={userRole}      // mutlaka burada yollayın
            onEdit={id => {
              setEditing(id)
              setPage('edit')
            }}
          />
        )
      case 'new':
        return token && userRole === 'admin'
          ? <JobForm onCreated={() => setPage('jobs')} />
          : null
      case 'edit':
        return token && userRole === 'admin'
          ? <JobEdit jobId={editingJobId} onUpdated={() => setPage('jobs')} onCancel={() => setPage('jobs')} />
          : null
      case 'categories':
        return token && userRole === 'admin'
          ? <Category />
          : null
      case 'profile':
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
