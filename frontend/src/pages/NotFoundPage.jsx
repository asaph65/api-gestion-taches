import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="text-center py-12">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-6">
          Page non trouvée
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn btn-primary">
            Retour à l'accueil
          </Link>
          <Link to="/dashboard" className="btn btn-outline">
            Aller au dashboard
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default NotFoundPage