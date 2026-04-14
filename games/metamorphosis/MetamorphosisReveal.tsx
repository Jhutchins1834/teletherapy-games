'use client';

import { useEffect, useState } from 'react';
import { getPieceSVG, ANIMALS, type AnimalId, type FormLevel } from './pieces';

type Props = {
  animalId: AnimalId;
  newForm: FormLevel;
  onComplete: () => void;
};

/**
 * Metamorphosis reveal sequence (~4.5s total):
 *
 * 1. 'lift'      (0–300ms)   — piece scales up slightly, lifts off board
 * 2. 'sparkle'   (300–800ms) — sparkle particles gather around the piece
 * 3. 'smoke'     (800–1200ms)— smoke puff expands to hide the piece
 * 4. 'swap'      (1200–1800ms)— piece swaps behind smoke (invisible), smoke at peak
 * 5. 'clear'     (1800–2500ms)— smoke dissipates, new form revealed
 * 6. 'hold'      (2500–4200ms)— new form displayed with label, audience admires
 * 7. dismiss     (4200ms)    — onComplete fires
 */
type Stage = 'lift' | 'sparkle' | 'smoke' | 'swap' | 'clear' | 'hold';

export default function MetamorphosisReveal({ animalId, newForm, onComplete }: Props) {
  const [stage, setStage] = useState<Stage>('lift');
  const animal = ANIMALS.find((a) => a.id === animalId)!;
  const OldPiece = getPieceSVG(animalId, (newForm - 1) as FormLevel);
  const NewPiece = getPieceSVG(animalId, newForm);
  const formName = animal.forms[newForm];

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage('sparkle'), 300),
      setTimeout(() => setStage('smoke'), 800),
      setTimeout(() => setStage('swap'), 1200),
      setTimeout(() => setStage('clear'), 1800),
      setTimeout(() => setStage('hold'), 2500),
      setTimeout(() => onComplete(), 4500),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Which piece to show — old piece until 'swap', then new piece
  const showNewPiece = stage === 'swap' || stage === 'clear' || stage === 'hold';
  // Is the piece visible? Hidden during smoke/swap
  const pieceVisible = stage !== 'smoke' && stage !== 'swap';
  // Smoke visible during smoke, swap, and early clear
  const smokeActive = stage === 'smoke' || stage === 'swap' || stage === 'clear';
  // Piece lifted
  const lifted = stage !== 'lift';

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-black/50 transition-opacity duration-300" />

      <div className="relative flex flex-col items-center gap-4">
        {/* Sparkle particles — appear during sparkle+ stages */}
        {stage !== 'lift' && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i * 30) * Math.PI / 180;
              const r = 55 + (i % 3) * 15;
              return (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: '7px',
                    height: '7px',
                    backgroundColor: i % 2 === 0 ? '#fbbf24' : '#fef3c7',
                    left: `calc(50% + ${Math.cos(angle) * r}px - 3.5px)`,
                    top: `calc(50% + ${Math.sin(angle) * r}px - 3.5px)`,
                    animation: `mm-sparkle-orbit 1.5s ease-in-out ${i * 0.08}s infinite`,
                    opacity: smokeActive ? 0.3 : 0.9,
                    transition: 'opacity 0.3s',
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Smoke puff */}
        {smokeActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Multiple smoke blobs for organic look */}
            {[
              { x: 0, y: 0, size: 120, delay: '0s' },
              { x: -20, y: -15, size: 80, delay: '0.05s' },
              { x: 25, y: -10, size: 70, delay: '0.1s' },
              { x: -15, y: 20, size: 75, delay: '0.08s' },
              { x: 20, y: 18, size: 65, delay: '0.12s' },
            ].map((blob, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${blob.size}px`,
                  height: `${blob.size}px`,
                  left: `calc(50% + ${blob.x}px - ${blob.size / 2}px)`,
                  top: `calc(50% + ${blob.y}px - ${blob.size / 2}px)`,
                  background: 'radial-gradient(circle, rgba(230,230,230,0.95), rgba(200,200,200,0.6) 60%, transparent 80%)',
                  animation: stage === 'clear'
                    ? `mm-smoke-clear 0.7s ease-out ${blob.delay} forwards`
                    : `mm-smoke-expand 0.4s ease-out ${blob.delay} both`,
                }}
              />
            ))}
          </div>
        )}

        {/* Piece container */}
        <div
          className="relative h-32 w-32 flex items-center justify-center transition-transform duration-300"
          style={{
            transform: lifted ? 'scale(1.15) translateY(-8px)' : 'scale(1)',
          }}
        >
          {/* Old piece */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
            style={{ opacity: !showNewPiece && pieceVisible ? 1 : 0 }}
          >
            <OldPiece size={108} />
          </div>
          {/* New piece */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-400"
            style={{ opacity: showNewPiece && pieceVisible ? 1 : 0 }}
          >
            <NewPiece size={108} />
          </div>
        </div>

        {/* Golden glow behind piece during reveal */}
        {(stage === 'clear' || stage === 'hold') && (
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: '160px',
              height: '160px',
              left: 'calc(50% - 80px)',
              top: 'calc(50% - 80px)',
              background: 'radial-gradient(circle, rgba(251,191,36,0.3), transparent 70%)',
              animation: 'mm-glow-pulse 1.5s ease-in-out infinite',
            }}
          />
        )}

        {/* Label — appears during hold */}
        <div
          className="rounded-xl bg-amber-100 px-8 py-3 shadow-lg transition-all duration-500"
          style={{
            opacity: stage === 'hold' ? 1 : 0,
            transform: stage === 'hold' ? 'translateY(0)' : 'translateY(10px)',
          }}
        >
          <p className="text-center text-xl font-bold text-amber-900">
            ✨ Metamorphosis! ✨
          </p>
          <p className="text-center text-sm text-amber-700">{formName}</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes mm-sparkle-orbit {
          0%, 100% { transform: scale(0.8) translateY(0); opacity: 0.6; }
          50% { transform: scale(1.3) translateY(-5px); opacity: 1; }
        }
        @keyframes mm-smoke-expand {
          0% { transform: scale(0.2); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes mm-smoke-clear {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes mm-glow-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
