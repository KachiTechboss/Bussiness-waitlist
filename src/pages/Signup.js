import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/Auth.module.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.authContainer} ${isDark ? 'dark' : ''}`}>
      <motion.div
        className={styles.authCard}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join QueueLess today</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className={styles.label}>I am a:</label>
          <div className={styles.roleSelector}>
            <motion.div
              className={`${styles.roleOption} ${role === 'customer' ? styles.active : ''}`}
              onClick={() => setRole('customer')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={styles.roleLabel}>👤</div>
              <div className={styles.roleLabel}>Customer</div>
              <div className={styles.roleDescription}>Join a queue</div>
            </motion.div>
            <motion.div
              className={`${styles.roleOption} ${role === 'business' ? styles.active : ''}`}
              onClick={() => setRole('business')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={styles.roleLabel}>🏢</div>
              <div className={styles.roleLabel}>Business</div>
              <div className={styles.roleDescription}>Manage queues</div>
            </motion.div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength="6"
            />
          </div>

          <motion.button
            type="submit"
            className={styles.button}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </motion.button>
        </form>

        <div className={styles.toggle}>
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
