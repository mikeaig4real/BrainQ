"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiRat as FaRat } from "react-icons/gi";
import { useGame } from "@/contexts/GameContext";
import { Mole, GameSettings, getGameSettings } from "./testTypeData";   

const WhackAMoleGame: React.FC = () => {
  const { updateGameStats, gameSession, categoryIndex } = useGame();
  const [level, setLevel] = useState<number>(
    gameSession?.[categoryIndex]?.test?.level || 1
  );
  const [moles, setMoles] = useState<Mole[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [missCount, setMissCount] = useState<number>(0);
  const [correctStreak, setCorrectStreak] = useState<number>(0);
  const [wrongStreak, setWrongStreak] = useState<number>(0);

  const settings = getGameSettings(level);

  // Initialize moles
  useEffect(() => {
    const initialMoles: Mole[] = Array.from(
      { length: settings.gridSize * settings.gridSize },
      (_, index) => ({ id: index, isVisible: false })
    );
    setMoles(initialMoles);
  }, [settings.gridSize]);

  // Mole visibility control
  useEffect(() => {
    const moleInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * moles.length);
      const updatedMoles = moles.map((mole, index) => ({
        ...mole,
        isVisible: index === randomIndex,
      }));
      setMoles(updatedMoles);
    }, settings.showDuration);

    return () => clearInterval(moleInterval);
  }, [moles, settings.showDuration]);

  const handleWhack = (index: number) => {
    updateGameStats({ totalQuestions: 1 });
    if (moles[index].isVisible) {
      updateGameStats({
        totalCorrect: 1,
      });
      const updatedMoles = moles.map((mole, i) =>
        i === index ? { ...mole, isVisible: false } : mole
      );
      setMoles(updatedMoles);
      setFeedback("Hit!");
      setCorrectStreak((prev) => prev + 1); // Increment correct streak
      setWrongStreak(0); // Reset wrong streak
    } else {
      setMissCount((prev) => prev + 1);
      setFeedback("Miss!");
      setWrongStreak((prev) => prev + 1); // Increment wrong streak
      setCorrectStreak(0); // Reset correct streak
    }

    // Level up based on streak limits
    if (
      correctStreak + 1 >= settings.correctStreakLimit &&
      level < settings.maxLevel
    ) {
      updateGameStats({ level: level + 1 }, "set");
      setLevel((prev) => prev + 1);
      setCorrectStreak(0); // Reset correct streak after level up
    }

    // Level down based on wrong streak limits
    if (
      wrongStreak + 1 >= settings.wrongStreakLimit &&
      level > settings.minLevel
    ) {
      updateGameStats({ level: level - 1 }, "set");
      setLevel((prev) => prev - 1);
      setWrongStreak(0); // Reset wrong streak after level down
    }

    // Clear feedback after a short time
    setTimeout(() => setFeedback(""), 1000);
  };

  return (
    <div
      role="region"
      aria-label="Whack-a-mole game board"
      className="flex flex-col items-center gap-4 mt-16"
    >
      {/* Game Grid */}
      <div
        className="grid gap-2 mb-4"
        style={{
          gridTemplateColumns: `repeat(${settings.gridSize}, minmax(0, 1fr))`,
        }}
        role="grid"
        aria-label="Whack-a-mole grid"
      >
        {moles.map((mole, index) => (
          <motion.button
            key={mole.id}
            className="bg-purple-500 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded flex items-center justify-center"
            onClick={() => handleWhack(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={mole.isVisible ? "Active mole target" : "Empty hole"}
            aria-pressed={mole.isVisible}
          >
            <AnimatePresence>
              {mole.isVisible && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaRat className="text-neutral-800 dark:text-neutral-200 text-4xl" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <motion.div
          className="fixed top-8 left-0 right-0 text-neutral-800 dark:text-neutral-200 text-2xl md:text-6xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 40 }}
          exit={{ opacity: 0 }}
          role="alert"
          aria-live="polite"
        >
          {feedback}
        </motion.div>
      )}
    </div>
  );
};

export default WhackAMoleGame;
