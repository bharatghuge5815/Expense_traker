import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <main style={{ minHeight: '100vh', width: '100%' }}>
        <AppRoutes />
      </main>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <main>
        <AppRoutes />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
