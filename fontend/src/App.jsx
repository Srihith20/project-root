import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserPage from './pages/UserPage';
import Login from './pages/Signup';
import Signup from './pages/Login';
import AdminBookingPanel from './pages/AdminBookingPanel';
import UserBookings from './pages/UserBookings';
import AdminCreateSlotPage from './pages/AdminCreateSlotPage';
import AdminSlotsPanel from './pages/AdminSlotsPanel';
import LandingPage from './pages/LandingPage';


// import AdminBookingPanel from './pages/AdminBookingPanel';


function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.label !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>

      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminBookingPanel />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/slots"
          element={
            <ProtectedRoute role="admin">
              <AdminCreateSlotPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-slots"
          element={
            <ProtectedRoute role="admin">
              <AdminSlotsPanel />
            </ProtectedRoute>
          }
        />



        <Route
          path="/user/bookings"
          element={
            <ProtectedRoute role="user">
              <UserBookings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
