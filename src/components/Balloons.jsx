import { useMemo } from 'react';

/**
 * Animated rising balloons — decorative landing page element.
 */
function Balloons({ count = 8 }) {
  const balloons = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        delay: `${Math.random() * 6}s`,
        duration: `${10 + Math.random() * 8}s`,
        emoji: ['🎈', '🎀', '💛', '💖', '🌸'][i % 5],
      })),
    [count]
  );

  return (
    <div className="balloons-container" aria-hidden="true">
      {balloons.map((b) => (
        <span
          key={b.id}
          className="balloon"
          style={{
            left: b.left,
            animationDelay: b.delay,
            animationDuration: b.duration,
          }}
        >
          {b.emoji}
        </span>
      ))}
    </div>
  );
}

export default Balloons;
