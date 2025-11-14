
import { Symbol } from './types';

export const SYMBOLS: Symbol[] = ['🍒', '🍋', '🍊', '🔔', '💎', '🍀', '7️⃣'];

export const PAYOUTS: { [key in Symbol]: number } = {
  '🍒': 10,
  '🍋': 20,
  '🍊': 30,
  '🔔': 50,
  '💎': 100,
  '🍀': 250,
  '7️⃣': 500,
};

export const REEL_COUNT = 3;
export const SPIN_DURATION = 2500; // in milliseconds
export const STARTING_CREDITS = 1000;
export const DEFAULT_BET = 10;
export const MAX_BET = 100;
export const MIN_BET = 10;
export const BET_INCREMENT = 10;
