'use client';

import { useEffect, useState } from 'react';
import { getPieceSVG, ANIMALS, type AnimalId, type FormLevel } from './pieces';

type Props = {
  animalId: AnimalId;
  newForm: FormLevel;
  onComplete: () => void;
};

export default function MetamorphosisReveal({ animalId, newForm, onComplete }: Props) {
  const [stage, setStage] = useState<'flash' | 'reveal' | 'hold'>('flash');
  const animal = ANIMALS.find((a) => a.id === animalId)!;
  const OldPiece = getPieceSVG(animalId, (newForm - 1) as FormLevel);
  const NewPiece = getPieceSVG(animalId, newForm);
  const formName = animal.forms[newForm];

  useEffect(() => {
    // flash → reveal → hold → dismiss
    const t1 = setTimeout(() => setStage('reveal'), 500);
    const t2 = setTimeout(() => setStage('hold'), 1000);
    const t3 = setTimeout(() => onComplete(), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative flex flex-col items-center gap-3">
        {/* Sparkle ring */}
        <div className="relative">
          {stage === 'flash' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="h-36 w-36 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(251,191,36,0.8), transparent 70%)',
                  animation: 'metamorph-pulse 0.5s ease-out',
                }}
              />
            </div>
          )}

          {/* Sparkle particles */}
          {(stage === 'reveal' || stage === 'hold') &&
            Array.from({ length: 10 }, (_, i) => {
              const angle = (i * 36) * Math.PI / 180;
              const r = 60 + Math.random() * 20;
              return (
                <div
                  key={i}
                  className="absolute rounded-full bg-amber-300"
                  style={{
                    width: '6px',
                    height: '6px',
                    left: `calc(50% + ${Math.cos(angle) * r}px - 3px)`,
                    top: `calc(50% + ${Math.sin(angle) * r}px - 3px)`,
                    animation: `metamorph-sparkle 0.8s ease-out ${i * 0.05}s both`,
                    opacity: 0.8,
                  }}
                />
              );
            })}

          {/* Piece — crossfade */}
          <div className="relative h-28 w-28 flex items-center justify-center">
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
              style={{ opacity: stage === 'flash' ? 1 : 0 }}
            >
              <OldPiece size={96} />
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
              style={{ opacity: stage !== 'flash' ? 1 : 0 }}
            >
              <NewPiece size={96} />
            </div>
          </div>
        </div>

        {/* Label */}
        <div
          className="rounded-xl bg-amber-100 px-6 py-2 shadow-lg transition-opacity duration-300"
          style={{ opacity: stage === 'hold' ? 1 : 0 }}
        >
          <p className="text-center text-lg font-bold text-amber-900">
            ✨ Metamorphosis! ✨
          </p>
          <p className="text-center text-sm text-amber-700">{formName}</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes metamorph-pulse {
          0% { transform: scale(0.3); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes metamorph-sparkle {
          0% { transform: scale(0); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.8; }
          100% { transform: scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
