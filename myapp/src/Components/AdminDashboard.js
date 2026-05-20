import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authHeaders, isAdmin } from '../services/authService';

function StatCard({ title, value, subtitle, color, icon }) {
  return (
    <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: '#3A3F44' }}>
      <Card.Body className="d-flex flex-column justify-content-between p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>{title}</p>
            <h2 className={`mb-0 fw-bold text-${color}`}>{value}</h2>
          </div>
          <span style={{ fontSize: '2rem' }}>{icon}</span>
        </div>
        {subtitle && (
          <p className="text-light mt-2 mb-0" style={{ fontSize: '0.8rem' }}>{subtitle}</p>
        )}
      </Card.Body>
    </Card>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAdmin()) { navigate('/'); return; }
    fetch('http://localhost:8089/admin/stats', { headers: authHeaders() })
      .then(res => { if (!res.ok) throw new Error('Erreur'); return res.json(); })
      .then(data => { setStats(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [navigate]);

  if (loading) return (
    <Container className="mt-5 text-center">
      <Spinner animation="border" variant="light" />
    </Container>
  );

  if (error) return (
    <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>
  );

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-white mb-1">Tableau de bord</h2>
          <p className="text-muted mb-0">Vue d'ensemble de votre magasin</p>
        </div>
        {stats.demandesEnAttente > 0 && (
          <Badge bg="danger" style={{ fontSize: '0.9rem' }}>
            {stats.demandesEnAttente} demande(s) en attente
          </Badge>
        )}
      </div>

      {/* Statistiques */}
      <Row className="g-3 mb-4">
        <Col xs={6} lg={3}>
          <StatCard
            title="Total Voitures"
            value={stats.totalVoitures}
            subtitle="Dans le catalogue"
            color="primary"
            icon="🚗"
          />
        </Col>
        <Col xs={6} lg={3}>
          <StatCard
            title="Demandes en attente"
            value={stats.demandesEnAttente}
            subtitle={`${stats.totalDemandes} demande(s) au total`}
            color={stats.demandesEnAttente > 0 ? 'warning' : 'success'}
            icon="📩"
          />
        </Col>
        <Col xs={6} lg={3}>
          <StatCard
            title="Prix moyen"
            value={`${stats.prixMoyen.toLocaleString()} DH`}
            subtitle="Moyenne du catalogue"
            color="info"
            icon="💰"
          />
        </Col>
        <Col xs={6} lg={3}>
          <StatCard
            title="Total demandes"
            value={stats.totalDemandes}
            subtitle="Depuis le début"
            color="success"
            icon="📊"
          />
        </Col>
      </Row>

      {/* Détails voitures */}
      <Row className="g-3 mb-4">
        <Col md={6}>
          <Card className="border-0" style={{ backgroundColor: '#3A3F44' }}>
            <Card.Body className="p-3">
              <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Voiture la plus chère</p>
              <p className="text-warning fw-bold mb-0">{stats.voiturePlusChere}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0" style={{ backgroundColor: '#3A3F44' }}>
            <Card.Body className="p-3">
              <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Voiture la moins chère</p>
              <p className="text-success fw-bold mb-0">{stats.voitureMoinsChere}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Actions rapides */}
      <div className="p-4 rounded" style={{ backgroundColor: '#3A3F44' }}>
        <h5 className="text-white mb-3">Actions rapides</h5>
        <div className="d-flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => navigate('/add')}>
            + Ajouter une voiture
          </Button>
          <Button variant="outline-warning" onClick={() => navigate('/admin/contacts')}>
            Voir les demandes
            {stats.demandesEnAttente > 0 && (
              <Badge bg="danger" className="ms-2">{stats.demandesEnAttente}</Badge>
            )}
          </Button>
          <Button variant="outline-light" onClick={() => navigate('/voitures')}>
            Gérer le catalogue
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default AdminDashboard;
