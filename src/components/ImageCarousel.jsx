import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Image carousel / slideshow — auto-advances through gallery images.
 */
function ImageCarousel({ images, autoPlayInterval = 4000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goTo = useCallback(
    (index) => {
      if (images.length === 0) return;
      setCurrentIndex((index + images.length) % images.length);
    },
    [images.length]
  );

  // Auto-advance slideshow
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => goTo(currentIndex + 1), autoPlayInterval);
    return () => clearInterval(timer);
  }, [currentIndex, images.length, autoPlayInterval, goTo]);

  if (images.length === 0) {
    return (
      <div className="carousel">
        <div
          className="carousel-image"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(45, 27, 78, 0.5)',
            color: '#d4af37',
            fontFamily: 'Georgia, serif',
          }}
        >
          Add photos to src/assets/images/
        </div>
      </div>
    );
  }

  return (
    <div className="carousel">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Memory ${currentIndex + 1}`}
          className="carousel-image"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            className="carousel-nav carousel-prev"
            onClick={() => goTo(currentIndex - 1)}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className="carousel-nav carousel-next"
            onClick={() => goTo(currentIndex + 1)}
            aria-label="Next image"
          >
            ›
          </button>
          <div className="carousel-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === currentIndex ? 'active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ImageCarousel;
