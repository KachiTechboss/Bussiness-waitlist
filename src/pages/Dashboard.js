import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import QRCode from 'qrcode.react';
import { motion } from 'framer-motion';
import { migrateWaitlists } from '../utils/migrateWaitlists';
import styles from '../styles/Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [waitlists, setWaitlists] = useState([]);
  const [newWaitlistName, setNewWaitlistName] = useState('');
  const [serviceTime, setServiceTime] = useState(5);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedWaitlist, setSelectedWaitlist] = useState(null);
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  // 🔧 Handle migration
  const handleMigration = async () => {
    setIsMigrating(true);
    try {
      const count = await migrateWaitlists();
      setSuccess(`✓ Migration complete: ${count} waitlists updated`);
      setError('');
    } catch (err) {
      setError(`Migration failed: ${err.message}`);
    } finally {
      setIsMigrating(false);
    }
  };

  // Fetch waitlists on mount
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'waitlists'),
      where('ownerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWaitlists(data);
      if (data.length > 0 && !selectedWaitlist) {
        setSelectedWaitlist(data[0].id);
      }
    });

    return unsubscribe;
  }, [user]);

  // Fetch queue for selected waitlist
  useEffect(() => {
    if (!selectedWaitlist) return;

    const q = query(
      collection(db, `waitlists/${selectedWaitlist}/customers`),
      orderBy('position', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQueue(data);
    });

    return unsubscribe;
  }, [selectedWaitlist]);

  const createWaitlist = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, 'waitlists'), {
        ownerId: user.uid,
        name: newWaitlistName,
        serviceTime: parseInt(serviceTime),
        createdAt: new Date(),
      });

      setNewWaitlistName('');
      setServiceTime(5);
      setSuccess('Waitlist created successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!selectedWaitlist) {
        setError('Please select a waitlist first');
        return;
      }

      const position = queue.length + 1;

      await addDoc(
        collection(db, `waitlists/${selectedWaitlist}/customers`),
        {
          name: customerName,
          phone: customerPhone,
          position: position,
          addedAt: new Date(),
          served: false,
        }
      );

      setCustomerName('');
      setCustomerPhone('');
      setSuccess('Customer added to queue!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const serveNext = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (queue.length === 0) {
        setError('Queue is empty');
        return;
      }

      const nextCustomer = queue[0];

      // Remove from queue
      await deleteDoc(
        doc(db, `waitlists/${selectedWaitlist}/customers`, nextCustomer.id)
      );

      // Update remaining customers
      for (let i = 1; i < queue.length; i++) {
        await updateDoc(
          doc(db, `waitlists/${selectedWaitlist}/customers`, queue[i].id),
          { position: i }
        );
      }

      setSuccess(`${nextCustomer.name} has been served!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeCustomer = async (customerId, position) => {
    setError('');
    setLoading(true);

    try {
      await deleteDoc(
        doc(db, `waitlists/${selectedWaitlist}/customers`, customerId)
      );

      // Update positions
      for (let i = position; i < queue.length; i++) {
        if (queue[i].position > position) {
          await updateDoc(
            doc(db, `waitlists/${selectedWaitlist}/customers`, queue[i].id),
            { position: queue[i].position - 1 }
          );
        }
      }

      setSuccess('Customer removed');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getQueueLink = () => {
    return selectedWaitlist
      ? `${window.location.origin}${window.location.pathname}#/queue/${selectedWaitlist}`
      : '';
  };

  const currentWaitlist = waitlists.find((w) => w.id === selectedWaitlist);
  const estimatedWaitTime = queue.length * (currentWaitlist?.serviceTime || 5);

  return (
    <div className={`${styles.dashboard} ${isDark ? 'dark' : ''}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>📊 Business Dashboard</h1>
          <p className={styles.subtitle}>Manage your queues in real-time</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {/* Migration Button (for legacy data) */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0' }}
        >
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
            ⚠️ If you have old waitlists that aren't showing, click below to migrate them:
          </p>
          <button
            onClick={handleMigration}
            disabled={isMigrating}
            style={{
              padding: '10px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isMigrating ? 'not-allowed' : 'pointer',
              opacity: isMigrating ? 0.6 : 1,
            }}
          >
            {isMigrating ? 'Migrating...' : '🔧 Migrate Old Waitlists'}
          </button>
        </motion.div>

        {/* Stats Cards */}
        <div className={styles.grid}>
          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.cardTitle}>Active Waitlists</div>
            <div className={styles.cardValue}>{waitlists.length}</div>
          </motion.div>

          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className={styles.cardTitle}>Queue Length</div>
            <div className={styles.cardValue}>{queue.length}</div>
          </motion.div>

          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.cardTitle}>Est. Wait Time</div>
            <div className={styles.cardValue}>{estimatedWaitTime}m</div>
          </motion.div>
        </div>

        {/* Create Waitlist Form */}
        <motion.div
          className={styles.form}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Create New Waitlist</h2>
            <form onSubmit={createWaitlist}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Waitlist Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={newWaitlistName}
                    onChange={(e) => setNewWaitlistName(e.target.value)}
                    placeholder="e.g., Front Desk, Consultation"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Avg Service Time (min)</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={serviceTime}
                    onChange={(e) => setServiceTime(e.target.value)}
                    min="1"
                    max="60"
                    required
                  />
                </div>
              </div>
              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? 'Creating...' : 'Create Waitlist'}
              </button>
            </form>
          </div>
        </motion.div>

        {waitlists.length > 0 && (
          <>
            {/* Select Waitlist */}
            <motion.div
              className={styles.form}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Select Waitlist</h2>
                <select
                  value={selectedWaitlist}
                  onChange={(e) => setSelectedWaitlist(e.target.value)}
                  className={styles.select}
                >
                  {waitlists.map((wl) => (
                    <option key={wl.id} value={wl.id}>
                      {wl.name} ({wl.serviceTime}m avg)
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* QR Code */}
            <motion.div
              className={styles.qrCodeContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className={styles.qrTitle}>Share this QR Code</h3>
              <QRCode
                value={getQueueLink()}
                size={200}
                level="H"
                includeMargin={true}
              />
              <p style={{ marginTop: '12px', fontSize: '12px' }}>
                {getQueueLink()}
              </p>
              <button
                className={styles.copyBtn}
                onClick={() => {
                  navigator.clipboard.writeText(getQueueLink());
                  setSuccess('Link copied!');
                }}
              >
                Copy Link
              </button>
            </motion.div>

            {/* Add Customer Form */}
            <motion.div
              className={styles.form}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Add Customer</h2>
                <form onSubmit={addCustomer}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Name</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Customer name"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Phone (Optional)</label>
                      <input
                        type="tel"
                        className={styles.input}
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                  <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Adding...' : 'Add to Queue'}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Queue Display */}
            {queue.length > 0 ? (
              <motion.div
                className={styles.queueList}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className={styles.queueHeader}>
                  <h3 className={styles.queueTitle}>Current Queue</h3>
                  <button
                    className={styles.serveBtn}
                    onClick={serveNext}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Serve Next'}
                  </button>
                </div>
                {queue.map((customer, index) => (
                  <motion.div
                    key={customer.id}
                    className={styles.queueItem}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className={styles.queueItemPosition}>#{customer.position}</div>
                    <div className={styles.queueItemInfo}>
                      <div className={styles.queueItemName}>{customer.name}</div>
                      {customer.phone && (
                        <div className={styles.queueItemPhone}>{customer.phone}</div>
                      )}
                    </div>
                    <div className={styles.queueItemActions}>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeCustomer(customer.id, customer.position)}
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className={styles.empty}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className={styles.emptyIcon}>📭</div>
                <div className={styles.emptyTitle}>Queue is empty</div>
                <p>Add customers to get started</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
