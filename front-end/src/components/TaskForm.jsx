import { useState } from 'react';

const TaskForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Le titre est requis');
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>Nouvelle Tâche</h3>
      
      <div className="form-group">
        <label>Titre *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Que devez-vous faire ?"
          required
          autoFocus
        />
      </div>
      
      <div className="form-group">
        <label>Description (optionnelle)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Détails supplémentaires..."
          rows="4"
        />
      </div>
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="btn-submit"
          disabled={loading || !formData.title.trim()}
        >
          {loading ? 'Création...' : 'Créer la tâche'}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="btn-cancel"
          disabled={loading}
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default TaskForm;