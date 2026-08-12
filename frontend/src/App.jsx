import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  return (
    <main style={{ minHeight: '100vh', width: '100%' }}>
      <AppRoutes />
    </main>
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
