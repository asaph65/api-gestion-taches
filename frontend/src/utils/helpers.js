import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from './constants'

/**
 * Formate une date en format lisible
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (error) {
    return 'Date invalide'
  }
}

/**
 * Formate une date simple (sans l'heure)
 */
export const formatSimpleDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  } catch (error) {
    return 'Date invalide'
  }
}

/**
 * Obtenir le label d'un statut de tâche
 */
export const getStatusLabel = (status) => {
  return TASK_STATUS_LABELS[status] || status
}

/**
 * Obtenir le label d'une priorité
 */
export const getPriorityLabel = (priority) => {
  return TASK_PRIORITY_LABELS[priority] || priority
}

/**
 * Vérifie si une date est passée
 */
export const isPastDue = (dueDate) => {
  if (!dueDate) return false
  try {
    const due = new Date(dueDate)
    const now = new Date()
    return due < now
  } catch (error) {
    return false
  }
}

/**
 * Calcule le nombre de jours restants
 */
export const getDaysRemaining = (dueDate) => {
  if (!dueDate) return null
  
  try {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  } catch (error) {
    return null
  }
}

/**
 * Génère un ID unique temporaire (pour les formulaires)
 */
export const generateTempId = () => {
  return 'temp_' + Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Valide une date
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date)
}

/**
 * Débounce une fonction
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}