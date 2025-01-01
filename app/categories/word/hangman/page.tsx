"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import {
  wordCategories,
  GameSettings,
  GameState,
  getGameSettings,
  getDifficulty,
} from "./testTypeData";

const HangmanGame = () => {
  const { updateGameStats, gameSession, categoryIndex } = useGame();
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialSettings = getGameSettings(1);
    return {
      lives: initialSettings.lives,
      totalLives: initialSettings.lives,
      selectedWord: "",
      currentCategory: "",
      guessedLetters: [],
      feedback: "",
      level: gameSession?.[categoryIndex]?.test?.level || 1,
      correctStreak: 0,
      wrongStreak: 0,
      usedWords: new Set(),
      gameInitialized: false,
      isWordComplete: false,
      remainingHints: initialSettings.hintCount,
      revealedHints: [],
    };
  });

  const settings = getGameSettings(gameState.level);

  useEffect(() => {
    if (gameState.selectedWord && gameState.guessedLetters.length > 0) {
      const complete = gameState.selectedWord
        .split("")
        .every((letter) => gameState.guessedLetters.includes(letter));
      setGameState((prev) => ({ ...prev, isWordComplete: complete }));
    }
  }, [gameState.guessedLetters, gameState.selectedWord]);

  const handleHint = () => {
    if (gameState.remainingHints <= 0 || gameState.isWordComplete) return;

    const unguessedIndices = gameState.selectedWord
      .split("")
      .map((letter, index) =>
        !gameState.guessedLetters.includes(letter) ? index : -1
      )
      .filter(
        (index) => index !== -1 && !gameState.revealedHints.includes(index)
      );

    if (unguessedIndices.length === 0) return;

    const randomIndex =
      unguessedIndices[Math.floor(Math.random() * unguessedIndices.length)];
    const letterToReveal = gameState.selectedWord[randomIndex];

    setGameState((prev) => ({
      ...prev,
      guessedLetters: !prev.guessedLetters.includes(letterToReveal)
        ? [...prev.guessedLetters, letterToReveal]
        : prev.guessedLetters,
      revealedHints: [...prev.revealedHints, randomIndex],
      remainingHints: prev.remainingHints - 1,
    }));
  };

  const setRandomWord = () => {
    const categories = Object.keys(wordCategories);
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const difficulty = getDifficulty(gameState.level);
    const currentSettings = getGameSettings(gameState.level);

    const availableWords = wordCategories[
      randomCategory as keyof typeof wordCategories
    ][difficulty].filter((word) => !gameState.usedWords.has(word));

    updateGameStats({ totalQuestions: 1 });

    if (availableWords.length === 0) {
      setGameState((prev) => ({ ...prev, usedWords: new Set() }));
      setRandomWord();
      return;
    }

    const randomWord =
      availableWords[Math.floor(Math.random() * availableWords.length)];

    setGameState((prev) => ({
      ...prev,
      selectedWord: randomWord,
      currentCategory: randomCategory,
      guessedLetters: [],
      lives: currentSettings.lives,
      totalLives: currentSettings.lives,
      feedback: "",
      isWordComplete: false,
      usedWords: new Set([...prev.usedWords, randomWord]),
      gameInitialized: true,
      remainingHints: currentSettings.hintCount,
      revealedHints: [],
    }));
  };

  const handleGuess = (letter: string) => {
    if (
      gameState.guessedLetters.includes(letter) ||
      gameState.lives <= 0 ||
      gameState.isWordComplete
    ) {
      return;
    }

    setGameState((prev) => {
      const newState = { ...prev };
      newState.guessedLetters = [...prev.guessedLetters, letter];

      if (!prev.selectedWord.includes(letter)) {
        newState.lives = prev.lives - 1;
        newState.feedback = "Wrong Guess!";
      } else {
        newState.feedback = "Good Guess!";
      }

      return newState;
    });

    setTimeout(() => {
      setGameState((prev) => ({ ...prev, feedback: "" }));
    }, 1000);
  };

  useEffect(() => {
    if (!gameState.gameInitialized) {
      setRandomWord();
    }
  }, []);

  useEffect(() => {
    if (gameState.isWordComplete) {
      const points = settings.basePoints * settings.levelMultiplier;
      updateGameStats({
        totalCorrect: 1,
      });
      setGameState((prev) => ({
        ...prev,
        feedback: "Good!",
        correctStreak: prev.correctStreak + 1,
        wrongStreak: 0,
      }));

      if (gameState.correctStreak + 1 >= settings.correctStreakLimit) {
        if (gameState.level < settings.maxLevel) {
          updateGameStats({ level: gameState.level + 1 }, "set");
          setGameState((prev) => ({
            ...prev,
            level: prev.level + 1,
            correctStreak: 0,
          }));
        }
      }

      setTimeout(() => {
        setGameState((prev) => ({ ...prev, feedback: "" }));
        setRandomWord();
      }, 1000);
    } else if (gameState.lives <= 0) {
      setGameState((prev) => ({
        ...prev,
        feedback: "Wrong!",
        wrongStreak: prev.wrongStreak + 1,
        correctStreak: 0,
      }));

      if (gameState.wrongStreak + 1 >= settings.wrongStreakLimit) {
        if (gameState.level > settings.minLevel) {
          updateGameStats({ level: gameState.level - 1 }, "set");
          setGameState((prev) => ({
            ...prev,
            level: prev.level - 1,
            wrongStreak: 0,
          }));
        }
      }

      setTimeout(() => {
        setGameState((prev) => ({ ...prev, feedback: "" }));
        setRandomWord();
      }, 1000);
    }
  }, [gameState.isWordComplete, gameState.lives]);

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  // Hangman drawing components
  const HangmanDrawing = ({
    remainingLives,
    totalLives,
  }: {
    remainingLives: number;
    totalLives: number;
  }) => {
    const wrongGuesses = Math.max(totalLives - remainingLives, 0);
    const parts = [
      // Base
      <line
        key="base"
        x1="20"
        y1="140"
        x2="100"
        y2="140"
        stroke="red"
        strokeWidth="4"
      />,
      // Vertical pole
      <line
        key="pole"
        x1="60"
        y1="20"
        x2="60"
        y2="140"
        stroke="red"
        strokeWidth="4"
      />,
      // Top beam
      <line
        key="beam"
        x1="60"
        y1="20"
        x2="120"
        y2="20"
        stroke="red"
        strokeWidth="4"
      />,
      // Rope
      <line
        key="rope"
        x1="120"
        y1="20"
        x2="120"
        y2="40"
        stroke="red"
        strokeWidth="4"
      />,
      // Head
      <circle
        key="head"
        cx="120"
        cy="50"
        r="10"
        stroke="red"
        strokeWidth="4"
        fill="none"
      />,
      // Body
      <line
        key="body"
        x1="120"
        y1="60"
        x2="120"
        y2="90"
        stroke="red"
        strokeWidth="4"
      />,
      // Left arm
      <line
        key="leftArm"
        x1="120"
        y1="70"
        x2="100"
        y2="80"
        stroke="red"
        strokeWidth="4"
      />,
      // Right arm
      <line
        key="rightArm"
        x1="120"
        y1="70"
        x2="140"
        y2="80"
        stroke="red"
        strokeWidth="4"
      />,
      // Left leg
      <line
        key="leftLeg"
        x1="120"
        y1="90"
        x2="100"
        y2="110"
        stroke="red"
        strokeWidth="4"
      />,
      // Right leg
      <line
        key="rightLeg"
        x1="120"
        y1="90"
        x2="140"
        y2="110"
        stroke="red"
        strokeWidth="4"
      />,
    ];

    return (
      <svg
        role="img"
        aria-label={`Hangman drawing. ${remainingLives} lives remaining out of ${totalLives}`}
        width="160"
        height="160"
      >
        {remainingLives === 0 ? parts : parts.slice(0, wrongGuesses)}
      </svg>
    );
  };

  return (
    <div
      role="region"
      aria-label="Hangman game"
      className="flex flex-col items-center gap-4 mt-16"
    >
      {/* Game Header */}
      <div role="status" aria-live="polite" className="text-center relative">
        <p
          aria-label={`Lives remaining: ${gameState.lives}`}
          className="text-lg text-orange-500"
        >
          Lives : {gameState.lives}
        </p>
        <p
          aria-label={`Current category: ${gameState.currentCategory}`}
          className="text-lg text-orange-500"
        >
          Category: {gameState.currentCategory}
        </p>
        <button
          onClick={handleHint}
          disabled={gameState.remainingHints <= 0 || gameState.isWordComplete}
          aria-label={`Use hint. ${gameState.remainingHints} hints remaining`}
          className="bg-orange-500 hover:bg-orange-600 text-neutral-800 dark:text-neutral-200 px-2 py-1 text-sm rounded-sm absolute left-0 bottom-[-2rem]"
        >
          Use Hint ({gameState.remainingHints})
        </button>
      </div>

      {/* Hangman Drawing */}
      <div className="flex flex-col items-center">
        <HangmanDrawing
          remainingLives={gameState.lives}
          totalLives={gameState.totalLives}
        />

        {/* Word Display */}
        <div className="flex justify-center gap-2 text-2xl font-mono mt-4">
          {gameState.selectedWord.split("").map((letter, index) => (
            <span
              key={index}
              aria-label="Word to guess"
              className="w-8 h-8 flex items-center justify-center border-b-2 border-gray-400"
            >
              {gameState.guessedLetters.includes(letter) ? letter : "_"}
            </span>
          ))}
        </div>
      </div>

      {/* Keyboard */}
      <div className="grid grid-cols-7 gap-4">
        {alphabet.map((letter) => (
          <motion.button
            key={letter}
            onClick={() => handleGuess(letter)}
            className={`sm:px-4 sm:py-2 p-2  text-neutral-800 dark:text-neutral-200 rounded-md ${
              gameState.guessedLetters.includes(letter)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
            disabled={gameState.guessedLetters.includes(letter)}
            whileHover={{ scale: 1.1 }}
            aria-label={`Guess letter ${letter}${
              gameState.guessedLetters.includes(letter)
                ? ", already guessed"
                : ""
            }`}
            aria-pressed={gameState.guessedLetters.includes(letter)}
          >
            {letter.toUpperCase()}
          </motion.button>
        ))}
      </div>

      {/* Feedback - adjust text size based on screen size */}
      {gameState.feedback && (
        <motion.div
          className="fixed top-4 sm:top-6 md:top-8 left-0 right-0 text-neutral-800 dark:text-neutral-200 text-xl sm:text-3xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 40 }}
          role="alert"
          aria-live="polite"
        >
          {gameState.feedback}
        </motion.div>
      )}
    </div>
  );
};

export default HangmanGame;
