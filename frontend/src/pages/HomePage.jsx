import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { useAuth } from '../contexts/AuthContext'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Layout>
      <div className="text-center py-12">
        <h1 className="page-title mb-4">
          Bienvenue sur Task Manager
        </h1>
        <p className="page-subtitle mb-8 max-w-2xl mx-auto">
          Gérez efficacement vos tâches avec notre application.
        </p>
        
        {isAuthenticated ? (
          <Link to="/dashboard" className="btn btn-primary">
            Accéder au Dashboard
          </Link>
        ) : (
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn btn-primary">
              S'inscrire
            </Link>
            <Link to="/login" className="btn btn-outline">
              Se connecter
            </Link>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default HomePage