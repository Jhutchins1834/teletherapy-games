'use client';

import board, { SPACE_COLORS, START_INDEX, type BoardSpace } from './board-layout';
import { getPieceSVG, type AnimalId, type FormLevel } from './pieces';

export type PlayerState = {
  position: number; // 0-29 board index
  upgrades: FormLevel; // 0, 1, or 2
  animal: AnimalId;
  totalMoved: number;
};

type Props = {
  players: [PlayerState, PlayerState];
  currentPlayer: 0 | 1;
};

export default function Board({ players, currentPlayer }: Props) {
  return (
    <div className="relative w-full h-full">
      {/* Biome backgrounds */}
      <BiomeBackgrounds />

      {/* Spaces */}
      {board.map((space) => (
        <BoardSpaceEl key={space.index} space={space} players={players} currentPlayer={currentPlayer} />
      ))}
    </div>
  );
}

function BoardSpaceEl({
  space,
  players,
  currentPlayer,
}: {
  space: BoardSpace;
  players: [PlayerState, PlayerState];
  currentPlayer: 0 | 1;
}) {
  const colors = SPACE_COLORS[space.color];
  const playersHere = players.filter((p) => p.position === space.index);

  return (
    <div
      className={`absolute flex items-center justify-center rounded-lg border-2 shadow-sm ${colors.bg} ${colors.border}`}
      style={{
        left: `${space.x}%`,
        top: `${space.y}%`,
        width: '3.8%',
        height: '6%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Start marker */}
      {space.isStart && (
        <span className="absolute -top-4 text-xs font-bold text-amber-800">🚩</span>
      )}

      {/* Gold star indicator */}
      {space.color === 'gold' && playersHere.length === 0 && (
        <span className="text-xs">⭐</span>
      )}

      {/* Player pieces on this space */}
      {playersHere.length > 0 && (
        <div className="flex items-center gap-0">
          {playersHere.map((p, i) => {
            const playerIdx = players.indexOf(p);
            const Piece = getPieceSVG(p.animal, p.upgrades);
            const isActive = playerIdx === currentPlayer;
            return (
              <div
                key={playerIdx}
                className={`transition-transform duration-300 ${isActive ? 'scale-110 z-10' : 'scale-90 opacity-80'}`}
                style={{
                  marginLeft: i > 0 ? '-6px' : '0',
                  filter: isActive ? 'drop-shadow(0 0 3px rgba(251,191,36,0.8))' : 'none',
                }}
              >
                <Piece size={28} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BiomeBackgrounds() {
  return (
    <>
      {/* Woods — top */}
      <div className="absolute left-[5%] top-0 right-[5%] h-[12%] rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-700 to-green-500 opacity-20" />
        <div className="absolute bottom-0 left-0 right-0 flex justify-around opacity-25">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ fontSize: `${0.7 + (i % 2) * 0.3}rem` }} className="text-green-800">🌲</span>
          ))}
        </div>
      </div>

      {/* Desert — right */}
      <div className="absolute right-0 top-[5%] bottom-[5%] w-[12%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-amber-300 to-amber-100 opacity-15" />
        <div className="absolute bottom-2 right-1 opacity-20">
          <span style={{ fontSize: '0.9rem' }}>🌵</span>
        </div>
      </div>

      {/* Swamp — bottom */}
      <div className="absolute left-[5%] bottom-0 right-[5%] h-[12%] rounded-b-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-green-900 to-green-600 opacity-15" />
        <div className="absolute top-0 left-0 right-0 flex justify-around opacity-20">
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ fontSize: '0.7rem' }} className="text-green-900">🌿</span>
          ))}
        </div>
      </div>

      {/* Ocean — left */}
      <div className="absolute left-0 top-[5%] bottom-[5%] w-[12%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-200 opacity-15" />
        <div className="absolute bottom-3 left-1 opacity-20">
          <span style={{ fontSize: '0.8rem' }}>⛵</span>
        </div>
      </div>
    </>
  );
}
