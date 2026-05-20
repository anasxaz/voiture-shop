import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer
      className="text-center text-light py-3"
      style={{ backgroundColor: '#1a1d20', position: 'fixed', bottom: 0, width: '100%' }}
    >
      <Container>
        <span>&copy; {new Date().getFullYear()} Voiture Shop. Tous droits réservés.</span>
      </Container>
    </footer>
  );
}

export default Footer;
