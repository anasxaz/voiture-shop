import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { authHeaders } from '../services/authService';

function ContactModal({ show, onHide, voiture }) {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8089/contacts', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          voitureId: voiture.id,
          marqueVoiture: voiture.marque,
          modeleVoiture: voiture.modele,
          message
        })
      });
      if (!res.ok) throw new Error('Erreur lors de l\'envoi');
      setSuccess(true);
      setMessage('');
      setTimeout(() => { setSuccess(false); onHide(); }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { setSuccess(false); setError(null); setMessage(''); onHide(); };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton style={{ backgroundColor: '#3A3F44', borderColor: '#555' }}>
        <Modal.Title className="text-white">
          Intérêt pour {voiture?.marque} {voiture?.modele}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#3A3F44' }}>
        {success && <Alert variant="success">Demande envoyée ! L'équipe vous contactera bientôt.</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {!success && (
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label className="text-light">Votre message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                placeholder="Ex: Je souhaite avoir plus d'informations sur cette voiture..."
                style={{ backgroundColor: '#272B30', color: '#fff', borderColor: '#555' }}
              />
            </Form.Group>
            <Button type="submit" variant="success" className="w-100 mt-3" disabled={loading}>
              {loading ? 'Envoi...' : 'Envoyer ma demande'}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ContactModal;
