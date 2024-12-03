"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaStar,
  FaCircle,
  FaSquare,
  FaCross,
  FaMoon,
  FaSun,
  FaCloud,
} from "react-icons/fa";

const bgColor = "bg-blue-500";

interface IconOption {
  id: string;
  icon: React.ReactNode;
}

interface Sequence {
  pattern: string[];
  displayDuration: number;
  displayInterval: number;
  activeIcons: IconOption[];
}

  // All available icons
  const allIconOptions: IconOption[] = [
    { id: "heart", icon: <FaHeart size={32} /> },
    { id: "star", icon: <FaStar size={32} /> },
    { id: "circle", icon: <FaCircle size={32} /> },
    { id: "square", icon: <FaSquare size={32} /> },
    { id: "cross", icon: <FaCross size={32} /> },
    { id: "moon", icon: <FaMoon size={32} /> },
    { id: "sun", icon: <FaSun size={32} /> },
    { id: "cloud", icon: <FaCloud size={32} /> },
  ];

const getGameSettings = (level: number) => {
  return {
    correctStreakLimit: 3, // Number of correct sequences needed to level up
    wrongStreakLimit: 2, // Number of wrong attempts before level down
    basePoints: 1, // Base points for each correct sequence
    levelMultiplier: level,
    maxLevel: 6, // Maximum achievable level
    minLevel: 1,
    // Sequence gets longer and faster with level
    sequenceLength: Math.min(4 + Math.floor(level / 2), 8),
    displayDuration: Math.max(1000 - level * 50, 400), // Time each icon is shown
    displayInterval: Math.max(1500 - level * 75, 600), // Time between icons
    // Number of icons increases with level
    numIcons: Math.min(2 + Math.floor(level / 2), allIconOptions.length),
  };
};


const IconSequenceGame: React.FC = () => {
  const [feedback, setFeedback] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSequence, setCurrentSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeIcons, setActiveIcons] = useState<IconOption[]>([]);

  // Modified getDifficultySettings to use game settings
  const getDifficultySettings = (level: number): Sequence => {
    const settings = getGameSettings(level);
    const currentIcons = allIconOptions.slice(0, settings.numIcons);

    return {
      pattern: generatePattern(
        settings.sequenceLength,
        currentIcons.map((icon) => icon.id)
      ),
      displayDuration: settings.displayDuration,
      displayInterval: settings.displayInterval,
      activeIcons: currentIcons,
    };
  };

  // Generate random pattern
  const generatePattern = (
    length: number,
    availableIds: string[]
  ): string[] => {
    return Array.from(
      { length },
      () => availableIds[Math.floor(Math.random() * availableIds.length)]
    );
  };

  // Modified handleLevelChange to use game settings
  const handleLevelChange = (isCorrect: boolean) => {
    const settings = getGameSettings(level);

    if (isCorrect) {
      setCorrectStreak((prev) => prev + 1);
      setWrongStreak(0);

      // Level up on reaching correctStreakLimit
      if (correctStreak + 1 >= settings.correctStreakLimit) {
        if (level < settings.maxLevel) {
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
      setFeedback("Good!");
      // Calculate points based on settings
      const points = settings.basePoints * settings.levelMultiplier;
      setScore((prev) => prev + points);
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 select-none">
      <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">

        {/* Sequence Display and User Input Container */}
        <div className="flex justify-center mb-12">
          <motion.div className="border-4 border-blue-500 rounded-lg w-full h-32 flex items-center justify-center relative">
            {/* Sequence Display */}
            <AnimatePresence mode="wait">
              {displayIndex >= 0 && !isTransitioning && (
                <motion.div
                  key={`display-${displayIndex}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-blue-500 absolute"
                >
                  {
                    allIconOptions.find(
                      (icon) => icon.id === currentSequence[displayIndex]
                    )?.icon
                  }
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Input Display */}
            {!isPlaying && !isTransitioning && (
              <div className="flex justify-center gap-2 absolute">
                {userSequence.map((iconId, index) => (
                  <motion.div
                    key={`input-${index}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-blue-500"
                  >
                    {allIconOptions.find((icon) => icon.id === iconId)?.icon}
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
              className={`${bgColor} flex items-center p-2 justify-center text-center rounded-md text-white 
                disabled:opacity-50`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isPlaying || isTransitioning}
            >
              {option.icon}
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

export default IconSequenceGame;
