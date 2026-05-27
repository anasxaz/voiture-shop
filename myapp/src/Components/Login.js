import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Nav } from 'react-bootstrap';
import { useNavigate, Navigate } from 'react-router-dom';
import { login, register, isAuthenticated } from '../services/authService';

function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated()) return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={5}>
          <div className="p-4 rounded" style={{ backgroundColor: '#3A3F44' }}>
            <h2 className="text-white mb-4 text-center">
              {isRegister ? 'Créer un compte' : 'Connexion'}
            </h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="text-light">Nom d'utilisateur</Form.Label>
                <Form.Control
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  placeholder="admin"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="text-light">Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                {loading ? 'Chargement...' : (isRegister ? 'S\'inscrire' : 'Se connecter')}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <Nav.Link
                className="text-info"
                style={{ cursor: 'pointer' }}
                onClick={() => { setIsRegister(!isRegister); setError(null); }}
              >
                {isRegister ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
              </Nav.Link>
            </div>

            <hr style={{ borderColor: '#555' }} />
            <button
              type="button"
              className="btn w-100 d-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: '#fff', color: '#444', fontWeight: 500 }}
              onClick={() => window.location.href = '/oauth2/authorization/google'}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                width="20"
                height="20"
              />
              Se connecter avec Google
            </button>

            {!isRegister && (
              <p className="text-muted text-center mt-3" style={{ fontSize: '0.85rem' }}>
                Compte par défaut : <strong>admin</strong> / <strong>admin123</strong>
              </p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
