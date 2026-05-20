import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './Components/NavigationBar';
import Bienvenue from './Components/Bienvenue';
import Footer from './Components/Footer';
import VoitureListe from './Components/VoitureListe';
import AjouterVoiture from './Components/AjouterVoiture';
import Login from './Components/Login';
import ChatBot from './Components/ChatBot';
import ModifierVoiture from './Components/ModifierVoiture';
import OAuth2Callback from './Components/OAuth2Callback';
import VoitureDetail from './Components/VoitureDetail';
import AdminContacts from './Components/AdminContacts';
import AdminDashboard from './Components/AdminDashboard';
import { isAuthenticated } from './services/authService';

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <NavigationBar />
      <div style={{ paddingBottom: '60px' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />
          <Route path="/" element={<ProtectedRoute><Bienvenue /></ProtectedRoute>} />
          <Route path="/voitures" element={<ProtectedRoute><VoitureListe /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AjouterVoiture /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><ChatBot /></ProtectedRoute>} />
          <Route path="/modifier/:id" element={<ProtectedRoute><ModifierVoiture /></ProtectedRoute>} />
          <Route path="/voitures/:id" element={<ProtectedRoute><VoitureDetail /></ProtectedRoute>} />
          <Route path="/admin/contacts" element={<ProtectedRoute><AdminContacts /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
