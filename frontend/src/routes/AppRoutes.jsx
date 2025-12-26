import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Pages
import HomePage from '../pages/HomePage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<div>Page de connexion (à créer)</div>} />
      <Route path="/register" element={<div>Page d'inscription (à créer)</div>} />
      <Route path="/dashboard" element={<div>Dashboard (à créer)</div>} />
      <Route path="/tasks" element={<div>Page des tâches (à créer)</div>} />
      <Route path="*" element={<div>Page non trouvée</div>} />
    </Routes>
  )
}

export default AppRoutes