import React, { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import { useTasks } from '../contexts/TaskContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Alert from '../components/common/Alert'
import Button from '../components/common/Button'
import { Link } from 'react-router-dom'
import { TASK_STATUS, TASK_PRIORITY } from '../utils/constants'
import { getStatusLabel, getPriorityLabel, formatSimpleDate } from '../utils/helpers'

const TasksPage = () => {
  const { tasks, loading, error, fetchTasks } = useTasks()
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    isImportant: '',
    search: ''
  })

  useEffect(() => {
    fetchTasks(filters)
  }, [])

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    fetchTasks(newFilters)
  }

  const handleSearch = (e) => {
    const value = e.target.value
    const newFilters = { ...filters, search: value }
    setFilters(newFilters)
    fetchTasks(newFilters)
  }

  if (loading) {
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">Mes tâches</h1>
            <p className="page-subtitle">
              Gérez toutes vos tâches en un seul endroit
            </p>
          </div>
          <Link to="/tasks/new" className="btn btn-primary">
            + Nouvelle tâche
          </Link>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} />
      )}

      {/* Filtres */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Recherche</label>
            <input
              type="text"
              placeholder="Rechercher une tâche..."
              value={filters.search}
              onChange={handleSearch}
              className="form-input"
            />
          </div>
          
          <div>
            <label className="form-label">Statut</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-select"
            >
              <option value="">Tous les statuts</option>
              <option value={TASK_STATUS.TODO}>À faire</option>
              <option value={TASK_STATUS.IN_PROGRESS}>En cours</option>
              <option value={TASK_STATUS.DONE}>Terminée</option>
              <option value={TASK_STATUS.ARCHIVED}>Archivée</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Priorité</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="form-select"
            >
              <option value="">Toutes les priorités</option>
              <option value={TASK_PRIORITY.LOW}>Basse</option>
              <option value={TASK_PRIORITY.MEDIUM}>Moyenne</option>
              <option value={TASK_PRIORITY.HIGH}>Haute</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Importance</label>
            <select
              value={filters.isImportant}
              onChange={(e) => handleFilterChange('isImportant', e.target.value)}
              className="form-select"
            >
              <option value="">Toutes</option>
              <option value="true">Importantes uniquement</option>
              <option value="false">Non importantes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="card">
        {tasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Statut</th>
                  <th>Priorité</th>
                  <th>Échéance</th>
                  <th>Créée le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id}>
                    <td>
                      <div className="font-medium">{task.title}</div>
                      {task.isImportant && (
                        <span className="text-xs text-red-600">⭐ Important</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        task.status === 'done' ? 'badge-success' :
                        task.status === 'in_progress' ? 'badge-info' :
                        task.status === 'archived' ? 'badge-secondary' :
                        'badge-warning'
                      }`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        task.priority === 'high' ? 'badge-danger' :
                        task.priority === 'medium' ? 'badge-warning' :
                        'badge-success'
                      }`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </td>
                    <td>
                      {task.dueDate ? (
                        <span>{formatSimpleDate(task.dueDate)}</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td>
                      {formatSimpleDate(task.createdAt)}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link 
                          to={`/tasks/${task._id}`}
                          className="btn btn-sm btn-outline"
                        >
                          Voir
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // TODO: Implémenter l'édition
                          }}
                        >
                          Éditer
                        </Button>
                      </div>
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
              Créer votre première tâche
            </Link>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default TasksPage