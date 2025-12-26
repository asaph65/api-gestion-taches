import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { useAuth } from '../contexts/AuthContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Alert from '../components/common/Alert'

const ProfilePage = () => {
  const { user, updateProfile, changePassword, success, error, clearMessages } = useAuth()
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [profileErrors, setProfileErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoadingProfile(true)
    clearMessages()
    
    const errors = {}
    if (!profileData.firstName.trim()) errors.firstName = 'Le prénom est requis'
    if (!profileData.lastName.trim()) errors.lastName = 'Le nom est requis'
    
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors)
      setLoadingProfile(false)
      return
    }
    
    const result = await updateProfile(profileData)
    setLoadingProfile(false)
    
    if (result.success) {
      setProfileErrors({})
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoadingPassword(true)
    clearMessages()
    
    const errors = {}
    if (!passwordData.currentPassword) errors.currentPassword = 'Le mot de passe actuel est requis'
    if (!passwordData.newPassword) errors.newPassword = 'Le nouveau mot de passe est requis'
    if (passwordData.newPassword.length < 6) errors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères'
    if (passwordData.newPassword !== passwordData.confirmPassword) errors.confirmPassword = 'Les mots de passe ne correspondent pas'
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      setLoadingPassword(false)
      return
    }
    
    const result = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    })
    
    setLoadingPassword(false)
    
    if (result.success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setPasswordErrors({})
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Mon compte</h1>
        <p className="page-subtitle">
          Gérez vos informations personnelles et votre mot de passe
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations du profil */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>
          
          {success && (
            <Alert type="success" message={success} />
          )}
          {error && (
            <Alert type="error" message={error} />
          )}
          
          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                label="Prénom"
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                error={profileErrors.firstName}
                required
              />
              
              <Input
                label="Nom"
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                error={profileErrors.lastName}
                required
              />
            </div>
            
            <Input
              label="Email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-gray-50"
            />
            
            <div className="mt-6">
              <Button
                type="submit"
                variant="primary"
                loading={loadingProfile}
                disabled={loadingProfile}
              >
                Mettre à jour le profil
              </Button>
            </div>
          </form>
        </div>

        {/* Changement de mot de passe */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Changer le mot de passe</h2>
          
          <form onSubmit={handlePasswordSubmit}>
            <Input
              label="Mot de passe actuel"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Votre mot de passe actuel"
              error={passwordErrors.currentPassword}
              required
            />
            
            <Input
              label="Nouveau mot de passe"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Au moins 6 caractères"
              error={passwordErrors.newPassword}
              required
            />
            
            <Input
              label="Confirmer le nouveau mot de passe"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Retapez le nouveau mot de passe"
              error={passwordErrors.confirmPassword}
              required
            />
            
            <div className="mt-6">
              <Button
                type="submit"
                variant="primary"
                loading={loadingPassword}
                disabled={loadingPassword}
              >
                Changer le mot de passe
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Informations du compte */}
      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-6">Informations du compte</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">ID du compte</h3>
            <p className="text-gray-600">{user?._id || '-'}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Rôle</h3>
            <p className="text-gray-600">
              {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Date d'inscription</h3>
            <p className="text-gray-600">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '-'}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Dernière mise à jour</h3>
            <p className="text-gray-600">
              {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('fr-FR') : '-'}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProfilePage