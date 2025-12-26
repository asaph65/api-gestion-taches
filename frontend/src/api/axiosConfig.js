import axios from 'axios'
import { API_URL } from '../utils/constants'
import { getToken, logout } from '../utils/localStorage'

// Création de l'instance axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 secondes timeout
})

// Intercepteur pour ajouter le token à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs de réponse
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Erreurs HTTP
      switch (error.response.status) {
        case 401:
          // Non autorisé - déconnecter l'utilisateur
          logout()
          window.location.href = '/login?session=expired'
          break
        case 403:
          // Interdit
          console.error('Accès interdit:', error.response.data)
          break
        case 404:
          // Ressource non trouvée
          console.error('Ressource non trouvée:', error.response.data)
          break
        case 500:
          // Erreur serveur
          console.error('Erreur serveur:', error.response.data)
          break
        default:
          console.error('Erreur HTTP:', error.response.status, error.response.data)
      }
    } else if (error.request) {
      // Pas de réponse du serveur
      console.error('Pas de réponse du serveur:', error.request)
    } else {
      // Erreur lors de la configuration de la requête
      console.error('Erreur de configuration:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default axiosInstance