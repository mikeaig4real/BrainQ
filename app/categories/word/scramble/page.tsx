"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import {
  bgColor,
  getGameSettings,
  getRandomWord,
  scrambleWord,
} from "./testTypeData";

const WordScrambleGame = () => {
  const { updateGameStats, gameSession, categoryIndex } = useGame();
  const [scrambledWord, setScrambledWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [ feedback, setFeedback ] = useState( "" );
  const [canClick, setCanClick] = useState(true);
  const [currentWord, setCurrentWord] = useState("");
  const [level, setLevel] = useState(
    gameSession?.[categoryIndex]?.test?.level || 1
  );
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [previousScrambled, setPreviousScrambled] = useState(""); // Add this state

  const inputRef = useRef<HTMLInputElement>(null);

  const handleLevelProgression = () => {
    const settings = getGameSettings(level);

    // Check if we should increase level
    if (
      correctStreak >= settings.correctStreakLimit &&
      level < settings.maxLevel
    ) {
      updateGameStats({ level: level + 1 }, "set");
      setLevel((prev) => prev + 1);
      setCorrectStreak(0);
      setWrongStreak(0);
      return true;
    }

    // Check if we should decrease level
    if (wrongStreak >= settings.wrongStreakLimit && level > settings.minLevel) {
      updateGameStats({ level: level - 1 }, "set");
      setLevel((prev) => prev - 1);
      setCorrectStreak(0);
      setWrongStreak(0);
      return true;
    }

    return false;
  };

  const generateNewWord = () =>
  {
    setCanClick( true );
    const newWord = getRandomWord(level);
    setCurrentWord(newWord);

    let scrambled = scrambleWord(newWord);

    // Keep generating new scrambled versions until we get one that's
    // different from both the original word and the previous scrambled version
    while (scrambled === newWord || scrambled === previousScrambled) {
      scrambled = scrambleWord(newWord);
    }

    setPreviousScrambled(scrambled);
    setScrambledWord(scrambled);
    setUserInput("");
    updateGameStats({ totalQuestions: 1 });
    // focus on input so user can type without clicking on input
    inputRef.current && inputRef.current.focus();
  };

  // Initialize game
  useEffect(() => {
    generateNewWord();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value.toLowerCase());
  };

  // Handle submission
  const handleSubmit = () =>
  {
    if ( !canClick ) return;
    setCanClick( false );
    const isCorrect = userInput.replace(/\s+/g, "") === currentWord;

    if (isCorrect) {
      updateGameStats({
        totalCorrect: 1,
      });
      setFeedback("Good!");
      setCorrectStreak((prev) => prev + 1);
      setWrongStreak(0);
    } else {
      setFeedback("Wrong!");
      setWrongStreak((prev) => prev + 1);
      setCorrectStreak(0);
    }

    // Check for level changes
    handleLevelProgression();

    setTimeout(() => {
      setFeedback("");
      generateNewWord();
      setUserInput("");
    }, 1500);
  };

  return (
    <div
      role="region"
      aria-label="Word Scramble Game"
      className="flex flex-col items-center justify-center min-h-screen md:p-8 select-none"
    >
      <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
        {/* Scrambled Word Display */}
        <motion.div
          role="region"
          aria-label="Scrambled word to unscramble"
          key={scrambledWord}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="flex justify-center mb-12"
        >
          <div
            aria-live="polite"
            className="border-4 border-orange-500 rounded-lg w-full py-8 flex items-center justify-center"
          >
            <div
              aria-label={`Unscramble this word: ${scrambledWord}`}
              className="text-4xl font-bold text-orange-500 tracking-wider"
            >
              {scrambledWord}
            </div>
          </div>
        </motion.div>

        {/* Input Field */}
        <div
          role="form"
          aria-label="Word submission form"
          className="flex flex-col md:flex-row gap-4 w-full px-4 sm:px-0"
        >
          <motion.input
            type="text"
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 text-lg sm:text-2xl rounded-md border-2 border-orange-500 
             focus:outline-none focus:border-orange-600"
            placeholder="Type your answer..."
            whileFocus={{ scale: 1.02 }}
            aria-label="Enter your answer"
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          />
          <motion.button
            onClick={ () =>
            {
              if (!canClick) return;
              handleSubmit();
            }}
            aria-label="Submit your answer"
            className={`${bgColor} w-full sm:w-auto px-6 sm:px-4 py-3 sm:py-4 text-lg sm:text-2xl text-neutral-800 dark:text-neutral-200 rounded-md`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit
          </motion.button>
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.div
            role="alert"
            aria-live="assertive"
            className="fixed top-8 left-0 right-0 text-neutral-800 dark:text-neutral-200 text-2xl md:text-6xl font-bold text-center"
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

export default WordScrambleGame;
