import React, { createContext, useState, useContext } from 'react'

// Créer le contexte
const TaskContext = createContext({})

// Hook personnalisé pour utiliser le contexte
export const useTasks = () => useContext(TaskContext)

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Fonctions pour les tâches (simplifiées pour l'instant)
  const fetchTasks = async () => {
    setLoading(true)
    try {
      // Simuler des données de tâches
      const mockTasks = [
        { _id: '1', title: 'Faire les courses', status: 'todo', priority: 'medium' },
        { _id: '2', title: 'Réunion d\'équipe', status: 'in_progress', priority: 'high' },
        { _id: '3', title: 'Terminer le rapport', status: 'done', priority: 'medium' }
      ]
      
      setTasks(mockTasks)
      return { success: true, data: mockTasks }
    } catch (error) {
      setError('Erreur lors de la récupération des tâches')
      return { success: false, error: 'Erreur lors de la récupération des tâches' }
    } finally {
      setLoading(false)
    }
  }

  const fetchTaskStats = async () => {
    // Statistiques simulées
    return {
      success: true,
      data: {
        totalTasks: 3,
        completionRate: 33,
        overdueTasks: 1,
        importantPendingTasks: 1
      }
    }
  }

  const value = {
    tasks,
    loading,
    error,
    success,
    fetchTasks,
    fetchTaskStats,
    setError,
    setSuccess
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}