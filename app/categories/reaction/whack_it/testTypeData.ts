
// Typings
export interface Mole {
  id: number;
  isVisible: boolean;
}

export interface GameSettings {
  basePoints: number;
  levelMultiplier: number;
  maxLevel: number;
  minLevel: number;
  showDuration: number;
  gridSize: number;
  missLimit: number;
  correctStreakLimit: number;
  wrongStreakLimit: number;
}

// Game settings function
export const getGameSettings = (level: number): GameSettings => ({
  basePoints: 1,
  levelMultiplier: level,
  maxLevel: 6,
  minLevel: 1,
  showDuration: Math.max(1200 - level * 150, 200), // Faster at higher levels
  gridSize: Math.min(level + 1, 4), // Max grid size 4x4
  missLimit: 5,
  correctStreakLimit: 5, // Level up after 3 correct streaks
  wrongStreakLimit: 2, // Level down after 2 wrong streaks
});