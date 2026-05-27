import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { authHeaders, isAuthenticated } from '../services/authService';

function ModifierVoiture() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    marque: '', modele: '', couleur: '', immatricule: '', annee: '', prix: ''
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/login'); return; }

    fetch(`/voitures`, { headers: authHeaders() })
      .then(res => res.json())
      .then(data => {
        const v = data.find(v => v.id === parseInt(id));
        if (v) setForm({ marque: v.marque, modele: v.modele, couleur: v.couleur,
          immatricule: v.immatricule, annee: v.annee, prix: v.prix });
        setLoading(false);
      })
      .catch(() => { setError('Voiture introuvable'); setLoading(false); });
  }, [id, navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const voiture = { ...form, annee: parseInt(form.annee), prix: parseInt(form.prix) };

    fetch(`/voitures/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(voiture)
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors de la modification');
        return res.json();
      })
      .then(() => { setSuccess(true); setTimeout(() => navigate('/voitures'), 1500); })
      .catch(err => setError(err.message));
  };

  if (loading) return (
    <Container className="mt-5 text-center">
      <Spinner animation="border" variant="light" />
    </Container>
  );

  return (
    <Container className="mt-4 mb-5">
      <Row className="justify-content-center">
        <Col md={7}>
          <div className="p-4 rounded" style={{ backgroundColor: '#3A3F44' }}>
            <h2 className="text-white mb-4">Modifier la Voiture</h2>
            {success && <Alert variant="success">Voiture modifiée avec succès !</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">Marque</Form.Label>
                    <Form.Control name="marque" value={form.marque} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">Modèle</Form.Label>
                    <Form.Control name="modele" value={form.modele} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">Couleur</Form.Label>
                    <Form.Control name="couleur" value={form.couleur} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">Immatricule</Form.Label>
                    <Form.Control name="immatricule" value={form.immatricule} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">Année</Form.Label>
                    <Form.Control name="annee" type="number" value={form.annee} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">Prix (DH)</Form.Label>
                    <Form.Control name="prix" type="number" value={form.prix} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex gap-2">
                <Button type="submit" variant="warning">Modifier</Button>
                <Button variant="outline-light" onClick={() => navigate('/voitures')}>Annuler</Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ModifierVoiture;
