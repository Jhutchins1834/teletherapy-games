'use client';

import { useEffect, useState } from 'react';
import { getPieceSVG, ANIMALS, type AnimalId, type FormLevel } from './pieces';

type Props = {
  animalId: AnimalId;
  form: FormLevel;
  ownerLabel: string; // "Child's piece" or "Therapist's piece"
  onClose: () => void;
};

export default function PieceShowcase({ animalId, form, ownerLabel, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const animal = ANIMALS.find((a) => a.id === animalId)!;
  const Piece = getPieceSVG(animalId, form);
  const formName = animal.forms[form];

  // Animate in on mount
  useEffect(() => {
    // Small delay so the initial state renders first, then transition triggers
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  const animState = closing ? 'closing' : visible ? 'open' : 'entering';

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 transition-opacity duration-200"
        style={{ opacity: animState === 'open' ? 1 : 0 }}
      />

      {/* Modal */}
      <div
        className="relative z-10 flex flex-col items-center gap-3 rounded-2xl bg-white/95 px-10 py-6 shadow-2xl backdrop-blur transition-all duration-200"
        style={{
          transform: animState === 'open' ? 'scale(1)' : 'scale(0.85)',
          opacity: animState === 'open' ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="2" y1="2" x2="12" y2="12" />
            <line x1="12" y1="2" x2="2" y2="12" />
          </svg>
        </button>

        {/* Glow ring behind piece */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: '140px',
              height: '140px',
              background: `radial-gradient(circle, ${animal.color}30, transparent 70%)`,
              animation: 'showcase-glow 2s ease-in-out infinite',
            }}
          />
          {/* Sparkle dots */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i * 45) * Math.PI / 180;
            const r = 60 + (i % 2) * 8;
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: '4px',
                  height: '4px',
                  backgroundColor: i % 2 === 0 ? '#fbbf24' : '#fef3c7',
                  left: `calc(50% + ${Math.cos(angle) * r}px - 2px)`,
                  top: `calc(50% + ${Math.sin(angle) * r}px - 2px)`,
                  animation: `showcase-sparkle 2s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            );
          })}
          <Piece size={96} />
        </div>

        {/* Form name */}
        <p className="text-xl font-bold text-amber-900">{formName}</p>

        {/* Owner label */}
        <p className="text-sm text-amber-600">{ownerLabel}</p>

        {/* Upgrade pips */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full border transition-colors ${
                i <= form
                  ? 'bg-amber-400 border-amber-500'
                  : 'bg-gray-200 border-gray-300'
              }`}
            />
          ))}
          <span className="ml-1 text-xs text-amber-500">{form}/2</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes showcase-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
        @keyframes showcase-sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
