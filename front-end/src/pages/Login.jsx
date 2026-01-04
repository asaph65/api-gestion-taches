import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Échec de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Connexion</h2>
        
        {error && <div className="alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre@email.com"
            />
          </div>
          
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Votre mot de passe"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        <p className="auth-link">
          Pas de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;