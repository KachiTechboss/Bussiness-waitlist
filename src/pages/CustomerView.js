import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import {
  doc,
  getDoc,
  collection,
  query,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import styles from "../styles/CustomerView.module.css";

const CustomerView = () => {
  const { waitlistId } = useParams();
  const { isDark } = useTheme();
  const auth = getAuth();

  const [waitlist, setWaitlist] = useState(null);
  const [queue, setQueue] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 🔐 Wait for auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsub;
  }, [auth]);

  // 📄 Fetch waitlist
  useEffect(() => {
    if (!waitlistId) return;

    const fetchWaitlist = async () => {
      try {
        const ref = doc(db, "waitlists", waitlistId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setWaitlist({ id: snap.id, ...snap.data() });
        } else {
          setError("Waitlist not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlist();
  }, [waitlistId]);

  // 🔄 Subscribe to queue
  useEffect(() => {
    if (!waitlistId) return;

    const q = query(
      collection(db, "waitlists", waitlistId, "customers")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      data.sort((a, b) => a.position - b.position);
      setQueue(data);

      if (user) {
        const me = data.find((c) => c.id === user.uid);
        if (me) {
          setUserPosition(me.position);
          setHasJoined(true);
        }
      }
    });

    return unsubscribe;
  }, [waitlistId, user]);

  // ➕ Join queue (FIXED)
  const handleJoinQueue = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!user) {
        setError("You must be logged in to join the queue");
        return;
      }

      if (!waitlistId) {
        setError("Invalid waitlist");
        return;
      }

      const position = queue.length + 1;

      await setDoc(
        doc(db, "waitlists", waitlistId, "customers", user.uid),
        {
          name: customerName,
          phone: customerPhone,
          position,
          addedAt: new Date(),
          served: false,
        }
      );

      setHasJoined(true);
      setSuccess("Successfully joined the queue!");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !waitlist) {
    return <div className={styles.loading}>Loading…</div>;
  }

  if (error && !waitlist) {
    return <div className={styles.error}>{error}</div>;
  }

  const estimatedWaitTime = userPosition
    ? (userPosition - 1) * (waitlist?.serviceTime || 5)
    : queue.length * (waitlist?.serviceTime || 5);

  const progressPercent =
    userPosition && queue.length
      ? ((queue.length - userPosition + 1) / queue.length) * 100
      : 0;

  return (
    <div className={`${styles.customerView} ${isDark ? "dark" : ""}`}>
      <div className={styles.container}>
        <h1>{waitlist?.name || "Queue"}</h1>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {hasJoined && userPosition ? (
          <motion.div className={styles.statusCard}>
            <h2>Your Position</h2>
            <div className={styles.position}>#{userPosition}</div>
            <p>Estimated wait: {estimatedWaitTime} min</p>

            <div className={styles.progressBar}>
              <motion.div
                className={styles.progress}
                animate={{ width: `${Math.max(progressPercent, 5)}%` }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.form
            className={styles.joinForm}
            onSubmit={handleJoinQueue}
          >
            <input
              type="text"
              placeholder="Your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />

            <input
              type="tel"
              placeholder="Phone number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Joining…" : "Join Queue"}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default CustomerView;
