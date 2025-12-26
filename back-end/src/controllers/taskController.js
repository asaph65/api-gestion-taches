// src/controllers/taskController.js
const { Task, TaskStatus } = require("../models/Task");

/**
 * @desc    Créer une nouvelle tâche
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      user: req.userId,
    };

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: "Tâche créée avec succès",
      data: task,
    });
  } catch (error) {
    console.error("Erreur création tâche:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        errors,
      });
    }

    res.status(500).json({
      success: false,
      error: "Erreur lors de la création de la tâche",
    });
  }
};

/**
 * @desc    Récupérer toutes les tâches de l'utilisateur
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res) => {
  try {
    const result = await Task.findByUser(req.userId, req.query);

    res.json({
      success: true,
      data: result.tasks,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Erreur récupération tâches:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des tâches",
    });
  }
};

/**
 * @desc    Récupérer les statistiques des tâches
 * @route   GET /api/tasks/stats
 * @access  Private
 */
const getTaskStats = async (req, res) => {
  try {
    const userId = req.userId;

    const stats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalEstimatedDuration: {
            $sum: { $ifNull: ["$estimatedDuration", 0] },
          },
          totalActualDuration: { $sum: { $ifNull: ["$actualDuration", 0] } },
        },
      },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: "$count" },
          statuses: { $push: { status: "$_id", count: "$count" } },
          totalEstimatedDuration: { $sum: "$totalEstimatedDuration" },
          totalActualDuration: { $sum: "$totalActualDuration" },
        },
      },
      {
        $project: {
          _id: 0,
          totalTasks: 1,
          statuses: 1,
          totalEstimatedDuration: 1,
          totalActualDuration: 1,
          completionRate: {
            $cond: {
              if: { $gt: ["$totalTasks", 0] },
              then: {
                $multiply: [
                  {
                    $divide: [
                      {
                        $arrayElemAt: [
                          "$statuses.count",
                          {
                            $indexOfArray: [
                              "$statuses.status",
                              TaskStatus.DONE,
                            ],
                          },
                        ],
                      },
                      "$totalTasks",
                    ],
                  },
                  100,
                ],
              },
              else: 0,
            },
          },
        },
      },
    ]);

    // Tâches en retard
    const overdueTasks = await Task.countDocuments({
      user: userId,
      status: { $ne: TaskStatus.DONE },
      dueDate: { $lt: new Date() },
    });

    // Tâches importantes non terminées
    const importantPendingTasks = await Task.countDocuments({
      user: userId,
      isImportant: true,
      status: { $ne: TaskStatus.DONE },
    });

    const result = {
      ...(stats[0] || {
        totalTasks: 0,
        statuses: [],
        totalEstimatedDuration: 0,
        totalActualDuration: 0,
        completionRate: 0,
      }),
      overdueTasks,
      importantPendingTasks,
    };

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Erreur récupération statistiques:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des statistiques",
    });
  }
};

/**
 * @desc    Récupérer une tâche par son ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    }).populate("user", "firstName lastName email");

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Tâche non trouvée",
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Erreur récupération tâche:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "ID de tâche invalide",
      });
    }

    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération de la tâche",
    });
  }
};

/**
 * @desc    Mettre à jour une tâche
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Tâche non trouvée",
      });
    }

    // Empêcher la modification de l'utilisateur
    if (req.body.user) {
      delete req.body.user;
    }

    // Mettre à jour la tâche
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });

    await task.save();

    res.json({
      success: true,
      message: "Tâche mise à jour avec succès",
      data: task,
    });
  } catch (error) {
    console.error("Erreur mise à jour tâche:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        errors,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "ID de tâche invalide",
      });
    }

    res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour de la tâche",
    });
  }
};

/**
 * @desc    Supprimer une tâche
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Tâche non trouvée",
      });
    }

    res.json({
      success: true,
      message: "Tâche supprimée avec succès",
      data: task,
    });
  } catch (error) {
    console.error("Erreur suppression tâche:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "ID de tâche invalide",
      });
    }

    res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression de la tâche",
    });
  }
};

/**
 * @desc    Marquer une tâche comme terminée
 * @route   PATCH /api/tasks/:id/complete
 * @access  Private
 */
const completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Tâche non trouvée",
      });
    }

    task.status = TaskStatus.DONE;
    await task.save();

    res.json({
      success: true,
      message: "Tâche marquée comme terminée",
      data: task,
    });
  } catch (error) {
    console.error("Erreur complétion tâche:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la complétion de la tâche",
    });
  }
};

/**
 * @desc    Archiver une tâche
 * @route   PATCH /api/tasks/:id/archive
 * @access  Private
 */
const archiveTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Tâche non trouvée",
      });
    }

    task.status = TaskStatus.ARCHIVED;
    await task.save();

    res.json({
      success: true,
      message: "Tâche archivée",
      data: task,
    });
  } catch (error) {
    console.error("Erreur archivage tâche:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de l'archivage de la tâche",
    });
  }
};

/**
 * @desc    Restaurer une tâche archivée
 * @route   PATCH /api/tasks/:id/restore
 * @access  Private
 */
const restoreTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
      status: TaskStatus.ARCHIVED,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Tâche archivée non trouvée",
      });
    }

    task.status = TaskStatus.TODO;
    await task.save();

    res.json({
      success: true,
      message: "Tâche restaurée",
      data: task,
    });
  } catch (error) {
    console.error("Erreur restauration tâche:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la restauration de la tâche",
    });
  }
};

/**
 * @desc    Ajouter un tag à une tâche
 * @route   PATCH /api/tasks/:id/tags
 * @access  Private
 */
const addTagToTask = async (req, res) => {
  try {
    const { tag } = req.body;

    if (!tag || typeof tag !== "string") {
      return res.status(400).json({
        success: false,
        error: "Tag invalide",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Tâche non trouvée",
      });
    }

    const normalizedTag = tag.trim().toLowerCase();

    if (!task.tags.includes(normalizedTag)) {
      task.tags.push(normalizedTag);
      await task.save();
    }

    res.json({
      success: true,
      message: "Tag ajouté avec succès",
      data: task,
    });
  } catch (error) {
    console.error("Erreur ajout tag:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de l'ajout du tag",
    });
  }
};

/**
 * @desc    Supprimer un tag d'une tâche
 * @route   DELETE /api/tasks/:id/tags/:tag
 * @access  Private
 */
const removeTagFromTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Tâche non trouvée",
      });
    }

    const tagIndex = task.tags.indexOf(req.params.tag.toLowerCase());

    if (tagIndex > -1) {
      task.tags.splice(tagIndex, 1);
      await task.save();
    }

    res.json({
      success: true,
      message: "Tag supprimé avec succès",
      data: task,
    });
  } catch (error) {
    console.error("Erreur suppression tag:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression du tag",
    });
  }
};

module.exports = {
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
};
