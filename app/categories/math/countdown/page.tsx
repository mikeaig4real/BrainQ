"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import {
  OrderType,
  NumberTile,
  getGameSettings,
  generateNumbers,
  MAX_LEVEL,
  MIN_LEVEL,
} from "./testTypeData";

const CountdownGame: React.FC = () => {
  // State
  const { updateGameStats, categoryIndex, gameSession } = useGame();
  const [numbers, setNumbers] = useState<NumberTile[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("increasing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [level, setLevel] = useState(
    gameSession?.[categoryIndex]?.test?.level || 1
  );
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
    updateGameStats({ totalQuestions: 1 });
    setOrderType(Math.random() > 0.5 ? "increasing" : "decreasing");
    setCurrentIndex(0);
    setGameOver(false);
  };

  const handleLevelProgression = (correct: boolean) => {
    if (correct) {
      setCorrectStreak((prev) => prev + 1);
      setWrongStreak(0);
      if (correctStreak + 1 >= getGameSettings(level).streakToLevelUp) {
        updateGameStats({ level: Math.min(level + 1, MAX_LEVEL) }, "set");
        setLevel((prev) => Math.min(prev + 1, MAX_LEVEL));
        setCorrectStreak(0);
      }
    } else {
      setWrongStreak((prev) => prev + 1);
      setCorrectStreak(0);
      if (wrongStreak + 1 >= getGameSettings(level).streakToLevelDown) {
        updateGameStats({ level: Math.max(level - 1, MIN_LEVEL) }, "set");
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
        updateGameStats({
          totalCorrect: 1,
        });
        setTimeout(() => {
          setFeedback("");
          startNewRound();
        }, 1500);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setTimeout(() => setFeedback(""), 1500);
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
    <div
      role="main"
      aria-label="Number Sequence Game"
      className="flex flex-col items-center justify-center min-h-screen py-2 md:py-4 select-none mt-16"
    >
      <div
        role="heading"
        aria-level={1}
        className="flex flex-col gap-4 w-full max-w-2xl mx-auto"
      >
        {/* Game Stats */}
        <div className="text-neutral-800 dark:text-neutral-200 text-center mb-4">
          <p className="text-xl">Click numbers in {orderType} order</p>
        </div>

        {/* Number Display and Progress Container */}
        <div
          role="region"
          aria-label="Progress tracking"
          className="flex justify-center mb-8"
        >
          <motion.div
            className="border-4 border-red-500 rounded-lg w-full h-32 flex items-center justify-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-label="Current sequence progress"
          >
            {/* Current Progress Display */}
            <div
              role="status"
              aria-live="polite"
              className="flex gap-2 text-red-500 text-sm"
            >
              {[...numbers]
                .sort((a, b) =>
                  orderType === "increasing"
                    ? a.value - b.value
                    : b.value - a.value
                )
                .map((number, idx) => (
                  <span
                    aria-label={`${
                      number.isSelected
                        ? "Selected"
                        : idx === currentIndex
                        ? "Current"
                        : "Hidden"
                    } number ${number.isSelected ? number.value : "?"}`}
                    key={number.id}
                    className={`
                  ${idx === currentIndex ? "text-yellow-500" : ""}
                  ${number.isSelected ? "text-green-500" : ""}
                `}
                  >
                    {idx < currentIndex || number.isSelected
                      ? number.value
                      : "?"}
                  </span>
                ))}
            </div>
          </motion.div>
        </div>

        {/* Number Grid */}
        <div
          role="group"
          aria-label="Number selection grid"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
        >
          {numbers.map((number) => (
            <motion.button
              key={number.id}
              onClick={() => handleNumberClick(number)}
              className={`
              flex items-center justify-center lg:p-3 p-1 rounded-xl text-lg lg:text-2xl font-bold
              ${
                number.isSelected
                  ? "bg-green-400 text-neutral-800 dark:text-neutral-200"
                  : gameOver
                  ? "bg-red-400 text-neutral-800 dark:text-neutral-200"
                  : "bg-red-500 text-neutral-800 dark:text-neutral-200 hover:bg-red-600"
              }
              disabled:opacity-50 transition-colors duration-200
            `}
              whileHover={
                !number.isSelected && !gameOver ? { scale: 1.05 } : {}
              }
              whileTap={!number.isSelected && !gameOver ? { scale: 0.95 } : {}}
              disabled={number.isSelected || gameOver}
              aria-label={`Number ${number.value}${
                number.isSelected ? " - already selected" : ""
              }`}
              aria-disabled={number.isSelected || gameOver}
            >
              {number.value}
            </motion.button>
          ))}
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.div
            className="fixed top-8 left-0 right-0 text-neutral-800 dark:text-neutral-200 text-2xl md:text-6xl font-bold text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 40 }}
            role="alert"
            aria-live="assertive"
          >
            {feedback}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CountdownGame;
