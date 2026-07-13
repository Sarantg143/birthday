import { useMemo } from 'react';

/**
 * Floating rose petals — soft romantic background decoration.
 */
function FloatingPetals({ count = 15 }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 10}s`,
        duration: `${8 + Math.random() * 8}s`,
        rotation: Math.random() * 360,
        size: 8 + Math.random() * 12,
      })),
    [count]
  );

  return (
    <div className="floating-petals" aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="petal"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            width: `${petal.size}px`,
            height: `${petal.size * 1.4}px`,
            transform: `rotate(${petal.rotation}deg)`,
          }}
        />
      ))}
      <style>{`
        .floating-petals {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 1;
        }
        .petal {
          position: absolute;
          top: -30px;
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 50%, #922b21 100%);
          border-radius: 50% 0 50% 50%;
          opacity: 0.5;
          animation: fall-petal linear infinite;
        }
        @keyframes fall-petal {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default FloatingPetals;
