"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import {
  BouncingBallsQuestion,
  bgColor,
  getGameSettings,
  generateBalls,
  generateOptions,
} from "./testTypeData";

const BouncingBallsGame = () => {
  const { updateGameStats, gameSession, categoryIndex } = useGame();
  const [ feedback, setFeedback ] = useState<string>( "" );
  const [canClick, setCanClick] = useState(true);
  const [level, setLevel] = useState(
    gameSession?.[categoryIndex]?.test?.level || 1
  );
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [question, setQuestion] = useState<BouncingBallsQuestion>({
    balls: [],
    options: [],
    correctOptionIndex: 0,
  });
  const [key, setKey] = useState(0);
  const [lastCorrectIndex, setLastCorrectIndex] = useState<number | undefined>(
    undefined
  );

  const generateQuestion = (): void =>
  {
    setCanClick( true );
    const settings = getGameSettings(level);
    const balls = generateBalls(settings);
    const { options, correctOptionIndex } = generateOptions(
      balls,
      settings,
      lastCorrectIndex
    );
    setKey((prev) => prev + 1);
    setQuestion({
      balls,
      options,
      correctOptionIndex,
    });
    updateGameStats({ totalQuestions: 1 });
    setLastCorrectIndex(correctOptionIndex);
  };

  // Replace the handleChoice function with this corrected version
  const handleChoice = ( optionIndex: number ): void =>
  {
    if ( !canClick ) return;
    setCanClick( false );
    const settings = getGameSettings(level);
    const selectedBallId = question.options[optionIndex];

    // Find the ball that bounces the highest
    const highestBall = question.balls.reduce((prev, current) =>
      current.maxHeight > prev.maxHeight ? current : prev
    );

    const isCorrect = selectedBallId === highestBall.id;

    if (isCorrect) {
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
      ) {
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

  useEffect(() => {
    generateQuestion();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-12 lg:px-16 select-none mt-8 sm:mt-12 md:mt-16">
      <div className="flex flex-col gap-2 lg:gap-4 w-full max-w-xl mx-auto">
        {/* Game Container - adjust height based on screen size */}
        <div
          aria-label="Bouncing balls game area"
          className="relative w-full h-[250px] lg:h-[300px] border-b-4 border-green-500 rounded-lg mb-4 lg:mb-8"
        >
          <AnimatePresence>
            {question.balls.map((ball) => {
              const baseDuration = 2;
              const durationVariation = 0.3;
              const duration =
                baseDuration + (Math.random() - 0.5) * durationVariation;
              const delay = Math.random() * baseDuration;

              return (
                <motion.div
                  aria-label={`Bouncing ball ${ball.id} with height ${ball.maxHeight}`}
                  key={`${key}-${ball.id}`}
                  initial={{ y: 0, scale: 0 }}
                  animate={{
                    y: [-ball.maxHeight, 0],
                    scaleY: [1, 0.7, 1],
                    scaleX: [1, 1.3, 1],
                    scale: 1,
                  }}
                  transition={{
                    y: {
                      duration: duration,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    },
                    scaleY: {
                      duration: duration,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      times: [0, 0.95, 1],
                      delay: delay,
                    },
                    scaleX: {
                      duration: duration,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      times: [0, 0.95, 1],
                      delay: delay,
                    },
                  }}
                  className="absolute bottom-0 w-6 h-6 lg:w-10 lg:h-10 rounded-full flex items-center justify-center"
                  style={{
                    left: `${(ball.id - 1) * (100 / question.balls.length)}%`,
                    backgroundColor: ball.color,
                  }}
                >
                  <span className="text-neutral-800 dark:text-neutral-200 font-bold text-sm lg:text-base">
                    {ball.id}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Options - adjust size and spacing based on screen size */}
        <div className="grid grid-cols-2 gap-2 lg:gap-4">
          {question.options.map((option, index) => (
            <motion.button
              aria-label={`Select ball number ${option}`}
              key={`${key}-${index}`}
              onClick={ () =>
              {
                if (!canClick) return;
                handleChoice(index)
              }}
              className={`${bgColor} px-4 lg:px-6 py-2 lg:py-2 text-base lg:text-lg text-neutral-800 dark:text-neutral-200 rounded-md hover:opacity-90 transition-colors`}
              whileHover={{ scale: 1.02 }}
            >
              {option}
            </motion.button>
          ))}
        </div>

        {/* Feedback - adjust text size based on screen size */}
        {feedback && (
          <motion.div
            aria-live="polite"
            className="fixed top-4 sm:top-6 md:top-8 left-0 right-0 text-neutral-800 dark:text-neutral-200 text-xl sm:text-3xl md:text-6xl font-bold text-center"
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

export default BouncingBallsGame;
