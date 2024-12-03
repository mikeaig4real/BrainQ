"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Chip {
  id: string;
  value: number;
  color: string;
}

// First, let's define our templates and helper types
interface LevelTemplate {
  minChips: number;
  maxChips: number;
  valueRange: { min: number; max: number };
  difficulty: number;
  targetRange: { min: number; max: number };
}

const levelTemplates: Record<number, LevelTemplate> = {
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
const getWeightedRandom = (min: number, max: number, bias: number): number => {
  const random = Math.random();
  const weighted = Math.pow(random, bias);
  return Math.floor(min + weighted * (max - min));
};

// Generate a single board based on level template
const generateBoard = (template: LevelTemplate): Chip[] => {
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

interface GameSettings {
  correctStreakLimit: number;
  wrongStreakLimit: number;
  pointsPerCorrect: number;
  feedbackDuration: number;
}

const getGameSettings = (): GameSettings => ({
  correctStreakLimit: 3,    // Number of correct answers needed to level up
  wrongStreakLimit: 2,      // Number of wrong answers before leveling down
  pointsPerCorrect: 1,     // Base points for correct answer (multiplied by level)
  feedbackDuration: 2500,   // How long to show feedback in ms
});

const generateColor = (value: number): string => {
  const hue = (value * 137.508) % 360; // Golden angle approximation
  return `hsl(${hue}, 70%, 50%)`;
};

// Generate both boards for a round
const generateBoards = (level: number): { left: Chip[]; right: Chip[] } => {
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
    adjustBoard[randomChipIndex].color = generateColor(adjustBoard[randomChipIndex].value);
  }

  return { left: leftBoard, right: rightBoard };
};

// Modified Game component (only the game logic parts)
const Game: React.FC = () => {
  const settings = getGameSettings(); // Get settings once at component level

  const [gameState, setGameState] = useState({
    level: 1,
    score: 0,
    leftBoard: { id: "left", chips: [] as Chip[] },
    rightBoard: { id: "right", chips: [] as Chip[] },
    feedback: "",
    correctStreak: 0,
    wrongStreak: 0,
  });

  // Add the startNewRound function
  const startNewRound = (level: number) => {
    const { left, right } = generateBoards(level);

    setGameState((prev) => ({
      ...prev,
      leftBoard: { id: "left", chips: left },
      rightBoard: { id: "right", chips: right },
      feedback: "",
    }));
  };

  // Initialize the game when component mounts
  useEffect(() => {
    startNewRound(gameState.level);
  }, []);

  const evaluateAnswer = (selectedBoardId: string): boolean => {
    const leftSum = gameState.leftBoard.chips.reduce(
      (sum, chip) => sum + chip.value,
      0
    );
    const rightSum = gameState.rightBoard.chips.reduce(
      (sum, chip) => sum + chip.value,
      0
    );

    const correctBoard = rightSum > leftSum ? "right" : "left";
    return selectedBoardId === correctBoard;
  };

  const handleBoardClick = (boardId: string) => {
    const isCorrect = evaluateAnswer(boardId);

    setGameState((prev) => {
      let newLevel = prev.level;
      let newScore = prev.score;
      let newCorrectStreak = isCorrect ? prev.correctStreak + 1 : 0;
      let newWrongStreak = isCorrect ? 0 : prev.wrongStreak + 1;

      if (isCorrect) {
        newScore += settings.pointsPerCorrect * prev.level;
        if (newCorrectStreak >= settings.correctStreakLimit) {
          newLevel = Math.min(prev.level + 1, 6);
          newCorrectStreak = 0;
        }
      } else {
        if (newWrongStreak >= settings.wrongStreakLimit) {
          newLevel = Math.max(prev.level - 1, 1);
          newWrongStreak = 0;
        }
      }

      return {
        ...prev,
        level: newLevel,
        score: newScore,
        feedback: isCorrect ? "Good!" : "Wrong!",
        correctStreak: newCorrectStreak,
        wrongStreak: newWrongStreak,
      };
    });

    setTimeout(() => {
      startNewRound(gameState.level);
    }, settings.feedbackDuration);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full mt-16">
      {/* Boards Container */}
      <div className="flex flex-col md:flex-row justify-between w-full max-w-4xl gap-8">
        {/* Left Board */}
        <motion.div
          className="border-2 border-red-500 rounded-lg 
                 w-full h-[200px] sm:w-full sm:h-[250px] md:w-[400px] md:h-[300px] 
                 flex flex-wrap content-start gap-1 p-2 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleBoardClick("left")}
        >
          {gameState.leftBoard.chips.map((chip) => (
            <motion.div
              key={chip.id}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                     rounded-full flex items-center justify-center text-white text-lg font-bold pointer-events-none"
              style={{ backgroundColor: chip.color }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {chip.value}
            </motion.div>
          ))}
        </motion.div>

        {/* Right Board */}
        <motion.div
          className="border-2 border-red-500 rounded-lg 
                 w-full h-[200px] sm:w-full sm:h-[250px] md:w-[400px] md:h-[300px] 
                 flex flex-wrap content-start gap-1 p-2 cursor-pointer items-start justify-end"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleBoardClick("right")}
        >
          {gameState.rightBoard.chips.map((chip) => (
            <motion.div
              key={chip.id}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                     rounded-full flex items-center justify-center text-white text-lg font-bold pointer-events-none"
              style={{ backgroundColor: chip.color }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {chip.value}
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* Feedback */}
      {gameState.feedback && (
        <motion.div
          className="fixed top-8 left-0 right-0 text-white text-2xl md:text-6xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 40 }}
        >
          {gameState.feedback}
        </motion.div>
      )}
    </div>
  );
};

export default Game;
