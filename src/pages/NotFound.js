import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const NotFound = () => {
  const { isDark } = useTheme();

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px',
      background: isDark
        ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    },
    icon: {
      fontSize: '80px',
      marginBottom: '20px',
    },
    title: {
      fontSize: '48px',
      fontWeight: '700',
      marginBottom: '8px',
      color: isDark ? '#e2e8f0' : '#2d3748',
    },
    subtitle: {
      fontSize: '20px',
      color: isDark ? '#cbd5e0' : '#718096',
      marginBottom: '32px',
    },
    button: {
      padding: '12px 32px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'all 0.2s',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.icon}>😕</div>
      <h1 style={styles.title}>404</h1>
      <p style={styles.subtitle}>Page not found</p>
      <Link to="/" style={styles.button}>
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
