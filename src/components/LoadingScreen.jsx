import { useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/loading.css';

/**
 * Loading screen with animated heart — shown on initial app load.
 */
function LoadingScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="loading-heart">❤️</div>
      <p className="loading-text">Loading Surprise...</p>
      <div className="loading-bar">
        <div className="loading-bar-fill" />
      </div>
    </motion.div>
  );
}

export default LoadingScreen;
