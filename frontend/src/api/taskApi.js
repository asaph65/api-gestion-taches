import axiosInstance from './axiosConfig'

/**
 * API pour la gestion des tâches
 */
export const taskApi = {
  /**
   * Créer une nouvelle tâche
   */
  createTask: async (taskData) => {
    const response = await axiosInstance.post('/tasks', taskData)
    return response.data
  },

  /**
   * Récupérer toutes les tâches avec filtres et pagination
   */
  getTasks: async (params = {}) => {
    const response = await axiosInstance.get('/tasks', { params })
    return response.data
  },

  /**
   * Récupérer les statistiques des tâches
   */
  getTaskStats: async () => {
    const response = await axiosInstance.get('/tasks/stats')
    return response.data
  },

  /**
   * Récupérer une tâche par son ID
   */
  getTaskById: async (taskId) => {
    const response = await axiosInstance.get(`/tasks/${taskId}`)
    return response.data
  },

  /**
   * Mettre à jour une tâche
   */
  updateTask: async (taskId, taskData) => {
    const response = await axiosInstance.put(`/tasks/${taskId}`, taskData)
    return response.data
  },

  /**
   * Supprimer une tâche
   */
  deleteTask: async (taskId) => {
    const response = await axiosInstance.delete(`/tasks/${taskId}`)
    return response.data
  },

  /**
   * Marquer une tâche comme terminée
   */
  completeTask: async (taskId) => {
    const response = await axiosInstance.patch(`/tasks/${taskId}/complete`)
    return response.data
  },

  /**
   * Archiver une tâche
   */
  archiveTask: async (taskId) => {
    const response = await axiosInstance.patch(`/tasks/${taskId}/archive`)
    return response.data
  },

  /**
   * Restaurer une tâche archivée
   */
  restoreTask: async (taskId) => {
    const response = await axiosInstance.patch(`/tasks/${taskId}/restore`)
    return response.data
  },

  /**
   * Ajouter un tag à une tâche
   */
  addTagToTask: async (taskId, tag) => {
    const response = await axiosInstance.patch(`/tasks/${taskId}/tags`, { tag })
    return response.data
  },

  /**
   * Supprimer un tag d'une tâche
   */
  removeTagFromTask: async (taskId, tag) => {
    const response = await axiosInstance.delete(`/tasks/${taskId}/tags/${tag}`)
    return response.data
  }
}