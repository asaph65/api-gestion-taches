// src/routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskStats,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
  archiveTask,
  restoreTask,
  addTagToTask,
  removeTagFromTask,
} = require("../controllers/taskController");
const { auth } = require("../middlewares/auth");
const {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  validate,
  mongoIdSchema,
} = require("../utils/validators/taskValidators");

// Middleware pour valider les IDs
const validateTaskId = (req, res, next) => {
  try {
    mongoIdSchema.parse(req.params.id);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "ID de tâche invalide",
    });
  }
};

// Toutes les routes nécessitent une authentification
router.use(auth);

// Routes principales
router
  .route("/")
  .post(validate(createTaskSchema), createTask)
  .get(validate(taskQuerySchema), getTasks);

// Routes pour les statistiques
router.get("/stats", getTaskStats);

// Routes pour une tâche spécifique
router
  .route("/:id")
  .get(validateTaskId, getTaskById)
  .put(validateTaskId, validate(updateTaskSchema), updateTask)
  .delete(validateTaskId, deleteTask);

// Routes d'actions spécifiques
router.patch("/:id/complete", validateTaskId, completeTask);
router.patch("/:id/archive", validateTaskId, archiveTask);
router.patch("/:id/restore", validateTaskId, restoreTask);

// Routes de gestion des tags
router.patch("/:id/tags", validateTaskId, addTagToTask);
router.delete("/:id/tags/:tag", validateTaskId, removeTagFromTask);

module.exports = router;
