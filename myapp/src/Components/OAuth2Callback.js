import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';

function OAuth2Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const username = params.get('username');
    const role = params.get('role');

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Container className="mt-5 text-center">
      <Spinner animation="border" variant="light" />
      <p className="text-light mt-3">Connexion avec Google en cours...</p>
    </Container>
  );
}

export default OAuth2Callback;
