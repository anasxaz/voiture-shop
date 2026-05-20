import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUsername, logout, isAdmin } from '../services/authService';

function NavigationBar() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Voiture Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {authenticated ? (
              <>
                {isAdmin() && <Nav.Link as={Link} to="/add">Ajouter Voiture</Nav.Link>}
                {isAdmin() && <Nav.Link as={Link} to="/admin/contacts">Demandes</Nav.Link>}
                <Nav.Link as={Link} to="/voitures">Liste Voitures</Nav.Link>
                {isAdmin()
                  ? <Nav.Link as={Link} to="/admin">Tableau de bord</Nav.Link>
                  : <Nav.Link as={Link} to="/chatbot">Conseiller IA</Nav.Link>
                }
                <span className="text-secondary me-2">| {getUsername()}</span>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">Connexion</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
