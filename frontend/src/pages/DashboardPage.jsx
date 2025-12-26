import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import { useAuth } from '../contexts/AuthContext'
import { useTasks } from '../contexts/TaskContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Alert from '../components/common/Alert'
import { Link } from 'react-router-dom'
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../utils/constants'
import { formatSimpleDate, isPastDue } from '../utils/helpers'

const DashboardPage = () => {
  const { user } = useAuth()
  const { 
    tasks, 
    loading, 
    error, 
    fetchTasks, 
    fetchTaskStats 
  } = useTasks()
  
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      await fetchTasks({ limit: 5 })
      const statsResult = await fetchTaskStats()
      if (statsResult.success) {
        setStats(statsResult.data)
      }
    }
    
    loadData()
  }, [])

  if (loading && !stats) {
    return (
      <Layout>
        <div className="loading">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">
          Bonjour, {user?.firstName} 👋
        </h1>
        <p className="page-subtitle">
          Voici un aperçu de vos tâches et statistiques
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} />
      )}

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalTasks || 0}
            </div>
            <div className="text-gray-600">Tâches totales</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.completionRate ? `${Math.round(stats.completionRate)}%` : '0%'}
            </div>
            <div className="text-gray-600">Taux de complétion</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {stats.overdueTasks || 0}
            </div>
            <div className="text-gray-600">Tâches en retard</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {stats.importantPendingTasks || 0}
            </div>
            <div className="text-gray-600">Importantes en attente</div>
          </div>
        </div>
      )}

      {/* Tâches récentes */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Tâches récentes</h2>
          <Link to="/tasks" className="btn btn-sm btn-outline">
            Voir toutes
          </Link>
        </div>
        
        {loading ? (
          <div className="loading">
            <LoadingSpinner />
          </div>
        ) : tasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Statut</th>
                  <th>Priorité</th>
                  <th>Échéance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id}>
                    <td className="font-medium">{task.title}</td>
                    <td>
                      <span className={`badge ${
                        task.status === 'done' ? 'badge-success' :
                        task.status === 'in_progress' ? 'badge-info' :
                        'badge-warning'
                      }`}>
                        {TASK_STATUS_LABELS[task.status] || task.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        task.priority === 'high' ? 'badge-danger' :
                        task.priority === 'medium' ? 'badge-warning' :
                        'badge-success'
                      }`}>
                        {TASK_PRIORITY_LABELS[task.priority] || task.priority}
                      </span>
                    </td>
                    <td>
                      {task.dueDate ? (
                        <span className={isPastDue(task.dueDate) && task.status !== 'done' ? 'text-red-600 font-medium' : ''}>
                          {formatSimpleDate(task.dueDate)}
                          {isPastDue(task.dueDate) && task.status !== 'done' && ' ⚠️'}
                        </span>
                      ) : (
                        <span className="text-gray-500">Aucune</span>
                      )}
                    </td>
                    <td>
                      <Link 
                        to={`/tasks/${task._id}`}
                        className="btn btn-sm btn-outline"
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Aucune tâche trouvée</p>
            <Link to="/tasks/new" className="btn btn-primary">
              Créer ma première tâche
            </Link>
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">📝 Créer une tâche</h3>
          <p className="text-gray-600 mb-4">
            Ajoutez rapidement une nouvelle tâche à votre liste
          </p>
          <Link to="/tasks/new" className="btn btn-primary">
            Nouvelle tâche
          </Link>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">📊 Voir les statistiques</h3>
          <p className="text-gray-600 mb-4">
            Consultez vos statistiques détaillées et votre progression
          </p>
          <Link to="/tasks?view=stats" className="btn btn-outline">
            Statistiques
          </Link>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">⚙️ Paramètres</h3>
          <p className="text-gray-600 mb-4">
            Gérez vos préférences et paramètres de compte
          </p>
          <Link to="/profile" className="btn btn-outline">
            Mon compte
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardPage