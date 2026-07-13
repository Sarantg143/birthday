import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/loading.css';

/**
 * Birthday countdown animation — dramatic 3-2-1 before revealing the landing page.
 */
function Countdown({ birthdayDate, onComplete, onCountdownFinal }) {
  const [phase, setPhase] = useState('timer'); // 'timer' | 'final'
  const [timeLeft, setTimeLeft] = useState(null);
  const [finalCount, setFinalCount] = useState(3);

  useEffect(() => {
    const target = new Date(birthdayDate);
    target.setHours(0, 0, 0, 0);

    const update = () => {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        setPhase('final');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [birthdayDate]);

  // Notify parent to play countdown music when 3-2-1 phase starts
  useEffect(() => {
    if (phase === 'final') {
      onCountdownFinal?.();
    }
  }, [phase, onCountdownFinal]);

  // Final 3-2-1 countdown when birthday has arrived
  useEffect(() => {
    if (phase !== 'final') return;

    if (finalCount <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => setFinalCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, finalCount, onComplete]);

  return (
    <motion.div
      className="countdown-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >

      {phase === 'timer' && timeLeft ? (
        <>
          <p className="countdown-title">Counting down to your special day...</p>
          <div className="countdown-number" style={{ fontSize: 'clamp(2rem, 8vw, 4rem)' }}>
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <p className="countdown-subtitle">Something magical is coming...</p>
          <button
            className="btn-primary"
            style={{ marginTop: '2rem' }}
            onClick={() => setPhase('final')}
          >
            Skip to Surprise ✨
          </button>
        </>
      ) : (
        <AnimatePresence mode="wait">
          {finalCount > 0 && (
            <motion.div
              key={finalCount}
              className="countdown-number"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {finalCount}
            </motion.div>
          )}
          {finalCount === 0 && (
            <motion.p
              key="go"
              className="countdown-number"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ fontSize: 'clamp(3rem, 12vw, 6rem)' }}
            >
              🎂
            </motion.p>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

export default Countdown;
