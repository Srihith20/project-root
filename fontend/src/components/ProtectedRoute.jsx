import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.label !== role) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
