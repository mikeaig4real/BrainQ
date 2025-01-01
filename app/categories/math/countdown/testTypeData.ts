export type OrderType = "increasing" | "decreasing";

export interface GameSettings {
  numberCount: number;
  minDigits: number;
  maxDigits: number;
  streakToLevelUp: number;
  streakToLevelDown: number;
}

export interface NumberTile {
  value: number;
  isSelected: boolean;
  id: number;
}

// Game Constants
export const INITIAL_LEVEL = 1;
export const MAX_LEVEL = 10;
export const MIN_LEVEL = 1;

// Utility Functions
export const getGameSettings = (level: number): GameSettings => ({
  numberCount: Math.min(4 + Math.floor(level / 2), 8),
  minDigits: Math.min(level, 4),
  maxDigits: Math.min(level + 1, 5),
  streakToLevelUp: 4,
  streakToLevelDown: 2,
});

export const generateRandomNumber = (minDigits: number, maxDigits: number): number => {
  const min = Math.pow(10, minDigits - 1);
  const max = Math.pow(10, maxDigits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateNumbers = (settings: GameSettings): number[] => {
  const numbers: number[] = [];
  const { numberCount, minDigits, maxDigits } = settings;

  while (numbers.length < numberCount) {
    const newNumber = generateRandomNumber(minDigits, maxDigits);
    if (!numbers.includes(newNumber)) {
      numbers.push(newNumber);
    }
  }
  return numbers;
};