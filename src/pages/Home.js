import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/Home.module.css';

const Home = () => {
  const { user, userRole } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      if (userRole === 'business') {
        navigate('/dashboard');
      } else {
        navigate('/customer');
      }
    } else {
      navigate('/signup');
    }
  };

  const features = [
    {
      icon: '⏱️',
      title: 'Real-Time Updates',
      description: 'Get instant notifications when positions change and estimated wait times update.',
    },
    {
      icon: '🎯',
      title: 'Smart Queue Management',
      description: 'Serve customers efficiently with live queue visibility and analytics.',
    },
    {
      icon: '✨',
      title: 'Beautiful UI',
      description: 'Enjoy smooth animations and a modern interface optimized for all devices.',
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Works perfectly on phones, tablets, and desktops.',
    },
    {
      icon: '🔐',
      title: 'Secure',
      description: 'Enterprise-grade authentication and data protection.',
    },
    {
      icon: '🌐',
      title: 'Public Access',
      description: 'Share queue links and QR codes with customers instantly.',
    },
  ];

  return (
    <div className={`${styles.home} ${isDark ? 'dark' : ''}`}>
      <div className={styles.container}>
        {/* Hero Section */}
        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.title}>⏱️ QueueLess Lite</h1>
          <p className={styles.subtitle}>
            Real-time waitlist management for small businesses
          </p>
          <div className={styles.ctaButtons}>
            <motion.button
              className={styles.primary}
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {user ? 'Go to Dashboard' : 'Get Started'}
            </motion.button>
            <motion.a
              href="#features"
              className={styles.secondary}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className={styles.features} id="features">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className={styles.cta}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className={styles.ctaTitle}>Ready to eliminate lines?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of businesses managing queues smarter.
          </p>
          <motion.button
            className={styles.ctaButton}
            onClick={handleGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {user ? 'Open Dashboard' : 'Create Free Account'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
