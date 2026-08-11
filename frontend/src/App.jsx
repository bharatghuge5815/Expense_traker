import React from 'react';
import Header from './components/Header';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <main>
          <AppRoutes />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
