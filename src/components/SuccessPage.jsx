import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import FloatingHearts from './FloatingHearts';
import FloatingPetals from './FloatingPetals';
import ImageCarousel from './ImageCarousel';
import Fireworks from './Fireworks';
import { getGalleryImages } from '../utils/imageLoader';
import { sendAcceptanceEmail } from '../services/emailService';
import { appConfig } from '../config/appConfig';
import '../styles/success.css';

/**
 * Success celebration page — confetti, fireworks, gallery, and email notification.
 */
function SuccessPage({ name, nickname }) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [emailSent, setEmailSent] = useState(false);
  const galleryImages = getGalleryImages();
  const successAudioRef = useRef(null);

  useEffect(() => {
    const updateSize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Play success music on mount
  useEffect(() => {
    if (successAudioRef.current) {
      successAudioRef.current.currentTime = 0;
      successAudioRef.current.play().catch(() => {});
    }
    return () => {
      if (successAudioRef.current) {
        successAudioRef.current.pause();
        successAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Send acceptance email on mount
  useEffect(() => {
    const email = appConfig.notificationEmail || 'your-email@example.com';
    console.log('📧 SuccessPage mounted. Sending acceptance email to:', email);
    sendAcceptanceEmail(name, email).then((result) => {
      console.log('📧 Email send result:', JSON.stringify(result, null, 2));
      if (result.success) {
        console.log('✅ Email sent successfully!');
        setEmailSent(true);
      } else {
        console.error('❌ Email failed:', result.message);
      }
    }).catch((err) => {
      console.error('❌ Email sending error:', err.message || err);
    });
  }, [name]);

  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    top: `${5 + Math.random() * 90}%`,
    delay: `${Math.random() * 3}s`,
  }));

  return (
    <motion.section
      className="success-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Success music */}
      <audio
        ref={successAudioRef}
        src={appConfig.successMusic}
        preload="auto"
      />
      {/* Confetti overlay */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={true}
        numberOfPieces={300}
        colors={['#ffd700', '#e74c3c', '#ff6b8a', '#d4af37', '#ff69b4']}
      />

      <Fireworks />
      <FloatingHearts count={30} />
      <FloatingPetals count={15} />

      {/* Sparkle decorations */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="success-sparkle"
          style={{ left: s.left, top: s.top, animationDelay: s.delay }}
        >
          ✨
        </span>
      ))}

      <motion.h1
        className="success-title glow-text"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
      >
        I LOVE YOU {nickname} 💜
      </motion.h1>

      {/* Rotating heart */}
      <motion.div
        className="success-heart"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        💜
      </motion.div>

      <motion.p
        className="success-thankyou"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        Thank You For Accepting My Love 💜
      </motion.p>

      {/* Memory gallery slideshow */}
      <motion.div
        className="success-gallery"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <ImageCarousel images={galleryImages} />
      </motion.div>

      {emailSent && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{ color: 'rgba(212, 175, 55, 0.6)', fontSize: '0.85rem', marginTop: '1rem' }}
        >
          💌 A love note has been sent...
        </motion.p>
      )}
    </motion.section>
  );
}

export default SuccessPage;
