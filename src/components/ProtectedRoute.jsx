import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
// Composant de route protégée
// Vérifie si l'utilisateur est authentifié avant de rendre le composant enfant
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
    
  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;