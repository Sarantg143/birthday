import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingHearts from './FloatingHearts';
import { appConfig } from '../config/appConfig';
import '../styles/letter.css';

/**
 * Love letter with medieval royal scroll opening animation.
 * Scroll unfolds vertically and horizontally using Framer Motion.
 */
function LoveLetter({ name, senderName, onContinue }) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const audioRef = useRef(null);

  const letterLines = [
    `Dear ${name},`,
    
    'Happy Birthday, GV! 🎂💜🧚‍♀️',
    
    'First of all, I wish you a day filled with happiness, smiles, and countless beautiful memories. May this new year of your life bring you good health, success, peace, and everything you\'ve ever wished for. You truly deserve the very best. 💜',
    
    'Indha birthday-la naan un kitta en manasula romba naala irundha oru vishayathai sollanum-nu ninaichen.',
   
    'GV... enakku unnai romba pidikkum. Indha feeling konjam konjama valandhu, innikku adhu unmaiyana kaadhal-a maariduchu.',
   
    'Un sirippu en naalai azhaga maathudhu. Un kindness, un character, un pesura vidham... idhellam dhaan unnai enakku romba special-a maathiduchu. Nee enakku oru angel maadhiri thonura. 👼💜',
   
    'Unna paakkumbodhum, un pathi ninaikkumbodhum enakku oru thani santhosham kidaikkudhu. Nee ennai oru better person-a irukkanum-nu inspire pannura.',
   
    'Indha message-la unnai pressure panna illa. En manasula irukkura unmaiyana feelings-a nermaiya share pannanum-nu dhaan ezhudhuren.',
    
    'I truly love you, GV. 💜',
   
    'En vaazhkai payanathula un kooda nadakka enakku romba aasai. Unna santhoshama paathukkanum, un kanavugalukku support-a irukkanum, un sirippukku kaaranama irukkanum-nu virumburen.',
    
    'Will you accept my love and give me a chance to be the one who truly loves and cares for you? 💜',
    
    'Un answer edhuva irundhaalum, adhai naan muzhumaiya mariyadhai seiven. Un mela enakku irukkura respect eppavum maaradhu.',

    'Once again,',
    
    'Happy Birthday, Potato. 🎂💜',
   
    'May your smile always shine as beautifully as it does today.'
  ];

  // Auto-start scroll opening on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      // Play love music when the scroll opens
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      // Pause and reset audio on unmount to prevent overlap
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Animate letter lines one by one after scroll opens
  useEffect(() => {
    if (!isOpen) return;

    let interval;
    const startDelay = setTimeout(() => {
      let line = 0;
      interval = setInterval(() => {
        line++;
        setVisibleLines(line);
        if (line >= letterLines.length) clearInterval(interval);
      }, 180);
    }, 600);

    return () => {
      clearTimeout(startDelay);
      if (interval) clearInterval(interval);
    };
  }, [isOpen, letterLines.length]);

  return (
    <motion.section
      className="letter-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <FloatingHearts count={10} />

      {/* Love music — plays when the scroll opens */}
      <audio ref={audioRef} preload="auto">
        <source src={appConfig.letterMusic} type="audio/mpeg" />
      </audio>

      <div className="scroll-container">
        <motion.div
          className="scroll-wrapper"
          initial={{ scaleY: 0.05, scaleX: 0.3, opacity: 0 }}
          animate={
            isOpen
              ? { scaleY: 1, scaleX: 1, opacity: 1 }
              : { scaleY: 0.05, scaleX: 0.3, opacity: 0.8 }
          }
          transition={{
            scaleY: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            scaleX: { duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.5 },
          }}
        >
          {/* Top scroll roll */}
          <motion.div
            className="scroll-roll scroll-roll-top"
            animate={isOpen ? { scaleY: 1, opacity: 1 } : { scaleY: 2, opacity: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />

          {/* Parchment body */}
          <motion.div
            className="parchment"
            initial={{ height: 0, padding: 0 }}
            animate={
              isOpen
                ? { height: 'auto', padding: undefined }
                : { height: 0, padding: 0 }
            }
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="letter-glow" />

            <div className="letter-content">
              {letterLines.map((line, index) => (
                <p
                  key={index}
                  style={{
                    opacity: index < visibleLines ? 1 : 0,
                    transform: index < visibleLines ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    minHeight: line === '' ? '0.5rem' : 'auto',
                    fontWeight: line.startsWith('Dear') || line === 'I truly love you.' ? 600 : 400,
                    fontStyle: line === 'I truly love you.' ? 'italic' : 'normal',
                    color: line === 'I truly love you.' ? '#8b0000' : undefined,
                    fontSize: line === 'I truly love you.' ? '1.3em' : undefined,
                  }}
                >
                  {line || '\u00A0'}
                </p>
              ))}

              <AnimatePresence>
                {visibleLines >= letterLines.length && (
                  <motion.p
                    className="letter-signature"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    With love,
                    <br />
                    {senderName}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="letter-wax-seal">💜</div>
          </motion.div>

          {/* Bottom scroll roll */}
          <motion.div
            className="scroll-roll scroll-roll-bottom"
            animate={isOpen ? { scaleY: 1, opacity: 1 } : { scaleY: 2, opacity: 0.8 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
        </motion.div>
      </div>

      {/* Continue button — appears after letter finishes */}
      <AnimatePresence>
        {visibleLines >= letterLines.length && (
          <motion.button
            className="btn-primary letter-continue-btn"
            onClick={onContinue}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue ❤️
          </motion.button>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default LoveLetter;
