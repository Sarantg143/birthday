import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { appConfig } from './config/appConfig';
import LoadingScreen from './components/LoadingScreen';
import Countdown from './components/Countdown';
import LandingPage from './components/LandingPage';
import LoveLetter from './components/LoveLetter';
import ProposalPage from './components/ProposalPage';
import SuccessPage from './components/SuccessPage';
import './styles/global.css';

/**
 * Page flow states:
 * loading → countdown → landing → letter → proposal → success
 */
const PAGES = {
  LOADING: 'loading',
  COUNTDOWN: 'countdown',
  LANDING: 'landing',
  LETTER: 'letter',
  PROPOSAL: 'proposal',
  SUCCESS: 'success',
};

function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.LOADING);
  const { lovedOneName, nickname, senderName, birthdayDate, showCountdown } = appConfig;
  const countdownAudioRef = useRef(null);

  const handleLoadingComplete = useCallback(() => {
    setCurrentPage(showCountdown ? PAGES.COUNTDOWN : PAGES.LANDING);
  }, [showCountdown]);

  const handleCountdownComplete = useCallback(() => {
    setCurrentPage(PAGES.LANDING);
  }, []);

  const handleOpenHeart = useCallback(() => {
    setCurrentPage(PAGES.LETTER);
  }, []);

  const handleLetterContinue = useCallback(() => {
    setCurrentPage(PAGES.PROPOSAL);
  }, []);

  const handleYes = useCallback(() => {
    setCurrentPage(PAGES.SUCCESS);
  }, []);

  // Smooth page transition variants
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 },
  };

  // Stop countdown audio when transitioning to the letter page
  useEffect(() => {
    if (currentPage === PAGES.LETTER && countdownAudioRef.current) {
      countdownAudioRef.current.pause();
      countdownAudioRef.current.currentTime = 0;
    }
  }, [currentPage]);

  const handleCountdownFinal = useCallback(() => {
    if (countdownAudioRef.current) {
      countdownAudioRef.current.currentTime = 0;
      countdownAudioRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="page-wrapper">
      {/* Countdown audio — persists across countdown → landing transition */}
      <audio
        ref={countdownAudioRef}
        src={appConfig.countdownMusic}
        preload="auto"
      />

      <AnimatePresence mode="wait">
        {currentPage === PAGES.LOADING && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}

        {currentPage === PAGES.COUNTDOWN && (
          <Countdown
            key="countdown"
            birthdayDate={birthdayDate}
            onComplete={handleCountdownComplete}
            onCountdownFinal={handleCountdownFinal}
          />
        )}

        {currentPage === PAGES.LANDING && (
          <motion.div key="landing" {...pageTransition}>
            <LandingPage name={lovedOneName} nickname={nickname} onOpenHeart={handleOpenHeart} />
          </motion.div>
        )}

        {currentPage === PAGES.LETTER && (
          <motion.div key="letter" {...pageTransition}>
            <LoveLetter
              name={lovedOneName}
              senderName={senderName}
              onContinue={handleLetterContinue}
            />
          </motion.div>
        )}

        {currentPage === PAGES.PROPOSAL && (
          <motion.div key="proposal" {...pageTransition}>
            <ProposalPage onYes={handleYes} />
          </motion.div>
        )}

        {currentPage === PAGES.SUCCESS && (
          <motion.div key="success" {...pageTransition}>
            <SuccessPage name={lovedOneName} nickname={nickname} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
