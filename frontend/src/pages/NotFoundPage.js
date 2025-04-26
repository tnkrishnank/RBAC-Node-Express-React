// src/pages/NotFoundPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.subtitle}>Oops! The page you are looking for does not exist.</p>
      <button onClick={() => navigate('/')} style={styles.button}>
        Go to Home
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f2f6',
  },
  title: {
    fontSize: '48px',
    color: '#d63031',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '20px',
    color: '#636e72',
    marginBottom: '30px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#0984e3',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default NotFoundPage;