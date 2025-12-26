// Configuration de l'API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Task Manager'

// Statuts des tâches
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  ARCHIVED: 'archived'
}

export const TASK_STATUS_LABELS = {
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminée',
  archived: 'Archivée'
}

export const TASK_STATUS_COLORS = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800',
  archived: 'bg-purple-100 text-purple-800'
}

// Priorités des tâches
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
}

export const TASK_PRIORITY_LABELS = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute'
}

export const TASK_PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
}

// Clés de localStorage
export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'task_manager_token',
  USER: 'task_manager_user'
}

// Routes protégées
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/tasks',
  '/profile',
  '/settings'
]