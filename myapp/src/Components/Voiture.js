import { useState } from 'react';
import { Card, Badge, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authHeaders, isAdmin } from '../services/authService';
import ContactModal from './ContactModal';

function Voiture({ voiture, onDelete }) {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);

  const handleDelete = () => {
    if (!window.confirm(`Supprimer ${voiture.marque} ${voiture.modele} ?`)) return;
    fetch(`/voitures/${voiture.id}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).then(() => onDelete(voiture.id));
  };

  return (
    <>
      <Card bg="secondary" text="white" className="mb-3 shadow">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <strong>{voiture.marque} {voiture.modele}</strong>
          <Badge bg="primary">{voiture.annee}</Badge>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col xs={6}>
              <p className="mb-1"><strong>Couleur :</strong> {voiture.couleur}</p>
              <p className="mb-1"><strong>Immatricule :</strong> {voiture.immatricule}</p>
            </Col>
            <Col xs={6} className="text-end">
              <p className="mb-1 text-warning fs-5"><strong>{voiture.prix.toLocaleString()} DH</strong></p>
            </Col>
          </Row>
          <div className="d-flex gap-2 mt-3 flex-wrap">
            <Button size="sm" variant="info" onClick={() => navigate(`/voitures/${voiture.id}`)}>
              Voir détails
            </Button>
            {!isAdmin() && (
              <Button size="sm" variant="success" onClick={() => setShowContact(true)}>
                Je suis intéressé(e)
              </Button>
            )}
            {isAdmin() && (
              <>
                <Button size="sm" variant="warning" onClick={() => navigate(`/modifier/${voiture.id}`)}>
                  Modifier
                </Button>
                <Button size="sm" variant="danger" onClick={handleDelete}>
                  Supprimer
                </Button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
      <ContactModal
        show={showContact}
        onHide={() => setShowContact(false)}
        voiture={voiture}
      />
    </>
  );
}

export default Voiture;
