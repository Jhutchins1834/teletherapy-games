'use client';

import { useState, useEffect, useRef } from 'react';

type Props = {
  onComplete: (value: number) => void;
  forcedValue?: number; // dev-mode override
};

export default function SpinAnimation({ onComplete, forcedValue }: Props) {
  const [display, setDisplay] = useState(1);
  const [phase, setPhase] = useState<'spinning' | 'landed'>('spinning');
  const finalValueRef = useRef(forcedValue ?? (Math.floor(Math.random() * 3) + 1));
  const finalValue = finalValueRef.current;

  useEffect(() => {
    // Slot-machine style: fast at first, decelerating toward the end.
    // Total duration ~4 seconds, with an ease-out feel.
    // Schedule each tick with increasing delay.
    const totalTicks = 28;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;

    for (let i = 0; i < totalTicks; i++) {
      // Delay curve: starts at ~60ms, eases out to ~300ms per tick
      // Using a power curve: delay = baseDelay + (maxDelay * (i/total)^2)
      const t = i / (totalTicks - 1);
      const delay = 60 + 260 * t * t; // 60ms → 320ms
      elapsed += delay;

      const tick = i;
      timeouts.push(
        setTimeout(() => {
          if (tick < totalTicks - 1) {
            // Cycle through 1, 2, 3
            setDisplay((tick % 3) + 1);
          } else {
            // Final tick: land on the result
            setDisplay(finalValue);
            setPhase('landed');
            // Hold for a beat so the player can read it
            setTimeout(() => onComplete(finalValue), 600);
          }
        }, elapsed),
      );
    }

    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-24 w-24 items-center justify-center rounded-2xl border-4 text-5xl font-black shadow-xl transition-all duration-300 ${
          phase === 'landed'
            ? 'scale-125 border-amber-400 bg-amber-100 text-amber-800'
            : 'border-gray-300 bg-white text-gray-700'
        }`}
        style={phase === 'spinning' ? { animation: 'spin-shake 0.1s ease-in-out infinite' } : undefined}
      >
        {display}
      </div>
      <p className="text-sm font-semibold text-amber-700">
        {phase === 'spinning' ? 'Spinning…' : `Move ${finalValue}!`}
      </p>

      <style jsx>{`
        @keyframes spin-shake {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-2px) rotate(-2deg); }
          75% { transform: translateY(2px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
}
