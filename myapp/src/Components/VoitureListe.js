import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Voiture from './Voiture';
import { authHeaders, isAuthenticated } from '../services/authService';

function VoitureListe() {
  const navigate = useNavigate();
  const [voitures, setVoitures] = useState([]);
  const [search, setSearch] = useState('');
  const [prixMin, setPrixMin] = useState('');
  const [prixMax, setPrixMax] = useState('');
  const [anneeMin, setAnneeMin] = useState('');
  const [anneeMax, setAnneeMax] = useState('');
  const [tri, setTri] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    fetch('http://localhost:8089/voitures', { headers: authHeaders() })
      .then(res => {
        if (res.status === 401 || res.status === 403) { navigate('/login'); return; }
        if (!res.ok) throw new Error('Erreur lors du chargement des voitures');
        return res.json();
      })
      .then(data => { setVoitures(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [navigate]);

  const handleDelete = (id) => setVoitures(prev => prev.filter(v => v.id !== id));

  let filtered = voitures.filter(v => {
    const matchSearch = v.marque.toLowerCase().includes(search.toLowerCase()) ||
      v.modele.toLowerCase().includes(search.toLowerCase()) ||
      v.couleur.toLowerCase().includes(search.toLowerCase());
    const matchPrixMin = prixMin === '' || v.prix >= parseInt(prixMin);
    const matchPrixMax = prixMax === '' || v.prix <= parseInt(prixMax);
    const matchAnneeMin = anneeMin === '' || v.annee >= parseInt(anneeMin);
    const matchAnneeMax = anneeMax === '' || v.annee <= parseInt(anneeMax);
    return matchSearch && matchPrixMin && matchPrixMax && matchAnneeMin && matchAnneeMax;
  });

  if (tri === 'prix_asc') filtered = [...filtered].sort((a, b) => a.prix - b.prix);
  else if (tri === 'prix_desc') filtered = [...filtered].sort((a, b) => b.prix - a.prix);
  else if (tri === 'annee_asc') filtered = [...filtered].sort((a, b) => a.annee - b.annee);
  else if (tri === 'annee_desc') filtered = [...filtered].sort((a, b) => b.annee - a.annee);
  else if (tri === 'marque') filtered = [...filtered].sort((a, b) => a.marque.localeCompare(b.marque));

  if (loading) return (
    <Container className="mt-5 text-center">
      <Spinner animation="border" variant="light" />
      <p className="text-light mt-2">Chargement...</p>
    </Container>
  );

  if (error) return (
    <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>
  );

  const inputStyle = { backgroundColor: '#3A3F44', color: '#fff', border: '1px solid #555' };

  return (
    <Container className="mt-4 mb-5">
      <h2 className="text-white mb-3">Liste des Voitures</h2>

      {/* Recherche + Tri */}
      <Row className="mb-3">
        <Col md={8}>
          <Form.Control
            placeholder="Rechercher par marque, modèle ou couleur..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={inputStyle}
          />
        </Col>
        <Col md={4}>
          <Form.Select value={tri} onChange={e => setTri(e.target.value)} style={inputStyle}>
            <option value="">Trier par...</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
            <option value="annee_asc">Année croissante</option>
            <option value="annee_desc">Année décroissante</option>
            <option value="marque">Marque (A-Z)</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Filtres prix et année */}
      <Row className="mb-4">
        <Col xs={6} md={3}>
          <Form.Control type="number" placeholder="Prix min (DH)"
            value={prixMin} onChange={e => setPrixMin(e.target.value)} style={inputStyle} />
        </Col>
        <Col xs={6} md={3}>
          <Form.Control type="number" placeholder="Prix max (DH)"
            value={prixMax} onChange={e => setPrixMax(e.target.value)} style={inputStyle} />
        </Col>
        <Col xs={6} md={3} className="mt-2 mt-md-0">
          <Form.Control type="number" placeholder="Année min"
            value={anneeMin} onChange={e => setAnneeMin(e.target.value)} style={inputStyle} />
        </Col>
        <Col xs={6} md={3} className="mt-2 mt-md-0">
          <Form.Control type="number" placeholder="Année max"
            value={anneeMax} onChange={e => setAnneeMax(e.target.value)} style={inputStyle} />
        </Col>
      </Row>

      <p className="text-muted mb-3">{filtered.length} voiture(s) trouvée(s)</p>

      <Row>
        {filtered.map(v => (
          <Col key={v.id} md={6} lg={4}>
            <Voiture voiture={v} onDelete={handleDelete} />
          </Col>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted">Aucune voiture ne correspond à vos critères.</p>
        )}
      </Row>
    </Container>
  );
}

export default VoitureListe;
