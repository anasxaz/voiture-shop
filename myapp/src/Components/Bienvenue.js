import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { isAdmin } from '../services/authService';

function Bienvenue() {
  return (
    <Container className="mt-5 text-center">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="p-5 rounded" style={{ backgroundColor: '#3A3F44' }}>
            <h1 className="display-4 text-white">Bienvenue sur Voiture Shop</h1>
            <p className="lead text-light mt-3">
              Gérez votre catalogue de voitures facilement. Consultez la liste
              des voitures disponibles ou ajoutez-en une nouvelle.
            </p>
            <hr className="my-4" style={{ borderColor: '#6c757d' }} />
            <Button as={Link} to="/voitures" variant="primary" size="lg" className="me-3">
              Liste des Voitures
            </Button>
            {isAdmin() && (
              <Button as={Link} to="/add" variant="outline-light" size="lg">
                Ajouter une Voiture
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Bienvenue;
