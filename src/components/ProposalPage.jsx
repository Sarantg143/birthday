import { useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import FloatingHearts from './FloatingHearts';
import FloatingPetals from './FloatingPetals';
import '../styles/proposal.css';

/**
 * Proposal page with evasive NO button and animated heart.
 * NO button moves to random positions avoiding the YES button.
 */
function ProposalPage({ onYes, onNoAttempt }) {
  const noBtnRef = useRef(null);
  const yesBtnRef = useRef(null);
  const containerRef = useRef(null);

  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${6 + Math.random() * 8}s`,
      })),
    []
  );

  /**
   * Move NO button to a random position within viewport,
   * ensuring it doesn't overlap with the YES button.
   */
  const moveNoButton = useCallback(() => {
    const noBtn = noBtnRef.current;
    const yesBtn = yesBtnRef.current;
    if (!noBtn) return;

    const btnRect = noBtn.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;
    const padding = 20;

    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;

    let newX, newY;
    let attempts = 0;

    do {
      newX = padding + Math.random() * maxX;
      newY = padding + Math.random() * maxY;
      attempts++;
    } while (
      attempts < 50 &&
      yesBtn &&
      isOverlapping(newX, newY, btnWidth, btnHeight, yesBtn, 40)
    );

    noBtn.style.position = 'fixed';
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
    noBtn.style.transition = 'left 0.3s ease, top 0.3s ease';
  }, []);

  const handleNoHover = () => moveNoButton();

  const handleNoClick = (e) => {
    e.preventDefault();
    moveNoButton();
    onNoAttempt?.();
  };

  return (
    <motion.section
      className="proposal-page"
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
    >
      <FloatingHearts count={20} />
      <FloatingPetals count={10} />

      {/* Floating particles */}
      <div className="proposal-particles" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className="proposal-particle"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <motion.h2
        className="proposal-title glow-text"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Will You Be My Girlfriend? ❤️
      </motion.h2>

      {/* Pulsing heart */}
      <motion.div
        className="proposal-heart"
        animate={{
          scale: [1, 1.15, 1, 1.1, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        ❤️
      </motion.div>

      <div className="proposal-buttons">
        <motion.button
          ref={yesBtnRef}
          className="btn-yes"
          onClick={onYes}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          YES ❤️
        </motion.button>

        <button
          ref={noBtnRef}
          className="btn-no"
          onMouseEnter={handleNoHover}
          onTouchStart={handleNoHover}
          onClick={handleNoClick}
        >
          NO 💔
        </button>
      </div>
    </motion.section>
  );
}

/** Check if two rectangles overlap with optional buffer */
function isOverlapping(x, y, width, height, otherEl, buffer = 0) {
  const other = otherEl.getBoundingClientRect();
  return !(
    x + width + buffer < other.left ||
    x - buffer > other.right ||
    y + height + buffer < other.top ||
    y - buffer > other.bottom
  );
}

export default ProposalPage;
