/**
 * 30-space loop board arranged as a rounded rectangle.
 *
 * Layout: 8 spaces top, 7 right, 8 bottom, 7 left = 30.
 * Board coordinate system: percentage-based (0-100) within
 * the board container for responsive layout.
 *
 * Biomes (aesthetic only):
 *   top    = woods
 *   right  = desert
 *   bottom = swamp
 *   left   = ocean
 *
 * Colors: blue, red, yellow, green, purple, gold (5 of each).
 * Gold spaces distributed every ~6th space.
 */

export type SpaceColor = 'blue' | 'red' | 'yellow' | 'green' | 'purple' | 'gold';
export type Biome = 'woods' | 'desert' | 'swamp' | 'ocean';

export type BoardSpace = {
  index: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  color: SpaceColor;
  biome: Biome;
  isStart: boolean;
};

// Board geometry: the 30 spaces distributed around a rectangle
// Margins: left=8%, right=92%, top=5%, bottom=95%
const LEFT = 8;
const RIGHT = 92;
const TOP = 5;
const BOTTOM = 95;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function computePositions(): { x: number; y: number; biome: Biome }[] {
  const positions: { x: number; y: number; biome: Biome }[] = [];

  // Top edge: 8 spaces, left to right (woods)
  for (let i = 0; i < 8; i++) {
    positions.push({
      x: lerp(LEFT, RIGHT, i / 7),
      y: TOP,
      biome: 'woods',
    });
  }

  // Right edge: 7 spaces, top to bottom (desert), skip corners
  for (let i = 0; i < 7; i++) {
    positions.push({
      x: RIGHT,
      y: lerp(TOP, BOTTOM, (i + 1) / 8),
      biome: 'desert',
    });
  }

  // Bottom edge: 8 spaces, right to left (swamp)
  for (let i = 0; i < 8; i++) {
    positions.push({
      x: lerp(RIGHT, LEFT, i / 7),
      y: BOTTOM,
      biome: 'swamp',
    });
  }

  // Left edge: 7 spaces, bottom to top (ocean), skip corners
  for (let i = 0; i < 7; i++) {
    positions.push({
      x: LEFT,
      y: lerp(BOTTOM, TOP, (i + 1) / 8),
      biome: 'ocean',
    });
  }

  return positions;
}

// Color assignment: gold at indices 0, 6, 12, 18, 24 (every 6th, 5 total)
// Remaining 25 spaces: 5 each of blue, red, yellow, green, purple
const GOLD_INDICES = new Set([0, 6, 12, 18, 24]);

const NON_GOLD_COLORS: SpaceColor[] = (function () {
  const pool: SpaceColor[] = [];
  const colors: SpaceColor[] = ['blue', 'red', 'yellow', 'green', 'purple'];
  for (const c of colors) {
    for (let i = 0; i < 5; i++) pool.push(c);
  }
  // Distribute in a repeating pattern for visual variety
  // Sort so adjacent spaces differ in color
  const ordered: SpaceColor[] = [];
  for (let i = 0; i < 5; i++) {
    for (const c of colors) {
      ordered.push(c);
    }
  }
  return ordered;
})();

function assignColors(): SpaceColor[] {
  const colors: SpaceColor[] = [];
  let nonGoldIdx = 0;
  for (let i = 0; i < 30; i++) {
    if (GOLD_INDICES.has(i)) {
      colors.push('gold');
    } else {
      colors.push(NON_GOLD_COLORS[nonGoldIdx++]);
    }
  }
  return colors;
}

const positions = computePositions();
const colors = assignColors();

export const START_INDEX = 0;

const board: BoardSpace[] = positions.map((pos, i) => ({
  index: i,
  x: pos.x,
  y: pos.y,
  color: colors[i],
  biome: pos.biome,
  isStart: i === START_INDEX,
}));

export default board;

/** Space color → CSS classes */
export const SPACE_COLORS: Record<SpaceColor, { bg: string; border: string; ring: string }> = {
  blue:   { bg: 'bg-blue-400',   border: 'border-blue-600',   ring: 'ring-blue-300' },
  red:    { bg: 'bg-red-400',    border: 'border-red-600',    ring: 'ring-red-300' },
  yellow: { bg: 'bg-yellow-300', border: 'border-yellow-500', ring: 'ring-yellow-200' },
  green:  { bg: 'bg-green-400',  border: 'border-green-600',  ring: 'ring-green-300' },
  purple: { bg: 'bg-purple-400', border: 'border-purple-600', ring: 'ring-purple-300' },
  gold:   { bg: 'bg-amber-300',  border: 'border-amber-500',  ring: 'ring-amber-200' },
};
