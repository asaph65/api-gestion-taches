// src/utils/helpers.js
/**
 * Formate une date en chaîne lisible
 */
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Calcule la différence en jours entre deux dates
 */
const daysDifference = (date1, date2) => {
  const diffTime = Math.abs(new Date(date2) - new Date(date1));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Génére une pagination complète
 */
const generatePagination = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  };
};

/**
 * Nettoie et normalise les données d'entrée
 */
const sanitizeInput = (data) => {
  const sanitized = { ...data };

  // Trim les chaînes de caractères
  Object.keys(sanitized).forEach((key) => {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitized[key].trim();
    }
  });

  return sanitized;
};

module.exports = {
  formatDate,
  daysDifference,
  generatePagination,
  sanitizeInput,
};
