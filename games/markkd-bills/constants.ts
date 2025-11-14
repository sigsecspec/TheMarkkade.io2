import { Symbol } from './types';

export const SYMBOLS: Symbol[] = ['💵', '💴', '💶', '💷', '💸', '💳', '🪙', '🧾', '🏦', '🏧', '💱'];

export const PAYOUTS: { [key in Symbol]?: { [count: number]: number } } = {
  '💵': { 3: 50, 4: 100, 5: 250 },
  '💴': { 3: 20, 4: 40, 5: 60 },
  '💶': { 3: 20, 4: 40, 5: 60 },
  '💷': { 3: 20, 4: 40, 5: 60 },
  '💸': { 3: 15, 4: 35, 5: 55 },
  '💳': { 3: 10, 4: 20, 5: 40 },
  '🪙': { 3: 8, 4: 15, 5: 30 },
  '🧾': { 3: 8, 4: 12, 5: 25 },
  '🏦': { 3: 5, 4: 10, 5: 20 },
  '🏧': { 3: 5, 4: 10, 5: 20 },
};

export const BONUS_SYMBOL: Symbol = '💱';

export const FREE_SPINS_REWARDS: { [count: number]: number } = {
    3: 5,
    4: 10,
    5: 25,
};

export const REEL_COUNT = 5;
export const SPIN_DURATION = 3000; // in milliseconds
export const BET_OPTIONS = [10, 20, 30, 40, 50];
