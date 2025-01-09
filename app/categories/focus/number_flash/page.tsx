"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import {
  FlashingNumbersQuestion,
  bgColor,
  getGameSettings,
  generateSequence,
  generateOptions,
} from "./testTypeData";

const FlashingNumbersGame = () => {
  const { updateGameStats, gameSession, categoryIndex } = useGame();
  const [feedback, setFeedback] = useState<string>("");
  const [level, setLevel] = useState(
    gameSession?.[categoryIndex]?.test?.level || 1
  );
  const [canClick, setCanClick] = useState(true);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [question, setQuestion] = useState<FlashingNumbersQuestion>({
    sequence: [],
    options: [],
    correctOptionIndex: 0,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0);
  const [lastCorrectIndex, setLastCorrectIndex] = useState<number | undefined>(
    undefined
  );


  // Generate a new question
  const generateQuestion = (): void =>
  {
    setCanClick( true );
    const settings = getGameSettings(level);
    const sequence = generateSequence(settings.sequenceLength);
    const { options, correctOptionIndex } = generateOptions(
      sequence,
      settings,
      lastCorrectIndex
    );

    setKey((prev) => prev + 1);
    setQuestion({
      sequence,
      options,
      correctOptionIndex,
    });
    updateGameStats({ totalQuestions: 1 });
    setLastCorrectIndex(correctOptionIndex);
    setCurrentIndex(0);
  };

  // Handle user's choice
  const handleChoice = ( optionIndex: number ): void =>
  {
    if ( !canClick ) return;
    setCanClick( false );
    const settings = getGameSettings(level);
    const isCorrect = optionIndex === question.correctOptionIndex;

    if (isCorrect) {
      const points = settings.basePoints * settings.levelMultiplier;
      updateGameStats({ totalCorrect: 1 });
      setFeedback("Good!");
      setCorrectStreak((prev) => prev + 1);
      setWrongStreak(0);

      if (correctStreak + 1 >= settings.correctStreakLimit) {
        updateGameStats(
          { level: Math.min(level + 1, settings.maxLevel) },
          "set"
        );
        setTimeout(() => {
          setFeedback("");
          setLevel((prev) => Math.min(prev + 1, settings.maxLevel));
          setCorrectStreak(0);
          generateQuestion();
        }, 1000);
      } else {
        setTimeout(() => {
          setFeedback("");
          generateQuestion();
        }, 1500);
      }
    } else {
      setFeedback("Wrong!");
      setWrongStreak((prev) => prev + 1);
      setCorrectStreak(0);

      if (
        wrongStreak + 1 >= settings.wrongStreakLimit &&
        level > settings.minLevel
      )
      {
        updateGameStats(
          { level: Math.max(level - 1, settings.minLevel) },
          "set"
        );
        setTimeout(() => {
          setFeedback("");
          setLevel((prev) => Math.max(prev - 1, settings.minLevel));
          setWrongStreak(0);
          generateQuestion();
        }, 1000);
      } else {
        setTimeout(() => {
          setFeedback("");
          generateQuestion();
        }, 1500);
      }
    }
  };

  // Initialize first question
  useEffect(() => {
    generateQuestion();
  }, []);

  // Cycle through the sequence
  useEffect(() => {
    const settings = getGameSettings(level);
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % question.sequence.length);
    }, settings.displayTime);
    return () => clearInterval(interval);
  }, [question.sequence.length, level]);

  return (
    <div
      aria-label="Flashing Numbers Memory Game"
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 select-none mt-16"
    >
      <div
        aria-label="Number display area"
        className="flex flex-col gap-4 w-full max-w-2xl mx-auto"
      >
        {/* Flashing Sequence */}
        <div className="flex justify-center mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              aria-live="polite"
              aria-label={`Current number: ${question.sequence[currentIndex]}`}
              key={key}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              className="border-4 border-green-500 rounded-lg w-64 h-32 flex items-center justify-center"
            >
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
                className="text-6xl font-bold text-green-500"
              >
                {question.sequence[currentIndex]}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Options */}
        <div
          aria-label="Answer options"
          role="group"
          className="grid grid-cols-2 gap-6"
        >
          {question.options.map(
            (option: string[] | number[], index: number) => (
              <motion.button
                key={`${key}-${index}`}
                onClick={ () =>
                {
                  if (!canClick) return;
                  handleChoice(index);
                }}
                onKeyDown={ ( e ) =>
                {
                  if (!canClick) return;
                  // Handle both Enter and Space key presses
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault(); // Prevent page scroll on space
                    handleChoice(index);
                  }
                }}
                aria-label={`Select sequence ${option.join(" ")}`}
                className={`${bgColor} px-3 md:px-4 py-3 md:py-4 text-lg md:text-2xl text-neutral-800 dark:text-neutral-200 rounded-md hover:opacity-90 transition-colors`}
                whileHover={{ scale: 1.02 }}
              >
                {option.join("  ")}
              </motion.button>
            )
          )}
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.div
            aria-live="assertive"
            role="alert"
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

export default FlashingNumbersGame;
