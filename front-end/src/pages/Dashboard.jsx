import { useCallback, useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { createTask, getTasks } from "../utils/api";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Déclarer fetchTasks AVANT de l'utiliser dans useEffect
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des tâches:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (taskData) => {
    try {
      await createTask(taskData);
      setShowForm(false);
      await fetchTasks(); // Rafraîchir la liste
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alert("Erreur lors de la création de la tâche");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Mes Tâches</h2>
        <button onClick={() => setShowForm(true)} className="btn-add">
          + Nouvelle Tâche
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TaskForm
              onSubmit={handleAddTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Chargement des tâches...</div>
      ) : (
        <>
          <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />

          {tasks.length === 0 && (
            <div className="empty-state">
              <p>
                🎉 Aucune tâche pour le moment. C'est l'occasion d'en ajouter
                une !
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
