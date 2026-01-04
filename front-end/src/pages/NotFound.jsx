import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>404 - Page non trouvée</h2>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#64748b' }}>
          La page que vous recherchez n'existe pas.
        </p>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" className="btn-submit" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

