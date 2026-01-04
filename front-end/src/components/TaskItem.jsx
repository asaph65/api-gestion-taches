import { useState } from 'react';
import { updateTask, deleteTask } from '../utils/api';

const TaskItem = ({ task, onTaskUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateTask(task._id, { title, description });
      setIsEditing(false);
      onTaskUpdated();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Impossible de mettre à jour la tâche');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      try {
        await deleteTask(task._id);
        onTaskUpdated();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Impossible de supprimer la tâche');
      }
    }
  };

  const toggleComplete = async () => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      onTaskUpdated();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="task-edit">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="edit-input"
            placeholder="Titre de la tâche"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="edit-textarea"
            placeholder="Description (optionnelle)"
          />
          <div className="edit-actions">
            <button 
              onClick={handleUpdate} 
              disabled={loading || !title.trim()}
              className="btn-save"
            >
              {loading ? '...' : '✓ Enregistrer'}
            </button>
            <button 
              onClick={() => {
                setIsEditing(false);
                setTitle(task.title);
                setDescription(task.description || '');
              }} 
              className="btn-cancel"
              disabled={loading}
            >
              ✗ Annuler
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-content">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={toggleComplete}
              className="task-checkbox"
              title={task.completed ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
            />
            <div className="task-details">
              <h3 className="task-title">{task.title}</h3>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              <small className="task-date">
                📅 {new Date(task.createdAt).toLocaleDateString('fr-FR')}
                {task.completed && ' • ✅ Terminée'}
              </small>
            </div>
          </div>
          <div className="task-actions">
            <button 
              onClick={() => setIsEditing(true)} 
              className="btn-edit"
              title="Modifier"
            >
              ✏️
            </button>
            <button 
              onClick={handleDelete} 
              className="btn-delete"
              title="Supprimer"
            >
              🗑️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;