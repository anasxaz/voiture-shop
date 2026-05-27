import { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authHeaders, isAuthenticated } from '../services/authService';
import ContactModal from './ContactModal';

function ChatBot() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);
  const [selectedVoiture, setSelectedVoiture] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (preferences, isFirst = false) => {
    if (!isAuthenticated()) { navigate('/login'); return; }

    const userMsg = { role: 'user', content: preferences };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/ai/suggest', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          budget: parseInt(budget),
          preferences,
          messages: messages
        })
      });
      if (res.status === 401 || res.status === 403) { navigate('/login'); return; }
      if (!res.ok) throw new Error('Erreur du serveur IA');
      const data = await res.json();

      setMessages([...updatedMessages, {
        role: 'assistant',
        content: data.response,
        voitures: data.voituresSuggerees || []
      }]);
      if (isFirst) setStarted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFirstSubmit = (e) => {
    e.preventDefault();
    sendMessage(input, true);
  };

  const handleFollowUp = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([]);
    setStarted(false);
    setBudget('');
    setInput('');
    setError(null);
  };

  return (
    <Container className="mt-4 mb-5">
      <Row className="justify-content-center">
        <Col md={9}>
          <div className="p-4 rounded" style={{ backgroundColor: '#3A3F44' }}>
            <h2 className="text-white mb-1">Conseiller IA</h2>
            <p className="text-light mb-4" style={{ fontSize: '0.9rem' }}>
              Entrez votre budget, décrivez vos préférences et posez autant de questions que vous voulez.
            </p>

            {/* Formulaire initial */}
            {!started && (
              <Form onSubmit={handleFirstSubmit}>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="text-light">Budget (DH)</Form.Label>
                      <Form.Control
                        type="number"
                        value={budget}
                        onChange={e => setBudget(e.target.value)}
                        required
                        placeholder="Ex: 100000"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label className="text-light">Vos préférences</Form.Label>
                      <Form.Control
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        required
                        placeholder="Ex: Je cherche un SUV récent, couleur sombre..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading
                    ? <><Spinner animation="border" size="sm" className="me-2" />Analyse en cours...</>
                    : 'Obtenir des suggestions'}
                </Button>
              </Form>
            )}

            {/* Historique de conversation */}
            {messages.length > 0 && (
              <div className="mt-4" style={{ maxHeight: '520px', overflowY: 'auto' }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`mb-3 d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div style={{
                      maxWidth: '85%',
                      backgroundColor: msg.role === 'user' ? '#0d6efd' : '#272B30',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      padding: '12px 16px'
                    }}>
                      <p className="text-white mb-0" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
                        {msg.content}
                      </p>

                      {/* Voitures suggérées cliquables */}
                      {msg.role === 'assistant' && msg.voitures && msg.voitures.length > 0 && (
                        <div className="mt-3">
                          <p className="text-info mb-2" style={{ fontSize: '0.82rem' }}>
                            <strong>Voitures dans votre budget ({parseInt(budget).toLocaleString()} DH) — cliquez pour contacter :</strong>
                          </p>
                          <Row className="g-2">
                            {msg.voitures.map(v => (
                              <Col key={v.id} xs={12} sm={6}>
                                <Card
                                  style={{ backgroundColor: '#3A3F44', border: '1px solid #0d6efd', cursor: 'pointer' }}
                                  className="h-100"
                                  onClick={() => { setSelectedVoiture(v); setShowContact(true); }}
                                >
                                  <Card.Body className="p-2">
                                    <div className="d-flex justify-content-between align-items-start">
                                      <div>
                                        <strong className="text-white" style={{ fontSize: '0.85rem' }}>
                                          {v.marque} {v.modele}
                                        </strong>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                                          {v.couleur} • {v.annee}
                                        </p>
                                      </div>
                                      <div className="text-end ms-2">
                                        <Badge bg="warning" text="dark" style={{ fontSize: '0.75rem' }}>
                                          {v.prix.toLocaleString()} DH
                                        </Badge>
                                        <p className="text-info mb-0 mt-1" style={{ fontSize: '0.7rem' }}>
                                          Je suis intéressé(e)
                                        </p>
                                      </div>
                                    </div>
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}

                      {msg.role === 'assistant' && msg.voitures && msg.voitures.length === 0 && (
                        <p className="text-warning mt-2 mb-0" style={{ fontSize: '0.82rem' }}>
                          Aucune voiture disponible dans ce budget actuellement.
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Indicateur de frappe */}
                {loading && (
                  <div className="d-flex justify-content-start mb-3">
                    <div style={{ backgroundColor: '#272B30', borderRadius: '16px 16px 16px 4px', padding: '12px 16px' }}>
                      <Spinner animation="border" size="sm" variant="light" />
                      <span className="text-light ms-2" style={{ fontSize: '0.85rem' }}>
                        Le conseiller IA réfléchit...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

            {/* Input de suivi de conversation */}
            {started && (
              <>
                <Form onSubmit={handleFollowUp} className="mt-3 d-flex gap-2">
                  <Form.Control
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Posez une autre question... Ex: Et si je voulais une couleur rouge ?"
                    style={{ backgroundColor: '#272B30', color: '#fff', border: '1px solid #555' }}
                    disabled={loading}
                  />
                  <Button type="submit" variant="primary" disabled={loading || !input.trim()}>
                    Envoyer
                  </Button>
                  <Button variant="outline-secondary" onClick={handleReset} disabled={loading}>
                    Nouveau
                  </Button>
                </Form>
                <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.8rem' }}>
                  Budget : <strong className="text-light">{parseInt(budget).toLocaleString()} DH</strong>
                  {' · '}
                  {messages.filter(m => m.role === 'user').length} question(s) posée(s)
                </p>
              </>
            )}
          </div>
        </Col>
      </Row>

      {selectedVoiture && (
        <ContactModal
          show={showContact}
          onHide={() => { setShowContact(false); setSelectedVoiture(null); }}
          voiture={selectedVoiture}
        />
      )}
    </Container>
  );
}

export default ChatBot;
