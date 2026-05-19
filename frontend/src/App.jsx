import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import UploadPage from './pages/UploadPage';
import HistoryPage from './pages/HistoryPage';
import CallbackPage from './pages/CallbackPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}