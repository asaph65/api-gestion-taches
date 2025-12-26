/**
 * Valide un email
 */
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }
  
  /**
   * Valide un mot de passe
   */
  export const validatePassword = (password) => {
    return password.length >= 6
  }
  
  /**
   * Valide un formulaire de connexion
   */
  export const validateLoginForm = (data) => {
    const errors = {}
    
    if (!data.email?.trim()) {
      errors.email = 'L\'email est requis'
    } else if (!validateEmail(data.email)) {
      errors.email = 'Email invalide'
    }
    
    if (!data.password) {
      errors.password = 'Le mot de passe est requis'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
  
  /**
   * Valide un formulaire d'inscription
   */
  export const validateRegisterForm = (data) => {
    const errors = {}
    
    if (!data.email?.trim()) {
      errors.email = 'L\'email est requis'
    } else if (!validateEmail(data.email)) {
      errors.email = 'Email invalide'
    }
    
    if (!data.password) {
      errors.password = 'Le mot de passe est requis'
    } else if (data.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    if (!data.firstName?.trim()) {
      errors.firstName = 'Le prénom est requis'
    }
    
    if (!data.lastName?.trim()) {
      errors.lastName = 'Le nom est requis'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
  
  /**
   * Valide un formulaire de tâche
   */
  export const validateTaskForm = (data) => {
    const errors = {}
    
    if (!data.title?.trim()) {
      errors.title = 'Le titre est requis'
    } else if (data.title.length < 3) {
      errors.title = 'Le titre doit contenir au moins 3 caractères'
    } else if (data.title.length > 100) {
      errors.title = 'Le titre ne peut pas dépasser 100 caractères'
    }
    
    if (data.description && data.description.length > 1000) {
      errors.description = 'La description ne peut pas dépasser 1000 caractères'
    }
    
    if (data.dueDate) {
      try {
        const dueDate = new Date(data.dueDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (dueDate < today) {
          errors.dueDate = 'La date d\'échéance doit être aujourd\'hui ou dans le futur'
        }
      } catch (error) {
        errors.dueDate = 'Date invalide'
      }
    }
    
    if (data.estimatedDuration && data.estimatedDuration < 0) {
      errors.estimatedDuration = 'La durée ne peut pas être négative'
    }
    
    if (data.actualDuration && data.actualDuration < 0) {
      errors.actualDuration = 'La durée ne peut pas être négative'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }