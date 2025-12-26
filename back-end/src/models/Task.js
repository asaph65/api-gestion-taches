// src/models/Task.js
const mongoose = require("mongoose");

// Définir les statuts possibles
const TaskStatus = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
  ARCHIVED: "archived",
};

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
      minlength: [3, "Le titre doit contenir au moins 3 caractères"],
      maxlength: [100, "Le titre ne peut pas dépasser 100 caractères"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "La description ne peut pas dépasser 1000 caractères"],
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          // La date d'échéance doit être dans le futur ou aujourd'hui
          if (!value) return true;
          return value >= new Date().setHours(0, 0, 0, 0);
        },
        message: "La date d'échéance doit être aujourd'hui ou dans le futur",
      },
    },
    completedAt: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'utilisateur est requis"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isImportant: {
      type: Boolean,
      default: false,
    },
    estimatedDuration: {
      type: Number, // en minutes
      min: [0, "La durée estimée ne peut pas être négative"],
    },
    actualDuration: {
      type: Number, // en minutes
      min: [0, "La durée réelle ne peut pas être négative"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index pour optimiser les requêtes
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, isImportant: 1 });
taskSchema.index({ tags: 1 });

// Middleware pour gérer la date de complétion
taskSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === TaskStatus.DONE &&
    !this.completedAt
  ) {
    this.completedAt = new Date();
  }

  if (
    this.isModified("status") &&
    this.status !== TaskStatus.DONE &&
    this.completedAt
  ) {
    this.completedAt = undefined;
  }
  next();
});

// Méthode pour vérifier si la tâche est en retard
taskSchema.virtual("isOverdue").get(function () {
  if (!this.dueDate || this.status === TaskStatus.DONE) return false;
  return this.dueDate < new Date();
});

// Méthode pour calculer le temps restant (en jours)
taskSchema.virtual("daysRemaining").get(function () {
  if (!this.dueDate) return null;
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Méthode statique pour récupérer les tâches d'un utilisateur avec pagination
taskSchema.statics.findByUser = function (userId, options = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    isImportant,
    tags,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;

  const query = { user: userId };

  // Filtres
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (isImportant !== undefined) query.isImportant = isImportant;
  if (tags && tags.length > 0) query.tags = { $all: tags };

  // Recherche textuelle
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  return this.paginate(query, {
    page,
    limit,
    sort,
    select: "-__v",
    populate: {
      path: "user",
      select: "firstName lastName email",
    },
  });
};

// Ajouter la pagination (nous allons créer une méthode utilitaire)
taskSchema.statics.paginate = async function (query, options) {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    select,
    populate,
  } = options;

  const skip = (page - 1) * limit;

  const countPromise = this.countDocuments(query);
  const docsPromise = this.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select(select || "")
    .populate(populate || "");

  const [total, tasks] = await Promise.all([countPromise, docsPromise]);

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  };
};

const Task = mongoose.model("Task", taskSchema);

module.exports = { Task, TaskStatus };
