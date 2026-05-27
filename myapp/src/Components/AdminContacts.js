import { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authHeaders, isAdmin } from '../services/authService';

function AdminContacts() {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAdmin()) { navigate('/'); return; }
    fetch('/contacts', { headers: authHeaders() })
      .then(res => { if (!res.ok) throw new Error('Erreur'); return res.json(); })
      .then(data => { setDemandes(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [navigate]);

  const traiter = (id) => {
    fetch(`/contacts/${id}/traiter`, {
      method: 'PUT', headers: authHeaders()
    }).then(() => setDemandes(prev => prev.map(d => d.id === id ? { ...d, traitee: true } : d)));
  };

  const supprimer = (id) => {
    fetch(`/contacts/${id}`, {
      method: 'DELETE', headers: authHeaders()
    }).then(() => setDemandes(prev => prev.filter(d => d.id !== id)));
  };

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" variant="light" /></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-4 mb-5">
      <h2 className="text-white mb-4">Demandes de Contact</h2>
      {demandes.length === 0 ? (
        <p className="text-muted">Aucune demande pour le moment.</p>
      ) : (
        <div className="rounded overflow-hidden" style={{ backgroundColor: '#3A3F44' }}>
          <Table variant="dark" className="mb-0" responsive>
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Voiture</th>
                <th>Message</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map(d => (
                <tr key={d.id}>
                  <td className="text-light">{d.username}</td>
                  <td className="text-light">{d.marqueVoiture} {d.modeleVoiture}</td>
                  <td className="text-light" style={{ maxWidth: '200px', whiteSpace: 'pre-wrap' }}>{d.message}</td>
                  <td className="text-light" style={{ fontSize: '0.85rem' }}>
                    {new Date(d.dateCreation).toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    <Badge bg={d.traitee ? 'success' : 'warning'}>
                      {d.traitee ? 'Traitée' : 'En attente'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      {!d.traitee && (
                        <Button size="sm" variant="success" onClick={() => traiter(d.id)}>
                          Traiter
                        </Button>
                      )}
                      <Button size="sm" variant="danger" onClick={() => supprimer(d.id)}>
                        Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
}

export default AdminContacts;
