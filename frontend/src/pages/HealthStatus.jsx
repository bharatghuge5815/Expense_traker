import React, { useEffect, useState } from 'react';
import { checkHealth } from '../services/api';

const HealthStatus = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const data = await checkHealth();
        setHealth(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to reach API server');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1rem' }}>Backend Health Status</h2>

      {loading && (
        <div className="status-badge loading">
          <span className="dot loading"></span>
          Checking backend connection...
        </div>
      )}

      {error && (
        <div>
          <div className="status-badge error" style={{ marginBottom: '1rem' }}>
            <span className="dot error"></span>
            Disconnected: {error}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Make sure the backend server is running on <code>http://localhost:5000</code>.
          </p>
        </div>
      )}

      {health && (
        <div>
          <div className="status-badge connected" style={{ marginBottom: '1rem' }}>
            <span className="dot connected"></span>
            API Connected & Healthy
          </div>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Response:</h4>
          <pre>{JSON.stringify(health, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default HealthStatus;
