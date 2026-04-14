'use client';

import { useState } from 'react';
import { ANIMALS, getPieceSVG, type AnimalId } from './pieces';

type Props = {
  onComplete: (childPiece: AnimalId, therapistPiece: AnimalId) => void;
};

export default function PiecePicker({ onComplete }: Props) {
  const [childPick, setChildPick] = useState<AnimalId | null>(null);
  const [step, setStep] = useState<'child' | 'therapist'>('child');

  const handlePick = (id: AnimalId) => {
    if (step === 'child') {
      setChildPick(id);
      setStep('therapist');
    } else {
      onComplete(childPick!, id);
    }
  };

  const available = step === 'child'
    ? ANIMALS
    : ANIMALS.filter((a) => a.id !== childPick);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <h2 className="text-3xl font-bold text-amber-900">Choose Your Piece!</h2>
      <p className="text-lg text-amber-700">
        {step === 'child'
          ? 'Child picks first — tap an animal'
          : 'Therapist picks from the remaining animals'}
      </p>
      <div className="flex items-center gap-2 rounded-full bg-amber-100 px-5 py-2">
        <span className="text-sm font-semibold text-amber-800">
          {step === 'child' ? "🧒 Child's turn" : "🧑‍⚕️ Therapist's turn"}
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {available.map((animal) => {
          const Piece = getPieceSVG(animal.id, 0);
          return (
            <button
              key={animal.id}
              onClick={() => handlePick(animal.id)}
              className="group flex flex-col items-center gap-2 rounded-2xl border-4 border-transparent bg-white p-4 shadow-lg transition hover:scale-105 hover:border-amber-400 hover:shadow-xl"
              style={{ width: '140px' }}
            >
              <Piece size={72} />
              <span className="text-sm font-bold text-amber-900">{animal.name}</span>
              <span className="text-xs text-amber-600">
                {animal.forms[0]} → {animal.forms[2]}
              </span>
            </button>
          );
        })}
      </div>

      {childPick && step === 'therapist' && (
        <p className="text-sm text-amber-600">
          Child chose: <strong>{ANIMALS.find((a) => a.id === childPick)?.name}</strong>
        </p>
      )}
    </div>
  );
}
