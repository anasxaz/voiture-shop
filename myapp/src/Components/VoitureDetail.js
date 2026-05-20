import { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { authHeaders, isAuthenticated } from '../services/authService';
import ContactModal from './ContactModal';

function VoitureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voiture, setVoiture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    fetch(`http://localhost:8089/voitures/${id}`, { headers: authHeaders() })
      .then(res => {
        if (!res.ok) throw new Error('Voiture introuvable');
        return res.json();
      })
      .then(data => { setVoiture(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [id, navigate]);

  if (loading) return (
    <Container className="mt-5 text-center">
      <Spinner animation="border" variant="light" />
    </Container>
  );

  if (error) return (
    <Container className="mt-5">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  return (
    <Container className="mt-4 mb-5">
      <Button variant="outline-light" className="mb-4" onClick={() => navigate('/voitures')}>
        ← Retour à la liste
      </Button>
      <Row className="justify-content-center">
        <Col md={7}>
          <div className="p-4 rounded" style={{ backgroundColor: '#3A3F44' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="text-white mb-0">{voiture.marque} {voiture.modele}</h2>
              <Badge bg="primary" style={{ fontSize: '1rem' }}>{voiture.annee}</Badge>
            </div>
            <hr style={{ borderColor: '#555' }} />
            <Row className="mt-3">
              <Col sm={6}>
                <p className="text-light"><strong>Couleur :</strong> {voiture.couleur}</p>
                <p className="text-light"><strong>Immatricule :</strong> {voiture.immatricule}</p>
                <p className="text-light"><strong>Année :</strong> {voiture.annee}</p>
              </Col>
              <Col sm={6} className="text-sm-end">
                <p className="text-warning fs-3 fw-bold">{voiture.prix.toLocaleString()} DH</p>
              </Col>
            </Row>
            <div className="mt-4">
              <Button variant="success" size="lg" className="w-100" onClick={() => setShowContact(true)}>
                Je suis intéressé(e) — Contacter
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <ContactModal
        show={showContact}
        onHide={() => setShowContact(false)}
        voiture={voiture}
      />
    </Container>
  );
}

export default VoitureDetail;
