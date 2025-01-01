"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import {
  bgColor,
  Pattern,
  ICONS,
  getGameSettings,
  generatePattern,
  generateOptions,
} from "./testTypeData";


const PatternsGame: React.FC = () => {
  const { updateGameStats, gameSession, categoryIndex } = useGame();
  const settings = getGameSettings();
  const [canClick, setCanClick] = useState(true);
  const [gameState, setGameState] = useState({
    level: gameSession?.[categoryIndex]?.test?.level || 1,
    currentPattern: null as Pattern | null,
    options: [] as (string | number)[],
    feedback: "",
    correctStreak: 0,
    wrongStreak: 0,
    isTransitioning: false,
    displayIndex: -1,
  });

  const startNewRound = () =>
  {
    setCanClick(true);
    const icons = Object.keys(ICONS);
    const valueRange = { min: 1, max: 10 * gameState.level }; // Increase range with level
    const sequenceLength = Math.min(3 + gameState.level, 6); // Gradually increase sequence length

    // Generate pattern dynamically
    const currentPattern = generatePattern(
      gameState.level,
      icons,
      valueRange,
      sequenceLength
    );

    const options = generateOptions(
      currentPattern.answer,
      currentPattern.sequence,
      currentPattern?.patternType
    );

    setGameState((prev) => ({
      ...prev,
      currentPattern,
      options,
      feedback: "",
    }));
    updateGameStats({ totalQuestions: 1 });
  };

  const handleAnswer = ( answer: string | number ) =>
  {
    if (!canClick) return;
    setCanClick(false);
    const isCorrect = answer === gameState.currentPattern?.answer;

    // Calculate new streaks
    const newCorrectStreak = isCorrect ? gameState.correctStreak + 1 : 0;
    const newWrongStreak = isCorrect ? 0 : gameState.wrongStreak + 1;

    // Calculate level changes
    let newLevel = gameState.level;
    if (isCorrect && newCorrectStreak >= settings.correctStreakLimit) {
      newLevel = Math.min(gameState.level + 1, 6);
      updateGameStats({ level: newLevel }, "set");
    } else if (!isCorrect && newWrongStreak >= settings.wrongStreakLimit) {
      newLevel = Math.max(gameState.level - 1, 1);
      updateGameStats({ level: newLevel }, "set");
    }

    // Update game stats if correct answer
    if (isCorrect) {
      updateGameStats({
        totalCorrect: 1,
      });
    }

    // Update game state
    setGameState({
      ...gameState,
      level: newLevel,
      feedback: isCorrect ? "Good!" : "Wrong!",
      correctStreak: newCorrectStreak,
      wrongStreak: newWrongStreak,
    });

    setTimeout(startNewRound, settings.feedbackDuration);
  };

  useEffect(() => {
    startNewRound();
  }, []);

  // Update the renderItem function to be more responsive
  const renderItem = (item: string | number, isLast?: boolean) => {
    if (typeof item === "number") {
      return (
        <span
          aria-label={`Number ${item}`}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold"
        >
          {item}
        </span>
      );
    }

    return (
      <div
        className="flex flex-wrap gap-1 sm:gap-2 md:gap-3 justify-center"
        aria-label={`Icon group: ${item.split(",").join(" and ")}`}
      >
        {item.split(",").map((iconName, index) => {
          const IconComponent = ICONS[iconName as keyof typeof ICONS];
          // Add validation for invalid icon names
          if (!IconComponent) {
            console.warn(`Invalid icon name: ${iconName}`);
            return null;
          }
          return (
            <IconComponent
              key={index}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
              aria-hidden="true" // Since we're describing the icon group above
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      role="main"
      aria-label="Pattern Recognition Game"
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 select-none"
    >
      <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto">
        {gameState.currentPattern && (
          <>
            {/* Pattern Display Container */}
            <div
              role="region"
              aria-label="Pattern sequence display"
              className="flex justify-center mt-16 mb-4"
            >
              <motion.div
                role="group"
                aria-label="Current pattern sequence"
                className="border-4 border-yellow-500 py-2 rounded-lg w-full h-auto flex flex-wrap items-center justify-center relative"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    className="flex flex-wrap gap-16 items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {gameState.currentPattern.sequence.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.2 }}
                        className="text-yellow-500"
                        aria-label={`Pattern item ${index + 1}: ${
                          typeof item === "number" ? item : "icon group"
                        }`}
                      >
                        {renderItem(
                          item,
                          Number(gameState?.currentPattern?.sequence?.length) -
                            1 ===
                            index
                        )}
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: gameState.currentPattern.sequence.length * 0.2,
                      }}
                      className="text-3xl font-bold text-yellow-500"
                    >
                      ?
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Options Grid */}
            <div
              role="group"
              aria-label="Answer options"
              className="grid grid-cols-2 gap-3 lg:gap-4"
            >
              {gameState.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={ () =>
                  {
                    if (!canClick) return;
                    handleAnswer(option);
                  }}
                  className={`${bgColor} flex items-center p-4 lg:p-6 justify-center text-center rounded-md text-neutral-800 dark:text-neutral-200
                hover:bg-yellow-600 transition-colors min-h-[80px] lg:min-h-[100px]`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={gameState.isTransitioning}
                  aria-label={`Select option ${
                    typeof option === "number" ? option : "with icons"
                  }`}
                >
                  {renderItem(option)}
                </motion.button>
              ))}
            </div>
          </>
        )}

        {/* Feedback */}
        {gameState.feedback && (
          <motion.div
            role="alert"
            aria-live="assertive"
            className="fixed top-8 left-0 right-0 text-neutral-800 dark:text-neutral-200 text-2xl md:text-6xl font-bold text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 40 }}
          >
            {gameState.feedback}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PatternsGame;
