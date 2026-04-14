'use client';

import { useState, useEffect } from 'react';

type Props = {
  onComplete: (value: number) => void;
  forcedValue?: number; // dev-mode override
};

export default function SpinAnimation({ onComplete, forcedValue }: Props) {
  const [display, setDisplay] = useState(1);
  const [phase, setPhase] = useState<'spinning' | 'landed'>('spinning');
  const finalValue = forcedValue ?? (Math.floor(Math.random() * 3) + 1);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 16; // ~800ms at 50ms intervals
    const interval = setInterval(() => {
      frame++;
      if (frame < totalFrames) {
        // Cycle 1-2-3 rapidly, slowing down near the end
        setDisplay((frame % 3) + 1);
      } else {
        setDisplay(finalValue);
        setPhase('landed');
        clearInterval(interval);
        // Hold for a beat, then report
        setTimeout(() => onComplete(finalValue), 400);
      }
    }, 50);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-2xl border-4 text-4xl font-black shadow-xl transition-all duration-200 ${
          phase === 'landed'
            ? 'scale-110 border-amber-400 bg-amber-100 text-amber-800'
            : 'border-gray-300 bg-white text-gray-700 animate-pulse'
        }`}
      >
        {display}
      </div>
      <p className="text-sm font-semibold text-amber-700">
        {phase === 'spinning' ? 'Spinning…' : `Move ${finalValue}!`}
      </p>
    </div>
  );
}
