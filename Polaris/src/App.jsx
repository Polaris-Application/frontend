import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import AuthForm from './components/auth/AuthForm';
import './App.css';
import Navbar from './components/common/Navbar.jsx';
import MapPage from './components/pages/MapPage.jsx';
import TestsPage from './components/pages/TestsPage.jsx';
import AnalyticsPage from './components/pages/AnalyticsPage.jsx';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuthContext();
  return !user ? children : <Navigate to="/dashboard" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar/>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <AuthForm />
              </PublicRoute>
            } 
          />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tests"
            element={
              <ProtectedRoute>
                <TestsPage />
              </ProtectedRoute>
            }
          />

          <Route 
            path='/analytics'
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }/>

          {/* Redirect root to login */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          {/* Catch all other routes and redirect to login */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
