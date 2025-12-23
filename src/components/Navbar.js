import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const { user, logout, userRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <span>⏱️</span>
          QueueLess
        </Link>

        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
          title="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`${styles.navLinks} ${menuOpen ? styles.active : ''}`}>
          {user ? (
            <>
              {userRole === 'business' && (
                <Link to="/dashboard" className={styles.navLink} onClick={closeMenu}>
                  Dashboard
                </Link>
              )}
              {userRole === 'customer' && (
                <Link to="/customer" className={styles.navLink} onClick={closeMenu}>
                  My Queue
                </Link>
              )}
              <div className={styles.userInfo}>
                <span>{user.email}</span>
                <button
                  className={styles.themeToggle}
                  onClick={toggleTheme}
                  title="Toggle theme"
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink} onClick={closeMenu}>
                Login
              </Link>
              <Link to="/signup" className={styles.navLink} onClick={closeMenu}>
                Sign Up
              </Link>
              <div style={{ padding: '0 20px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                  className={styles.themeToggle}
                  onClick={toggleTheme}
                  title="Toggle theme"
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
