"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import {
  bgColor,
  IconOption,
  allIconOptions,
  getGameSettings,
  getDifficultySettings,
} from "./testTypeData";

const IconSequenceGame: React.FC = () => {
  const { updateGameStats, gameSession, categoryIndex } = useGame();
  const [feedback, setFeedback] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSequence, setCurrentSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [level, setLevel] = useState(
    gameSession?.[categoryIndex]?.test?.level || 1
  );
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeIcons, setActiveIcons] = useState<IconOption[]>([]);

  // Modified handleLevelChange to use game settings
  const handleLevelChange = (isCorrect: boolean) => {
    const settings = getGameSettings(level);

    if (isCorrect) {
      setCorrectStreak((prev) => prev + 1);
      setWrongStreak(0);

      // Level up on reaching correctStreakLimit
      if (correctStreak + 1 >= settings.correctStreakLimit) {
        if (level < settings.maxLevel) {
          updateGameStats({ level: level + 1 }, "set");
          setLevel((prev) => prev + 1);
          setCorrectStreak(0);
        }
      }
    } else {
      setWrongStreak((prev) => prev + 1);
      setCorrectStreak(0);

      // Level down on reaching wrongStreakLimit
      if (
        wrongStreak + 1 >= settings.wrongStreakLimit &&
        level > settings.minLevel
      ) {
        updateGameStats({ level: level - 1 }, "set");
        setLevel((prev) => prev - 1);
        setWrongStreak(0);
      }
    }
  };

  // Start new sequence with transition handling
  const startSequence = () => {
    setIsTransitioning(true);
    const settings = getDifficultySettings(level);

    // Update active icons
    setActiveIcons(settings.activeIcons);

    setTimeout(() => {
      setCurrentSequence(settings.pattern);
      setUserSequence([]);
      setDisplayIndex(0);
      setIsPlaying(true);
      setIsTransitioning(false);

      let index = 0;
      const interval = setInterval(() => {
        if (index >= settings.pattern.length) {
          clearInterval(interval);
          setIsPlaying(false);
          setDisplayIndex(-1);
          return;
        }
        setDisplayIndex(index);
        index++;
      }, settings.displayInterval);
    }, 300);
  };

  // Handle icon click with immediate feedback
  // Modified handleIconClick with new scoring system
  const handleIconClick = (iconId: string) => {
    if (isPlaying || isTransitioning) return;

    const settings = getGameSettings(level);

    if (iconId !== currentSequence[userSequence.length]) {
      updateGameStats({ totalQuestions: 1 });
      setFeedback("Wrong!");
      handleLevelChange(false);

      setTimeout(() => {
        setFeedback("");
        startSequence();
      }, 1500);
      return;
    }

    const newUserSequence = [...userSequence, iconId];
    setUserSequence(newUserSequence);

    // If sequence completed successfully
    if (newUserSequence.length === currentSequence.length) {
      updateGameStats({ totalQuestions: 1 });
      setFeedback("Good!");
      // Calculate points based on settings
      const points = settings.basePoints * settings.levelMultiplier;
      updateGameStats({
        totalCorrect: 1,
      });
      handleLevelChange(true);

      setTimeout(() => {
        setFeedback("");
        startSequence();
      }, 1500);
    }
  };

  // Start first sequence
  useEffect(() => {
    startSequence();
  }, []);

  return (
    <div
      role="main"
      aria-label="Icon Sequence Memory Game"
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 select-none"
    >
      <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
        {/* Sequence Display and User Input Container */}
        <div
          role="region"
          aria-label="Sequence display area"
          className="flex justify-center mb-12"
        >
          <motion.div
            aria-live="polite"
            className="border-4 border-blue-500 rounded-lg w-full h-32 flex items-center justify-center relative"
          >
            {/* Sequence Display */}
            <AnimatePresence mode="wait">
              {displayIndex >= 0 && !isTransitioning && (
                <motion.div
                  key={`display-${displayIndex}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-blue-500 absolute"
                  aria-label={`Current icon: ${
                    allIconOptions(26).find(
                      (icon) => icon.id === currentSequence[displayIndex]
                    )?.id || ""
                  }`}
                >
                  {
                    allIconOptions(26).find(
                      (icon) => icon.id === currentSequence[displayIndex]
                    )?.icon
                  }
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Input Display */}
            {!isPlaying && !isTransitioning && (
              <div
                aria-label="Your sequence input"
                role="status"
                className="flex justify-center gap-2 absolute"
              >
                {userSequence.map((iconId, index) => (
                  <motion.div
                    key={`input-${index}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-blue-500"
                    aria-label={`Selected icon ${index + 1}: ${iconId}`}
                  >
                    {allIconOptions(18).find((icon) => icon.id === iconId)?.icon}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Icon Options */}
        <div className="grid grid-cols-4 gap-4">
          {activeIcons.map((option) => (
            <motion.button
              key={option.id}
              onClick={() => handleIconClick(option.id)}
              onKeyDown={(e) => {
                if (
                  (e.key === "Enter" || e.key === " ") &&
                  !isPlaying &&
                  !isTransitioning
                ) {
                  e.preventDefault();
                  handleIconClick(option.id);
                }
              }}
              className={`${bgColor} flex items-center p-2 justify-center text-center rounded-md text-neutral-800 dark:text-neutral-200 
                disabled:opacity-50`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isPlaying || isTransitioning}
              aria-label={`Select ${option.id} icon`}
              aria-disabled={isPlaying || isTransitioning}
            >
              {option.icon}
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

export default IconSequenceGame;
