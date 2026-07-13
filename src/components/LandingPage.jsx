import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import FloatingHearts from './FloatingHearts';
import FloatingPetals from './FloatingPetals';
import Balloons from './Balloons';
import { getProfileImage } from '../utils/imageLoader';
import '../styles/landing.css';

/**
 * Landing page — full-screen romantic birthday greeting with typewriter effect.
 */
function LandingPage({ name, nickname, onOpenHeart }) {
  const profileImage = getProfileImage();

  return (
    <motion.section
      className="landing-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
    >
      <FloatingHearts count={25} />
      <FloatingPetals count={12} />
      <Balloons count={10} />

      <div className="landing-content">
        {/* Birthday greeting */}
        <motion.h1
  className="landing-greeting glow-text"
  initial={{ y: -30, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.3, duration: 0.8 }}
>
  <span className="birthday-title">
    Happy Birthday 💜👼
  </span>

  <span className="birthday-name">
    Dear {nickname} 💜🎉
  </span>
</motion.h1>

        {/* Profile image */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={`${name}'s profile`}
              className="landing-profile"
            />
          ) : (
            <div className="landing-profile-placeholder">💕</div>
          )}
        </motion.div>

        {/* Typewriter messages */}
        <motion.div
          className="landing-typewriter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <TypeAnimation
            sequence={[
              'Happy Birthday Dear GV! 🎂💜',
              2500,
              'You make every day brighter with your smile...',
              3000,
              'You are the most beautiful soul I know...',
              3000,
              'Today is YOUR day — enjoy every moment! 💜',
              3000,
            ]}
            wrapper="span"
            speed={45}
            repeat={Infinity}
            cursor={true}
          />
        </motion.div>

        {/* Open heart button */}
        <motion.button
          className="btn-primary landing-btn"
          onClick={onOpenHeart}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Open My Heart 💜
        </motion.button>
      </div>
    </motion.section>
  );
}

export default LandingPage;
