
export interface Chip {
  id: string;
  value: number;
  color: string;
}

// First, let's define our templates and helper types
export interface LevelTemplate {
  minChips: number;
  maxChips: number;
  valueRange: { min: number; max: number };
  difficulty: number;
  targetRange: { min: number; max: number };
}

export const levelTemplates: Record<number, LevelTemplate> = {
  1: {
    minChips: 2,
    maxChips: 3,
    valueRange: { min: 1, max: 10 },
    difficulty: 0.7,
    targetRange: { min: 5, max: 15 },
  },
  2: {
    minChips: 2,
    maxChips: 4,
    valueRange: { min: 1, max: 15 },
    difficulty: 0.8,
    targetRange: { min: 10, max: 25 },
  },
  3: {
    minChips: 3,
    maxChips: 5,
    valueRange: { min: 1, max: 20 },
    difficulty: 0.85,
    targetRange: { min: 15, max: 35 },
  },
  4: {
    minChips: 4,
    maxChips: 6,
    valueRange: { min: 1, max: 25 },
    difficulty: 0.9,
    targetRange: { min: 20, max: 45 },
  },
  5: {
    minChips: 4,
    maxChips: 7,
    valueRange: { min: 1, max: 30 },
    difficulty: 0.95,
    targetRange: { min: 25, max: 55 },
  },
  6: {
    minChips: 5,
    maxChips: 8,
    valueRange: { min: 1, max: 35 },
    difficulty: 1,
    targetRange: { min: 30, max: 65 },
  },
};

// Weighted random number generator
export const getWeightedRandom = (min: number, max: number, bias: number): number => {
  const random = Math.random();
  const weighted = Math.pow(random, bias);
  return Math.floor(min + weighted * (max - min));
};

// Generate a single board based on level template
export const generateBoard = (template: LevelTemplate): Chip[] => {
  const numChips = getWeightedRandom(template.minChips, template.maxChips, 1);
  const chips: Chip[] = [];

  for (let i = 0; i < numChips; i++) {
    const value = getWeightedRandom(
      template.valueRange.min,
      template.valueRange.max,
      template.difficulty
    );
    chips.push({
      id: `chip-${value}-${Math.random()}`,
      value,
      color: generateColor(value),
    });
  }

  return chips;
};

export interface GameSettings {
  correctStreakLimit: number;
  wrongStreakLimit: number;
  pointsPerCorrect: number;
  feedbackDuration: number;
}

export const getGameSettings = (): GameSettings => ({
  correctStreakLimit: 3, // Number of correct answers needed to level up
  wrongStreakLimit: 2, // Number of wrong answers before leveling down
  pointsPerCorrect: 1, // Base points for correct answer (multiplied by level)
  feedbackDuration: 2500, // How long to show feedback in ms
});

export const generateColor = (value: number): string => {
  const hue = (value * 137.508) % 360; // Golden angle approximation
  return `hsl(${hue}, 70%, 50%)`;
};

// Generate both boards for a round
export const generateBoards = (level: number): { left: Chip[]; right: Chip[] } => {
  const template = levelTemplates[level] || levelTemplates[1];

  // Generate two boards
  const leftBoard = generateBoard(template);
  const rightBoard = generateBoard(template);

  // Ensure boards are different enough
  const leftSum = leftBoard.reduce((sum, chip) => sum + chip.value, 0);
  const rightSum = rightBoard.reduce((sum, chip) => sum + chip.value, 0);

  // If sums are too close, adjust one board
  if (Math.abs(leftSum - rightSum) < 2) {
    const adjustBoard = Math.random() > 0.5 ? leftBoard : rightBoard;
    const randomChipIndex = Math.floor(Math.random() * adjustBoard.length);
    adjustBoard[randomChipIndex].value += 2;
    adjustBoard[randomChipIndex].color = generateColor(
      adjustBoard[randomChipIndex].value
    );
  }

  return { left: leftBoard, right: rightBoard };
};