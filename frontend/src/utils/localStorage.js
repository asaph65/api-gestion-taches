import { LOCAL_STORAGE_KEYS } from './constants'

/**
 * Sauvegarde le token JWT dans le localStorage
 */
export const saveToken = (token) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token)
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du token:', error)
  }
}

/**
 * Récupère le token JWT du localStorage
 */
export const getToken = () => {
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error)
    return null
  }
}

/**
 * Supprime le token JWT du localStorage
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN)
  } catch (error) {
    console.error('Erreur lors de la suppression du token:', error)
  }
}

/**
 * Sauvegarde les informations utilisateur dans le localStorage
 */
export const saveUser = (user) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user))
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error)
  }
}

/**
 * Récupère les informations utilisateur du localStorage
 */
export const getUser = () => {
  try {
    const user = localStorage.getItem(LOCAL_STORAGE_KEYS.USER)
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    return null
  }
}

/**
 * Supprime les informations utilisateur du localStorage
 */
export const removeUser = () => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error)
  }
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export const isAuthenticated = () => {
  return !!getToken()
}

/**
 * Déconnexion - supprime toutes les données d'authentification
 */
export const logout = () => {
  removeToken()
  removeUser()
}

/**
 * Nettoye le localStorage
 */
export const clearStorage = () => {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Erreur lors du nettoyage du localStorage:', error)
  }
}