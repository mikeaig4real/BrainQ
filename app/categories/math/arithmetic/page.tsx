"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";

interface Question {
  num1: number;
  num2: number;
  operator: string;
  equation: (string | number)[];
  choices: (string | number)[];
  missingElement: string;
  result: number;
}

const getGameSettings = (level: number) => {
  return {
    correctStreakLimit: 2, // Correct answers needed for level up
    wrongStreakLimit: 2, // Wrong answers before level down
    basePoints: 1, // Single base point value
    levelMultiplier: level,
    maxLevel: 6,
    minLevel: 1,
    numberRange: {
      min: Math.max(3, Math.floor(level / 3) * 10),
      max: Math.min(10 + level * 15, 200),
    },
    operators:
      level <= 2
        ? ["+", "-"]
        : level <= 4
        ? ["+", "-", "*"]
        : ["+", "-", "*", "/"],
    choiceCount: Math.min(4 + Math.floor(level / 3), 6),
    timeLimit: Math.max(10000 - level * 500, 5000),
  };
};

const ArithmeticGame: React.FC = () => {
  const { updateGameStats } = useGame();
  const [feedback, setFeedback] = useState<string>("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [question, setQuestion] = useState<Question>({
    num1: 0,
    num2: 0,
    operator: "",
    equation: [],
    choices: [],
    missingElement: "",
    result: 0,
  });

  // Then update the generateQuestion function to use the new number ranges
  const generateQuestion = (): void => {
    const settings = getGameSettings(level);

    // Helper function to generate number within range, excluding small numbers
    const generateValidNumber = (min: number, max: number): number => {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      return num <= 2 ? generateValidNumber(3, max) : num;
    };

    // Generate first number
    const num1: number = generateValidNumber(
      settings.numberRange.min,
      settings.numberRange.max
    );

    let num2: number;

    // Special handling for division to ensure clean results
    if (settings.operators.includes("/")) {
      // For division, ensure num2 is a factor of num1 but not 1 or 2
      const factors = Array.from(
        { length: Math.min(num1, 12) },
        (_, i) => i + 1
      ).filter((n) => num1 % n === 0 && n > 2);

      // If no valid factors found, regenerate question
      if (factors.length === 0) {
        return generateQuestion();
      }
      num2 = factors[Math.floor(Math.random() * factors.length)];
    } else {
      num2 = generateValidNumber(
        settings.numberRange.min,
        settings.numberRange.max
      );
    }

    const correctOperator: string =
      settings.operators[Math.floor(Math.random() * settings.operators.length)];

    // For multiplication with large numbers, scale down num2 but keep it above 2
    if (correctOperator === "*" && num1 > 20) {
      num2 = Math.max(3, Math.min(num2, Math.floor(200 / num1)));
    }

    let result: number = Number(
      eval(`${num1} ${correctOperator} ${num2}`).toFixed(1)
    );

    const missingIndex: number = Math.floor(Math.random() * 4);
    const equation: (string | number)[] = [
      num1,
      correctOperator,
      num2,
      "=",
      result,
    ];
    const missingElement: string | number = equation[missingIndex];
    equation[missingIndex] = "?";

    // Generate choices based on what's missing and level
    let choices: (string | number)[];
    if (missingIndex === 1) {
      // For operator choices
      choices = [...settings.operators.sort(() => Math.random() - 0.5)];
    } else if (missingIndex === 3) {
      // For comparison operator choices
      const leftSide: number = Number(
        eval(`${num1} ${correctOperator} ${num2}`).toFixed(1)
      );

      // Randomly decide if we want equality comparison or inequality comparison
      const wantEqualityComparison = Math.random() < 0.5;

      if (wantEqualityComparison) {
        // For equality comparisons (= vs ≠)
        const makeEqual = Math.random() < 0.5;
        if (makeEqual) {
          // Make the right side equal to left side
          result = leftSide;
          choices = ["=", "≠"].sort(() => Math.random() - 0.5);
        } else {
          // Make the right side different from left side
          result =
            leftSide +
            (Math.random() < 0.5 ? 1 : -1) *
              (3 + Math.floor(Math.random() * 5));
          choices = ["≠", "="].sort(() => Math.random() - 0.5);
        }
      } else {
        // For inequality comparisons (< vs >)
        const makeGreater = Math.random() < 0.5;
        if (makeGreater) {
          // Make left side greater than right side
          result = leftSide - (3 + Math.floor(Math.random() * 5));
          choices = [">", "<"].sort(() => Math.random() - 0.5);
        } else {
          // Make left side less than right side
          result = leftSide + (3 + Math.floor(Math.random() * 5));
          choices = ["<", ">"].sort(() => Math.random() - 0.5);
        }
      }

      // Update the equation array with the new result
      equation[4] = result;
    } else if (missingIndex === 4) {
      // For result choices
      const spread = Math.max(
        Math.ceil(level / 2),
        Math.floor(Math.abs(result) * 0.1)
      );
      choices = Array.from({ length: settings.choiceCount }, (_, i) => {
        const choice = Number(
          (
            result +
            (i - Math.floor(settings.choiceCount / 2)) * spread
          ).toFixed(1)
        );
        return choice <= 2 ? choice + 3 : choice; // Ensure no choices are 1 or 2
      }).sort(() => Math.random() - 0.5);
    } else {
      // For number choices (num1 or num2)
      const baseNum: number = Number(missingElement);
      const spread = Math.max(
        Math.ceil(level / 2),
        Math.floor(Math.abs(baseNum) * 0.1)
      );
      choices = Array.from({ length: settings.choiceCount }, (_, i) => {
        const choice =
          baseNum + (i - Math.floor(settings.choiceCount / 2)) * spread;
        return choice <= 2 ? choice + 3 : choice; // Ensure no choices are 1 or 2
      }).sort(() => Math.random() - 0.5);
    }

    setQuestion({
      num1,
      num2,
      operator: correctOperator,
      equation,
      choices,
      missingElement: missingElement.toString(),
      result,
    });
    updateGameStats({ totalQuestions: 1 });
  };

  // Modify the handleChoice function:
  const handleChoice = (choice: string | number): void => {
    const settings = getGameSettings(level);
    const { num1, num2, result } = question;
    const missingIndex: number = question.equation.indexOf("?");

    let isCorrect: boolean = false;

    if (missingIndex === 1) {
      const chosenResult: number = Number(
        eval(`${num1} ${choice} ${num2}`).toFixed(1)
      );
      isCorrect = chosenResult === result;
    } else if (missingIndex === 3) {
      const leftSide: number = Number(
        eval(`${num1} ${question.operator} ${num2}`).toFixed(1)
      );

      if (choice === "=") {
        isCorrect = leftSide === result;
      } else if (choice === "≠") {
        isCorrect = leftSide !== result;
      } else if (choice === "<") {
        isCorrect = leftSide < result;
      } else if (choice === ">") {
        isCorrect = leftSide > result;
      }
    } else {
      isCorrect = choice.toString() === question.missingElement;
    }

    if (isCorrect) {
      // Simplified scoring: basePoints * currentLevel
      const points = settings.basePoints * settings.levelMultiplier;
      updateGameStats({
        score: points,
        totalCorrect: 1,
      });
      setScore((prev) => prev + points);
      setFeedback("Good!");
      setCorrectStreak((prev) => prev + 1);
      setWrongStreak(0);

      // Level up on reaching correctStreakLimit
      if (correctStreak + 1 >= settings.correctStreakLimit) {
        updateGameStats(
          { level: Math.min(level + 1, settings.maxLevel) },
          "set"
        );
        setTimeout(() => {
          setLevel((prev) => Math.min(prev + 1, settings.maxLevel));
          setCorrectStreak(0);
        }, 1000);
      }
    } else {
      setFeedback("Wrong!");
      setWrongStreak((prev) => prev + 1);
      setCorrectStreak(0);

      // Level down on reaching wrongStreakLimit
      if (
        wrongStreak + 1 >= settings.wrongStreakLimit &&
        level > settings.minLevel
      ) {
        updateGameStats(
          { level: Math.max(level - 1, settings.minLevel) },
          "set"
        );
        setTimeout(() => {
          setLevel((prev) => Math.max(prev - 1, settings.minLevel));
          setWrongStreak(0);
        }, 1000);
      }
    }

    // Consistent timing for feedback and next question
    setTimeout(() => {
      setFeedback("");
      generateQuestion();
    }, 1500);
  };

  // Remove the level dependency from useEffect since we handle question generation in handleChoice
  useEffect(() => {
    generateQuestion();
  }, []); // Only run on initial mount

  return (
    <div className="relative py-32">
      {/* Equation Display */}
      <div className="w-full flex items-center justify-center gap-4 text-4xl font-bold p-8 rounded shadow-md mb-12 select-none">
        {question.equation.map((part, index) => (
          <motion.span
            key={index}
            className="text-red-500 mr-4"
            whileHover={{ scale: 1.2 }}
          >
            {part}
          </motion.span>
        ))}
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto w-full">
        {question.choices.map((choice, index) => (
          <button
            key={index}
            className="bg-red-500 w-full text-2xl text-white rounded-md py-2"
            onClick={() => handleChoice(choice)}
          >
            {choice}
          </button>
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
  );
};

export default ArithmeticGame;
