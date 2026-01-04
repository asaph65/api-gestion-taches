import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCurrentUser, logout } from '../utils/api';

const Layout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData?.user || userData);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <h1>Gestion de Tâches</h1>
        </div>
        
        <nav className="nav">
          {user ? (
            <>
              <span className="welcome">Bonjour, {user?.firstName || user?.email || 'Utilisateur'}</span>
              <Link to="/" className="nav-link">Tableau de bord</Link>
              <button onClick={handleLogout} className="btn-logout">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Connexion</Link>
              <Link to="/register" className="nav-link">Inscription</Link>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2025 Gestion de Tâches -Ndja</p>
      </footer>
    </div>
  );
};

export default Layout;