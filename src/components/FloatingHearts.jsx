import { useMemo } from 'react';

/**
 * Floating hearts animation — decorative background element.
 */
function FloatingHearts({ count = 20 }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${6 + Math.random() * 6}s`,
        size: `${0.8 + Math.random() * 1.2}rem`,
        opacity: 0.2 + Math.random() * 0.5,
      })),
    [count]
  );

  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="floating-heart"
          style={{
            left: heart.left,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
            fontSize: heart.size,
            opacity: heart.opacity,
          }}
        >
          ❤️
        </span>
      ))}
      <style>{`
        .floating-hearts {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 1;
        }
        .floating-heart {
          position: absolute;
          bottom: -40px;
          animation: float-heart linear infinite;
        }
        @keyframes float-heart {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0; }
          10% { opacity: var(--opacity, 0.5); }
          90% { opacity: var(--opacity, 0.5); }
          100% { transform: translateY(-110vh) rotate(360deg) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default FloatingHearts;
