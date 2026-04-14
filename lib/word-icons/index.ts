// To add a new word icon: find the Lucide icon name at https://lucide.dev,
// import it at the top, and add it to the WORD_ICON_MAP below.

import type { LucideIcon } from 'lucide-react';
import {
  Fan,
  Fish,
  Footprints,
  Utensils,
  Hash,
  Tractor,
  Flame,
  Smile,
  Sun,
  CookingPot,
  Rabbit,
  Waves,
  Radio,
  Rocket,
  Rainbow,
  Home,
  Bell,
  CircleDot,
  School,
  Music,
  Droplet,
} from 'lucide-react';

/**
 * Map of lowercase word → Lucide icon component.
 * Returns null for words without a clean visual match.
 * Partial coverage is intentional — only map words where
 * the icon genuinely represents the word.
 */
const WORD_ICON_MAP: Record<string, LucideIcon> = {
  // f_initial_early
  fan: Fan,
  fish: Fish,
  foot: Footprints,
  fork: Utensils,
  five: Hash,
  farm: Tractor,
  fire: Flame,
  face: Smile,
  // fun, food, feet, fall — no clean matches

  // s_initial_early
  sun: Sun,
  // sock — no match
  soup: CookingPot,
  // sand, seal, sit, soap, sink, sad, see, sew — no clean matches
  sing: Music,

  // r_initial_elementary
  rabbit: Rabbit,
  river: Waves,
  radio: Radio,
  // ribbon — Lucide has Ribbon but it's a cancer-awareness ribbon, not a hair ribbon
  rocket: Rocket,
  rainbow: Rainbow,
  roof: Home,
  // rope, rain, run, red, road — no clean matches
  rain: Droplet,

  // l_final_elementary
  // ball — too generic
  bell: Bell,
  // call, doll, pull, tail — no clean matches
  wheel: CircleDot,
  // snail — no match
  school: School,
  // smell, wall, hill — no clean matches
};

/**
 * Look up a Lucide icon for a given word.
 * Returns null if no appropriate icon exists.
 */
export function getIconForWord(word: string): LucideIcon | null {
  return WORD_ICON_MAP[word.toLowerCase()] ?? null;
}
