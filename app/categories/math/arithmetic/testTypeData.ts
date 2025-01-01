
export interface Question {
  num1: number;
  num2: number;
  operator: string;
  equation: (string | number)[];
  choices: (string | number)[];
  missingElement: string;
  result: number;
}

export const getGameSettings = (level: number) => {
  return {
    correctStreakLimit: 2, // Correct answers needed for level up
    wrongStreakLimit: 2, // Wrong answers before level down
    basePoints: 1, // Single base point value
    levelMultiplier: level,
    maxLevel: 6,
    minLevel: 1,
    numberRange: {
      min: Math.max(3, Math.floor(level / 3) * 10),
      max: Math.min(10 + level * 15, 200),
    },
    operators:
      level <= 2
        ? ["+", "-"]
        : level <= 4
        ? ["+", "-", "*"]
        : ["+", "-", "*", "/"],
    choiceCount: Math.min(4 + Math.floor(level / 3), 6),
    timeLimit: Math.max(10000 - level * 500, 5000),
  };
};
