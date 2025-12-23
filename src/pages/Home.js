import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        <div className={styles.hero}>
          <h1 className={styles.title}>⏱️ QueueLess Lite</h1>
          <p className={styles.subtitle}>
            Real-time waitlist management for small businesses
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primary} onClick={handleGetStarted}>
              {user ? 'Go to Dashboard' : 'Get Started'}
            </button>
            <a href="#features" className={styles.secondary}>
              Learn More
            </a>
          </div>
        </div>

        <div className={styles.features} id="features">
          {features.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Ready to eliminate lines?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of businesses managing queues smarter.
          </p>
          <button className={styles.ctaButton} onClick={handleGetStarted}>
            {user ? 'Open Dashboard' : 'Create Free Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
