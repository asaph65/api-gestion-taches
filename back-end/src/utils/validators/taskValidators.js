// src/utils/validators/taskValidators.js
const { z } = require("zod");
const { TaskStatus } = require("../../models/Task");

// Schéma de base pour une tâche
const taskBaseSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères")
    .trim(),

  description: z
    .string()
    .max(1000, "La description ne peut pas dépasser 1000 caractères")
    .optional()
    .default("")
    .transform((val) => val || ""),

  status: z
    .enum([
      TaskStatus.TODO,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
      TaskStatus.ARCHIVED,
    ])
    .optional()
    .default(TaskStatus.TODO),

  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),

  dueDate: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Format de date invalide",
    })
    .transform((val) => (val ? new Date(val) : null)),

  tags: z
    .array(z.string().trim().min(1, "Un tag ne peut pas être vide"))
    .optional()
    .default([])
    .transform((arr) => arr.map((tag) => tag.toLowerCase())),

  isImportant: z.boolean().optional().default(false),

  estimatedDuration: z
    .number()
    .int()
    .min(0, "La durée estimée ne peut pas être négative")
    .optional()
    .nullable()
    .default(null),

  actualDuration: z
    .number()
    .int()
    .min(0, "La durée réelle ne peut pas être négative")
    .optional()
    .nullable()
    .default(null),
});

// Schéma pour créer une tâche
const createTaskSchema = taskBaseSchema.extend({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères")
    .trim(),
});

// Schéma pour mettre à jour une tâche
const updateTaskSchema = taskBaseSchema.partial().extend({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères")
    .trim()
    .optional(),

  status: z
    .enum([
      TaskStatus.TODO,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
      TaskStatus.ARCHIVED,
    ])
    .optional(),
});

// Schéma pour les paramètres de requête (filtrage, pagination)
const taskQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .refine((n) => n > 0, { message: "Le numéro de page doit être positif" }),

  limit: z
    .string()
    .optional()
    .default("10")
    .transform(Number)
    .refine((n) => n > 0 && n <= 100, {
      message: "La limite doit être comprise entre 1 et 100",
    }),

  status: z
    .enum([
      TaskStatus.TODO,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
      TaskStatus.ARCHIVED,
    ])
    .optional(),

  priority: z.enum(["low", "medium", "high"]).optional(),

  isImportant: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => val === "true"),

  tags: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",") : [])),

  search: z.string().optional(),

  sortBy: z
    .enum(["createdAt", "updatedAt", "dueDate", "title", "priority"])
    .optional()
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Schéma pour valider les IDs MongoDB
const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID invalide");

// Fonction de validation middleware
const validate = (schema) => (req, res, next) => {
  try {
    let data;

    // Sélectionner les données à valider en fonction de la méthode HTTP
    if (req.method === "GET") {
      data = schema.parse(req.query);
      req.query = data;
    } else {
      data = schema.parse(req.body);
      req.body = data;
    }

    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        errors,
      });
    }

    next(error);
  }
};

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  mongoIdSchema,
  validate,
};
