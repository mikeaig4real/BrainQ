"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Types
type OrderType = "increasing" | "decreasing";

interface GameSettings {
  numberCount: number;
  minDigits: number;
  maxDigits: number;
  streakToLevelUp: number;
  streakToLevelDown: number;
}

interface NumberTile {
  value: number;
  isSelected: boolean;
  id: number;
}

// Game Constants
const INITIAL_LEVEL = 1;
const MAX_LEVEL = 10;
const MIN_LEVEL = 1;

// Utility Functions
const getGameSettings = (level: number): GameSettings => ({
  numberCount: Math.min(4 + Math.floor(level / 2), 8),
  minDigits: Math.min(level, 4),
  maxDigits: Math.min(level + 1, 5),
  streakToLevelUp: 3,
  streakToLevelDown: 2,
});

const generateRandomNumber = (minDigits: number, maxDigits: number): number => {
  const min = Math.pow(10, minDigits - 1);
  const max = Math.pow(10, maxDigits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateNumbers = (settings: GameSettings): number[] => {
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

const CountdownGame: React.FC = () => {
  // State
  const [numbers, setNumbers] = useState<NumberTile[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("increasing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [level, setLevel] = useState(INITIAL_LEVEL);
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  // Add this to your state declarations
  const [feedback, setFeedback] = useState<string>("");

  // Game Logic
  const startNewRound = () => {
    const settings = getGameSettings(level);
    const newNumbers = generateNumbers(settings);

    setNumbers(
      newNumbers.map((num, index) => ({
        value: num,
        isSelected: false,
        id: index,
      }))
    );
    setOrderType(Math.random() > 0.5 ? "increasing" : "decreasing");
    setCurrentIndex(0);
    setGameOver(false);
  };

  const handleLevelProgression = (correct: boolean) => {
    if (correct) {
      setCorrectStreak((prev) => prev + 1);
      setWrongStreak(0);
      if (correctStreak + 1 >= getGameSettings(level).streakToLevelUp) {
        setLevel((prev) => Math.min(prev + 1, MAX_LEVEL));
        setCorrectStreak(0);
      }
    } else {
      setWrongStreak((prev) => prev + 1);
      setCorrectStreak(0);
      if (wrongStreak + 1 >= getGameSettings(level).streakToLevelDown) {
        setLevel((prev) => Math.max(prev - 1, MIN_LEVEL));
        setWrongStreak(0);
      }
    }
  };

  const handleNumberClick = (clickedNumber: NumberTile) => {
    if (gameOver || clickedNumber.isSelected) return;

    const sortedNumbers = [...numbers].sort((a, b) =>
      orderType === "increasing" ? a.value - b.value : b.value - a.value
    );

    const isCorrect = clickedNumber.value === sortedNumbers[currentIndex].value;

    if (isCorrect) {
      setNumbers((prev) =>
        prev.map((num) =>
          num.id === clickedNumber.id ? { ...num, isSelected: true } : num
        )
      );

      if (currentIndex === numbers.length - 1) {
        setFeedback("Good!");
        // Round completed
        handleLevelProgression(true);
        setScore((prev) => prev + level * 10);
        setTimeout(() => {
          setFeedback("");
          startNewRound();
        }, 1000);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setTimeout(() => setFeedback(""), 500);
      }
    } else {
      setGameOver(true);
      setFeedback("Wrong!");
      handleLevelProgression(false);
      setTimeout(() => {
        setFeedback("");
        startNewRound();
      }, 1500);
    }
  };

  // Effects
  useEffect(() => {
    startNewRound();
  }, []);

  // Render
return (
  <div className="flex flex-col items-center justify-center min-h-screen py-2 md:py-4 select-none mt-16">
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      {/* Game Stats */}
      <div className="text-white text-center mb-4">
        <p className="text-xl">Click numbers in {orderType} order</p>
      </div>

      {/* Number Display and Progress Container */}
      <div className="flex justify-center mb-8">
        <motion.div
          className="border-4 border-blue-500 rounded-lg w-full h-32 flex items-center justify-center relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Current Progress Display */}
          <div className="flex gap-2 text-blue-500 text-sm">
            {[...numbers]
              .sort((a, b) =>
                orderType === "increasing"
                  ? a.value - b.value
                  : b.value - a.value
              )
              .map((number, idx) => (
                <span
                  key={number.id}
                  className={`
                  ${idx === currentIndex ? "text-yellow-500" : ""}
                  ${number.isSelected ? "text-green-500" : ""}
                `}
                >
                  {idx < currentIndex || number.isSelected ? number.value : "?"}
                </span>
              ))}
          </div>
        </motion.div>
      </div>

      {/* Number Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {numbers.map((number) => (
          <motion.button
            key={number.id}
            onClick={() => handleNumberClick(number)}
            className={`
              flex items-center justify-center lg:p-3 p-1 rounded-xl text-lg lg:text-2xl font-bold
              ${
                number.isSelected
                  ? "bg-green-400 text-white"
                  : gameOver
                  ? "bg-red-400 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }
              disabled:opacity-50 transition-colors duration-200
            `}
            whileHover={!number.isSelected && !gameOver ? { scale: 1.05 } : {}}
            whileTap={!number.isSelected && !gameOver ? { scale: 0.95 } : {}}
            disabled={number.isSelected || gameOver}
          >
            {number.value}
          </motion.button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <motion.div
          className="fixed top-8 left-0 right-0 text-white text-2xl md:text-6xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 40 }}
        >
          {feedback}
        </motion.div>
      )}
    </div>
  </div>
);

};

export default CountdownGame;
