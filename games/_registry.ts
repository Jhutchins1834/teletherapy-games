import type { GameConfig } from '@/lib/setup-menu/types';
import barnyardRace from './barnyard-race/config';
import bubblePop from './bubble-pop/config';

const registry: GameConfig[] = [
  barnyardRace,
  bubblePop,
  // Add new games here — one line per game.
];

export default registry;
