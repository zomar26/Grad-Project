import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Diseases from './pages/DiseasesPage';
import SimulationPage from './pages/SimulationPage'; 
import SimulationModePage from "./pages/SimulationModePage";
import SimulationExperiencePage from "./pages/SimulationExperiencePage";
import ChatbotPage from './pages/ChatbotPage';
import DiseaseDetailsPage from './features/diseases/pages/DiseaseDetailsPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes — require authentication */}
          <Route path="/diseases" element={
            <ProtectedRoute><Diseases /></ProtectedRoute>
          } />
          <Route path="/diseases/:id" element={
            <ProtectedRoute><DiseaseDetailsPage /></ProtectedRoute>
          } />
          <Route path="/simulation" element={
            <ProtectedRoute><SimulationPage /></ProtectedRoute>
          } />
          <Route path="/simulation/mode" element={
            <ProtectedRoute><SimulationModePage /></ProtectedRoute>
          } />
          <Route path="/simulation/experience" element={
            <ProtectedRoute><SimulationExperiencePage /></ProtectedRoute>
          } />
          <Route path="/chatbot" element={
            <ProtectedRoute><ChatbotPage /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;