import React, { createContext, useState, useContext, useEffect } from 'react'

// Créer le contexte
const AuthContext = createContext({})

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const token = localStorage.getItem('task_manager_token')
    const savedUser = localStorage.getItem('task_manager_user')

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Erreur lors du parsing des données utilisateur:', e)
      }
    }

    setLoading(false)
  }, [])

  // Fonctions d'authentification (simplifiées pour l'instant)
  const register = async (userData) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser = {
        id: '123',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'user'
      }
      
      localStorage.setItem('task_manager_token', 'mock_token_123')
      localStorage.setItem('task_manager_user', JSON.stringify(mockUser))
      setUser(mockUser)
      setSuccess('Inscription réussie !')
      
      return { success: true }
    } catch (error) {
      setError('Erreur lors de l\'inscription')
      return { success: false, error: 'Erreur lors de l\'inscription' }
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser = {
        id: '123',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      }
      
      localStorage.setItem('task_manager_token', 'mock_token_123')
      localStorage.setItem('task_manager_user', JSON.stringify(mockUser))
      setUser(mockUser)
      setSuccess('Connexion réussie !')
      
      return { success: true }
    } catch (error) {
      setError('Identifiants invalides')
      return { success: false, error: 'Identifiants invalides' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('task_manager_token')
    localStorage.removeItem('task_manager_user')
    setUser(null)
    setSuccess('Déconnexion réussie')
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const value = {
    user,
    loading,
    error,
    success,
    register,
    login,
    logout,
    clearMessages,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}