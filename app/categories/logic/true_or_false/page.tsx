"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import {
  Question,
  advancedQuestionTemplates,
  getGameSettings,
  getDifficultyFromLevel,
} from "./testTypeData";

const TrueOrFalseGame = () => {
  const { updateGameStats, gameSession, categoryIndex } = useGame();
  const [ feedback, setFeedback ] = useState<string>( "" );
  const [canClick, setCanClick] = useState( true );
  const [level, setLevel] = useState(
    gameSession?.[categoryIndex]?.test?.level || 1
  );
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [question, setQuestion] = useState<Question>({
    statements: [],
    finalStatement: "",
    isCorrect: false,
  });
  const [ usedQuestions, setUsedQuestions ] = useState<Set<number>>( new Set() );
  const divRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    if (divRef.current) {
      divRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };


  const generateQuestion = useCallback((): void => {
    setCanClick(true);
    const difficulty = getDifficultyFromLevel(level);
    const questions = advancedQuestionTemplates[difficulty];

    // Filter out questions that have been used
    const availableIndices = Array.from(Array(questions.length).keys()).filter(
      (index) => !usedQuestions.has(index)
    );

    // If all questions have been used, reset the used questions
    if (availableIndices.length === 0) {
      setUsedQuestions(new Set());
      const randomIndex = Math.floor(Math.random() * questions.length);
      const randomQuestion = questions[randomIndex];
      setUsedQuestions(new Set([randomIndex]));
      setQuestion(randomQuestion);
      updateGameStats({ totalQuestions: 1 });
      return;
    }

    // Select a random question from unused questions
    const randomIndex =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];
    const randomQuestion = questions[randomIndex];

    // Add the used question to the set
    setUsedQuestions((prev) => new Set([...prev, randomIndex]));
    setQuestion(randomQuestion);
    updateGameStats( { totalQuestions: 1 } );
    scrollToTop();
  }, [level, usedQuestions]);

  // Reset used questions and generate new question when level changes
  useEffect(() => {
    setUsedQuestions(new Set());
    generateQuestion();
  }, [level]); // Only depend on level changes

  const handleChoice = (choice: boolean): void => {
    if (!canClick) return; // Prevent multiple clicks
    setCanClick(false); // Disable clicks immediately after
    const settings = getGameSettings(level);
    const isCorrect = choice === question.isCorrect;

    if (isCorrect) {
      const points = settings.basePoints * settings.levelMultiplier;
      updateGameStats({
        totalCorrect: 1,
      });
      setCorrectStreak((prev) => prev + 1);
      setWrongStreak(0);
      setFeedback("Good!");

      if (correctStreak + 1 >= settings.correctStreakLimit) {
        updateGameStats(
          { level: Math.min(level + 1, settings.maxLevel) },
          "set"
        );
        setTimeout(() => {
          setFeedback(""); // Clear feedback before level change
          setLevel((prev) => Math.min(prev + 1, settings.maxLevel));
          setCorrectStreak(0);
        }, 1000);
      } else {
        // Only generate new question if not leveling up
        setTimeout(() => {
          setFeedback("");
          generateQuestion();
        }, 1500);
      }
    } else {
      setWrongStreak((prev) => prev + 1);
      setCorrectStreak(0);
      setFeedback("Wrong!");

      if (
        wrongStreak + 1 >= settings.wrongStreakLimit &&
        level > settings.minLevel
      ) {
        updateGameStats(
          { level: Math.max(level - 1, settings.minLevel) },
          "set"
        );
        setTimeout(() => {
          setFeedback(""); // Clear feedback before level change
          setLevel((prev) => Math.max(prev - 1, settings.minLevel));
          setWrongStreak(0);
        }, 1000);
      } else {
        // Only generate new question if not leveling down
        setTimeout(() => {
          setFeedback("");
          generateQuestion();
        }, 1500);
      }
    }
  };

  // Keep the exact same return/JSX from the highlighted code
  return (
    <div
      role="main"
      aria-label="True or False Logic Game"
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 select-none mt-16"
    >
      {/* Statements Container */}
      <div
        role="region"
        aria-label="Game premises"
        className="flex flex-col gap-4 w-full max-w-2xl mx-auto"
      >
        {/* Statements */}
        <div
          role="list"
          aria-label="Logical statements"
          className="flex flex-col gap-4 text-base sm:text-xl md:text-2xl text-center font-bold"
        >
          <div
            ref={divRef}
            className="bg-black max-h-[30vh] p-1 overflow-hidden overflow-y-scroll rounded-sm">
            {question.statements.map((statement, index) => (
              <motion.p
                role="listitem"
                key={index}
                className="text-yellow-500 px-2 py-1 break-words"
                whileHover={{ scale: 1.02 }}
              >
                {statement}
              </motion.p>
            ))}
          </div>

          {/* Final Statement */}
          <motion.p
            className="text-neutral-800 dark:text-neutral-200 font-semibold my-4 md:my-6 text-lg sm:text-2xl md:text-3xl bg-yellow-800 py-2 px-4 rounded-md break-words"
            whileHover={{ scale: 1.02 }}
          >
            Therefore: {question.finalStatement}... ?
          </motion.p>
        </div>

        {/* Choices */}
        <div
          role="group"
          aria-label="Answer options"
          className="flex gap-4 md:gap-8 justify-center mt-4"
        >
          <button
            className="bg-yellow-500 px-4 md:px-6 py-2 md:py-3 text-base md:text-xl text-black rounded-md hover:bg-yellow-400 transition-colors"
            onClick={() => {
              if (!canClick) return;
              handleChoice(true);
            }}
            aria-label="Select True"
            aria-pressed="false"
          >
            True
          </button>
          <button
            className="bg-black px-4 md:px-6 py-2 md:py-3 text-base md:text-xl text-neutral-800 dark:text-neutral-200 rounded-md border-yellow-500 border hover:bg-gray-900 transition-colors"
            onClick={() => {
              if (!canClick) return;
              handleChoice(false);
            }}
            aria-label="Select False"
            aria-pressed="false"
          >
            False
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.div
            role="alert"
            aria-live="assertive"
            className="fixed top-8 left-0 right-0 text-neutral-800 dark:text-neutral-200 text-2xl md:text-6xl font-bold text-center"
            initial={{ opacity: 0, y: -20 }} // Changed from y: 20 to y: -20
            animate={{ opacity: 1, y: 40 }}
          >
            {feedback}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrueOrFalseGame;
