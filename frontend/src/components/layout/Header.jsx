import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-logo">
          Task Manager
        </Link>
        
        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/tasks" className="nav-link">
                Tâches
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Bonjour, {user?.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline"
                >
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Connexion
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header