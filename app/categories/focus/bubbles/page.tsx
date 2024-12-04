"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BouncingBallsQuestion {
  balls: Ball[];
  options: number[];
  correctOptionIndex: number;
}

interface Ball {
  id: number;
  maxHeight: number;
  color: string;
  initialHeight: number;
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
    ballCount: Math.min(4 + Math.floor(level / 2), 8), // 4 to 8 balls
    heightVariation: Math.max(100 - level * 10, 20), // Difference between heights decreases with level
    optionsCount: 4,
  };
};

const BouncingBallsGame = () => {
  const [feedback, setFeedback] = useState<string>("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
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

  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  const generateBalls = (
    settings: ReturnType<typeof getGameSettings>
  ): Ball[] => {
    const balls: Ball[] = [];
     const baseHeight =
       window.innerWidth < 640
         ? 80
         : window.innerWidth < 768
         ? 130
         : 180 + Math.random() * 100;

    for (let i = 0; i < settings.ballCount; i++) {
      balls.push({
        id: i + 1,
        maxHeight: baseHeight + Math.random() * settings.heightVariation,
        initialHeight: Math.random() * 300,
        color: generateRandomColor(),
      });
    }
    return balls;
  };

  const generateOptions = (
    balls: Ball[],
    settings: ReturnType<typeof getGameSettings>,
    lastCorrectIndex?: number
  ): { options: number[]; correctOptionIndex: number } => {
    // Find the ball that bounces the highest
    const highestBall = balls.reduce((prev, current) =>
      current.maxHeight > prev.maxHeight ? current : prev
    );

    // Create array of all ball IDs
    const allBallIds = balls.map((ball) => ball.id);

    // Ensure the highest ball is included in options
    let options = [highestBall.id];

    // Add other random balls until we have enough options
    while (options.length < settings.optionsCount) {
      const remainingBalls = allBallIds.filter((id) => !options.includes(id));
      if (remainingBalls.length === 0) break;

      const randomIndex = Math.floor(Math.random() * remainingBalls.length);
      options.push(remainingBalls[randomIndex]);
    }

    // Shuffle options
    let shuffledOptions;
    let correctOptionIndex;
    do {
      shuffledOptions = [...options].sort(() => Math.random() - 0.5);
      correctOptionIndex = shuffledOptions.indexOf(highestBall.id);
    } while (
      lastCorrectIndex !== undefined &&
      correctOptionIndex === lastCorrectIndex
    );

    return { options: shuffledOptions, correctOptionIndex };
  };

  const generateQuestion = (): void => {
    const settings = getGameSettings(level);
    const balls = generateBalls(settings);
    const { options, correctOptionIndex } = generateOptions(
      balls,
      settings,
      lastCorrectIndex
    );
    console.log({
      balls,
      options,
      correctOptionIndex,
    });
    setKey((prev) => prev + 1);
    setQuestion({
      balls,
      options,
      correctOptionIndex,
    });
    setLastCorrectIndex(correctOptionIndex);
  };

  // Replace the handleChoice function with this corrected version
  const handleChoice = (optionIndex: number): void => {
    const settings = getGameSettings(level);
    const selectedBallId = question.options[optionIndex];

    // Find the ball that bounces the highest
    const highestBall = question.balls.reduce((prev, current) =>
      current.maxHeight > prev.maxHeight ? current : prev
    );

    const isCorrect = selectedBallId === highestBall.id;

    if (isCorrect) {
      const points = settings.basePoints * settings.levelMultiplier;
      setScore((prev) => prev + points);
      setFeedback("Good!");
      setCorrectStreak((prev) => prev + 1);
      setWrongStreak(0);

      if (correctStreak + 1 >= settings.correctStreakLimit) {
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
      <div className="relative w-full h-[250px] lg:h-[300px]
                     border-b-4 border-green-500 rounded-lg mb-4 lg:mb-8">
        <AnimatePresence>
          {question.balls.map((ball) => {
            const baseDuration = 2;
            const durationVariation = 0.3;
            const duration = baseDuration + (Math.random() - 0.5) * durationVariation;
            const delay = Math.random() * baseDuration;

            return (
              <motion.div
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
                className="absolute bottom-0 w-6 h-6 lg:w-10 lg:h-10
                           rounded-full flex items-center justify-center"
                style={{
                  left: `${(ball.id - 1) * (100 / question.balls.length)}%`,
                  backgroundColor: ball.color,
                }}
              >
                <span className="text-white font-bold text-sm lg:text-base">
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
            key={`${key}-${index}`}
            onClick={() => handleChoice(index)}
            className={`${bgColor} px-4 lg:px-6 py-3 lg:py-4
                       text-base lg:text-lg text-white rounded-md 
                       hover:opacity-90 transition-colors`}
            whileHover={{ scale: 1.02 }}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {/* Feedback - adjust text size based on screen size */}
      {feedback && (
        <motion.div
          className="fixed top-4 sm:top-6 md:top-8 left-0 right-0 
                     text-white text-xl sm:text-3xl md:text-6xl 
                     font-bold text-center"
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
