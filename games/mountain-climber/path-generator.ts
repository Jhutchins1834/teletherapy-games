/**
 * Procedural zig-zag path generator for Mountain Climber.
 *
 * Coordinates are percentages (0–100) of the game container.
 *
 * Mountain geometry (from the SVG in Game.tsx, viewBox 800×450):
 *   Summit      ≈ (53%, 9%)
 *   Left base   ≈ (28%, 88%)
 *   Right base  ≈ (72%, 88%)
 *
 * The left and right edges of the mountain face converge linearly at the summit.
 *
 * The zig-zag works by alternating between an "outer" point (near the mountain
 * edge) and an "inner" point (crossing past centre). This guarantees the two
 * paths intersect multiple times, giving the "rivals passing each other" effect.
 */

export type PathPoint = { x: number; y: number };

const SUMMIT: PathPoint = { x: 53, y: 9 };

// X coordinate of the mountain's left edge at a given y%
function leftEdge(y: number): number {
  // at y=100 → x=25, at y=9 → x=53  (linear interpolation)
  return 25 + ((100 - y) / (100 - 9)) * (53 - 25);
}

// X coordinate of the mountain's right edge at a given y%
function rightEdge(y: number): number {
  // at y=100 → x=75, at y=9 → x=53
  return 75 - ((100 - y) / (100 - 9)) * (75 - 53);
}

/**
 * Generate a zig-zag path from the base corner to the summit.
 *
 * @param side   'left' | 'right' — which face of the mountain
 * @param steps  number of discrete word steps
 * @returns      array of (steps + 1) points; index 0 = base, index steps = summit
 */
export function generatePath(side: 'left' | 'right', steps: number): PathPoint[] {
  const baseY = 88;
  const baseX = side === 'left' ? 30 : 70;
  const yRange = baseY - SUMMIT.y; // 79%

  const points: PathPoint[] = [{ x: baseX, y: baseY }];

  for (let i = 1; i <= steps; i++) {
    if (i === steps) {
      points.push({ x: SUMMIT.x, y: SUMMIT.y });
      break;
    }

    const t = i / steps;                 // 0..1 progress toward summit
    const y = baseY - t * yRange;

    const lEdge = leftEdge(y);
    const rEdge = rightEdge(y);
    const center = (lEdge + rEdge) / 2;

    // Zig-zag amplitude shrinks as we near the summit (mountain narrows)
    const amplitude = 0.45 * (1 - t * 0.55);
    const isOdd = i % 2 === 1;

    let x: number;
    if (side === 'left') {
      // Odd steps: cross past centre (inner)
      // Even steps: hug the left edge (outer)
      const outer = lEdge + 3;
      const inner = center + (rEdge - center) * amplitude;
      x = isOdd ? inner : outer;
    } else {
      // Odd steps: cross past centre (inner)
      // Even steps: hug the right edge (outer)
      const outer = rEdge - 3;
      const inner = center - (center - lEdge) * amplitude;
      x = isOdd ? inner : outer;
    }

    // Clamp to mountain surface
    x = Math.max(lEdge + 1, Math.min(rEdge - 1, x));
    points.push({ x, y });
  }

  return points;
}

/**
 * Generate both paths for a game.
 */
export function generatePaths(steps: number): { left: PathPoint[]; right: PathPoint[] } {
  return {
    left: generatePath('left', steps),
    right: generatePath('right', steps),
  };
}
