import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/QRScanner.module.css';

const QRScanner = () => {
  const [waitlistId, setWaitlistId] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [qrScanner, setQrScanner] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Initialize and cleanup QR scanner
  useEffect(() => {
    return () => {
      if (qrScanner) {
        qrScanner.destroy();
      }
    };
  }, [qrScanner]);

  // Start camera
  const startCamera = async () => {
    try {
      setError('');

      if (!videoRef.current) return;

      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result.data);
          const id = extractWaitlistId(result.data);
          if (id) {
            handleSuccess(id);
            scanner.stop();
            setQrScanner(null);
          }
        },
        {
          onDecodeError: () => {
            // Silent - just keep scanning
          },
          maxScans: 1,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await scanner.start();
      setQrScanner(scanner);
      setIsCameraActive(true);
    } catch (err) {
      setError('Unable to access camera. Please allow camera permission or enter waitlist ID manually.');
      console.error('Camera error:', err);
    }
  };

  // Stop camera
  const stopCamera = async () => {
    if (qrScanner) {
      await qrScanner.stop();
      qrScanner.destroy();
      setQrScanner(null);
    }
    setIsCameraActive(false);
  };

  // Extract waitlist ID from URL
  const extractWaitlistId = (url) => {
    try {
      // Look for /queue/{id} pattern
      const match = url.match(/\/queue\/([^\/\?\#]+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  // Handle manual input
  const handleManualInput = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!manualInput.trim()) {
      setError('Please enter a waitlist ID');
      return;
    }

    // Handle both full URLs and just IDs
    const id = extractWaitlistId(manualInput) || manualInput.trim();
    handleSuccess(id);
  };

  // Navigate to queue
  const handleSuccess = (id) => {
    setSuccess(`✓ Joining queue...`);
    setWaitlistId(id);
    setTimeout(() => {
      navigate(`/queue/${id}`);
    }, 500);
  };

  return (
    <div className={`${styles.scanner} ${isDark ? styles.dark : ''}`}>
      <div className={styles.container}>
        <h2>📱 Join a Queue</h2>
        <p className={styles.subtitle}>Scan the QR code or enter the waitlist ID</p>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {/* Camera Section */}
        {!isCameraActive ? (
          <button
            onClick={startCamera}
            className={styles.primaryBtn}
          >
            📷 Start Camera Scan
          </button>
        ) : (
          <div className={styles.cameraContainer}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={styles.video}
              style={{ width: '100%' }}
            />
            <button
              onClick={stopCamera}
              className={styles.stopBtn}
            >
              ✕ Stop Camera
            </button>
            <p className={styles.hint}>Point camera at QR code...</p>
          </div>
        )}

        {/* Divider */}
        <div className={styles.divider}>OR</div>

        {/* Manual Input */}
        <form onSubmit={handleManualInput} className={styles.form}>
          <input
            type="text"
            placeholder="Paste waitlist ID or link"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.submitBtn}>
            Join Queue
          </button>
        </form>

        <p className={styles.help}>
          💡 Ask the business to share their QR code or waitlist link
        </p>
      </div>
    </div>
  );
};

export default QRScanner;
