import { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authHeaders, isAuthenticated } from '../services/authService';

function AjouterVoiture() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    marque: '', modele: '', couleur: '', immatricule: '', annee: '', prix: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!isAuthenticated()) { navigate('/login'); return; }

    const voiture = { ...form, annee: parseInt(form.annee), prix: parseInt(form.prix) };

    fetch('/api/voitures', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(voiture)
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) { navigate('/login'); return; }
        if (!res.ok) throw new Error('Erreur lors de l\'ajout');
        return res.json();
      })
      .then(() => { setSuccess(true); setTimeout(() => navigate('/voitures'), 1500); })
      .catch(err => setError(err.message));
  };

  return (
    <Container className="mt-4 mb-5">
      <Row className="justify-content-center">
        <Col md={7}>
          <div className="p-4 rounded" style={{ backgroundColor: '#3A3F44' }}>
            <h2 className="text-white mb-4">Ajouter une Voiture</h2>
            {success && <Alert variant="success">Voiture ajoutée avec succès !</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">Marque</Form.Label>
                    <Form.Control name="marque" value={form.marque} onChange={handleChange} required placeholder="Toyota" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">Modèle</Form.Label>
                    <Form.Control name="modele" value={form.modele} onChange={handleChange} required placeholder="Corolla" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">Couleur</Form.Label>
                    <Form.Control name="couleur" value={form.couleur} onChange={handleChange} required placeholder="Grise" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">Immatricule</Form.Label>
                    <Form.Control name="immatricule" value={form.immatricule} onChange={handleChange} required placeholder="A-1-9090" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">Année</Form.Label>
                    <Form.Control name="annee" type="number" value={form.annee} onChange={handleChange} required placeholder="2018" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">Prix (DH)</Form.Label>
                    <Form.Control name="prix" type="number" value={form.prix} onChange={handleChange} required placeholder="95000" />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex gap-2">
                <Button type="submit" variant="primary">Ajouter</Button>
                <Button variant="outline-light" onClick={() => navigate('/voitures')}>Annuler</Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AjouterVoiture;
