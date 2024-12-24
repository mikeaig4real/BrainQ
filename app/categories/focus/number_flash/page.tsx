"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";

// Add this interface
interface FlashingNumbersQuestion {
  sequence: number[];
  options: number[][];
  correctOptionIndex: number;
}

const bgColor = "bg-green-500";

const getGameSettings = (level: number) => {
  return {
    correctStreakLimit: 3,
    wrongStreakLimit: 2,
    basePoints: 1,
    levelMultiplier: level,
    maxLevel: 6,
    minLevel: 1,
    sequenceLength: Math.min(4 + Math.floor(level / 2), 8), // 4 to 8 numbers
    numberVariation: Math.max(4 - Math.floor(level / 2), 1), // Difference between options (3 to 1)
    displayTime: Math.max(1200 - level * 100, 600), // Display time decreases with level
    optionsCount: 4, // Constant number of options
  };
};

const FlashingNumbersGame = () => {
  const { updateGameStats, gameSession, categoryIndex } = useGame();
  const [feedback, setFeedback] = useState<string>("");
  const [level, setLevel] = useState(
    gameSession?.[categoryIndex]?.test?.level || 1
  );
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

  // Generate a random sequence
  const generateSequence = (length: number): number[] =>
    Array.from({ length }, () => Math.floor(Math.random() * 10));

  // Generate options based on level difficulty
  const generateOptions = (
    correctSequence: number[],
    settings: ReturnType<typeof getGameSettings>,
    lastCorrectIndex?: number // Add parameter to track last correct position
  ): { options: number[][]; correctOptionIndex: number } => {
    const options = [correctSequence];

    // Generate wrong options
    while (options.length < settings.optionsCount) {
      const newOption = [...correctSequence];
      const numChanges = Math.ceil(Math.random() * 2);

      for (let i = 0; i < numChanges; i++) {
        const changeIndex = Math.floor(Math.random() * correctSequence.length);
        const currentNum = newOption[changeIndex];
        let newNum;

        do {
          const variation =
            Math.floor(Math.random() * settings.numberVariation) + 1;
          newNum =
            (currentNum + (Math.random() < 0.5 ? variation : -variation) + 10) %
            10;
        } while (newNum === currentNum);

        newOption[changeIndex] = newNum;
      }

      if (!options.some((opt) => opt.join("") === newOption.join(""))) {
        options.push(newOption);
      }
    }

    // Keep shuffling until correct answer is in a different position
    let shuffledOptions;
    let correctOptionIndex;
    do {
      shuffledOptions = options.sort(() => Math.random() - 0.5);
      correctOptionIndex = shuffledOptions.indexOf(correctSequence);
    } while (
      lastCorrectIndex !== undefined &&
      correctOptionIndex === lastCorrectIndex
    );

    return { options: shuffledOptions, correctOptionIndex };
  };

  // Generate a new question
  const generateQuestion = (): void => {
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
  const handleChoice = (optionIndex: number): void => {
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 select-none mt-16">
      <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
        {/* Flashing Sequence */}
        <div className="flex justify-center mb-12">
          <AnimatePresence mode="wait">
            <motion.div
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
        <div className="grid grid-cols-2 gap-6">
          {question.options.map(
            (option: string[] | number[], index: number) => (
              <motion.button
                key={`${key}-${index}`}
                onClick={() => handleChoice(index)}
                className={`${bgColor} px-6 md:px-8 py-6 md:py-8 text-lg md:text-2xl 
                     text-neutral-800 dark:text-neutral-200 rounded-md hover:opacity-90 transition-colors`}
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
