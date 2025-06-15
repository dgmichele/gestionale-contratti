import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './pages/ProtectedRoute';
import PrivateLayout from './layouts/PrivateLayout';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rotte pubbliche */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rotte protette */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <HomePage />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />

        {/* Rotta 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
