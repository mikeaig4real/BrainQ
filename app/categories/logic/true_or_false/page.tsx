"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";

interface Question {
  statements: string[];
  finalStatement: string;
  isCorrect: boolean;
}

type Difficulty = "easy" | "medium" | "hard";

const advancedQuestionTemplates = {
  easy: [
    {
      statements: ["a = b + 1", "b = c + 1", "c = 3"],
      finalStatement: "a = 5",
      isCorrect: true,
    },
    // Basic Set Theory
    {
      statements: [
        "Set A contains {1,2,3}",
        "Set B contains {2,3,4}",
        "Set C is A ∩ B",
      ],
      finalStatement: "Set C contains {1,2,3}",
      isCorrect: false,
    },
    {
      statements: [
        "Set X is a subset of Set Y",
        "Set Y has 5 elements",
        "Set X has 3 elements",
      ],
      finalStatement: "Set X has all elements of Set Y",
      isCorrect: false,
    },
    {
      statements: [
        "Set P = {red, blue}",
        "Set Q = {blue, green}",
        "Set R = P ∪ Q",
      ],
      finalStatement: "Set R has 2 elements",
      isCorrect: false,
    },
    {
      statements: ["A is subset of B", "B is subset of C", "C has 5 elements"],
      finalStatement: "A must have exactly 5 elements",
      isCorrect: false,
    },

    // Simple Inequalities
    {
      statements: ["x > 5", "x < 10", "y = 7"],
      finalStatement: "x equals y",
      isCorrect: false,
    },
    {
      statements: ["a > b", "b > 0", "c = b + 1"],
      finalStatement: "c is greater than a",
      isCorrect: false,
    },
    {
      statements: ["p ≥ q", "q ≥ r", "r = 5"],
      finalStatement: "p must be 7",
      isCorrect: false,
    },
    {
      statements: ["x < y", "y < 10", "x = 5"],
      finalStatement: "y must be 15",
      isCorrect: false,
    },

    // Basic Number Relationships
    {
      statements: ["a = b + 2", "b = 3", "c = a - 1"],
      finalStatement: "c = 3",
      isCorrect: false,
    },
    {
      statements: ["x is even", "y is odd", "x + y = 10"],
      finalStatement: "x must be 6",
      isCorrect: false,
    },

    // Simple Comparisons
    {
      statements: [
        "Tom is taller than Jerry",
        "Jerry is taller than Spike",
        "Spike is 5 feet tall",
      ],
      finalStatement: "Tom must be 7 feet tall",
      isCorrect: false,
    },
    {
      statements: [
        "A is heavier than B",
        "B is heavier than C",
        "C weighs 10 kg",
      ],
      finalStatement: "A weighs 30 kg",
      isCorrect: false,
    },

    // Basic Order Relations
    {
      statements: ["First came X", "Then came Y", "Z came after Y"],
      finalStatement: "Z came before X",
      isCorrect: false,
    },
    {
      statements: [
        "Red is darker than Pink",
        "Blue is darker than Red",
        "Green is darker than Blue",
      ],
      finalStatement: "Pink is darker than Green",
      isCorrect: false,
    },

    // Simple Age Problems
    {
      statements: [
        "John is older than Mary",
        "Mary is older than Tom",
        "Tom is 10 years old",
      ],
      finalStatement: "John must be 15 years old",
      isCorrect: false,
    },
    {
      statements: [
        "Parent is twice Child's age",
        "Child is 10",
        "Sibling is 5 years older than Child",
      ],
      finalStatement: "Sibling is 20 years old",
      isCorrect: false,
    },

    // Basic Temperature Comparisons
    {
      statements: [
        "City A is warmer than City B",
        "City B is warmer than City C",
        "City C is 20°C",
      ],
      finalStatement: "City A must be 30°C",
      isCorrect: false,
    },
    {
      statements: [
        "Morning temp < Noon temp",
        "Noon temp < Evening temp",
        "Morning temp = 15°C",
      ],
      finalStatement: "Evening temp must be 25°C",
      isCorrect: false,
    },

    // Simple Distance Relations
    {
      statements: [
        "Point A is 5km from Point B",
        "Point B is 3km from Point C",
        "Point D is between B and C",
      ],
      finalStatement: "Point A is 8km from Point C",
      isCorrect: false,
    },
    {
      statements: [
        "House is closer to School than Park",
        "Park is 1km from School",
        "Store is between House and School",
      ],
      finalStatement: "Store must be 0.5km from School",
      isCorrect: false,
    },

    // Basic Time Sequences
    {
      statements: [
        "Event X happened before Event Y",
        "Event Y was 2 hours long",
        "Event Z started after Event Y ended",
      ],
      finalStatement: "Event X and Event Z happened at the same time",
      isCorrect: false,
    },
    {
      statements: [
        "Class A starts at 9 AM",
        "Class B follows Class A",
        "Each class is 1 hour long",
      ],
      finalStatement: "Class B must end at 12 PM",
      isCorrect: false,
    },
    {
      statements: ["x = 2y", "y = 2z", "z = 2"],
      finalStatement: "x = 6",
      isCorrect: false,
    },
    // Algebraic comparisons
    {
      statements: ["a > b", "b > c", "c > d"],
      finalStatement: "a is the largest",
      isCorrect: true,
    },
    {
      statements: ["x + y = z", "z > y", "x = y"],
      finalStatement: "x + x > y",
      isCorrect: false,
    },
    // Basic inequalities
    {
      statements: ["x > 5", "y < x", "y = 3"],
      finalStatement: "x is greater than 3",
      isCorrect: true,
    },
    {
      statements: ["a = b + 2", "b = 3", "c = 7"],
      finalStatement: "a = 5",
      isCorrect: true,
    },
    // Multiple variables relationships
    {
      statements: ["p = q + r", "q = r", "r > 0"],
      finalStatement: "p > 2r",
      isCorrect: false,
    },
    {
      statements: ["m < n", "n < o", "o = p"],
      finalStatement: "m is less than p",
      isCorrect: true,
    },
  ],
  medium: [
    // Mixed operations
    {
      statements: ["x - y = 5", "y + z = 10", "z = 3"],
      finalStatement: "x = 12",
      isCorrect: true,
    },
    {
      statements: ["2p + q = 15", "q = p", "p > 0"],
      finalStatement: "p = 5",
      isCorrect: true,
    },
    // Fractions and multiples
    {
      statements: ["x/3 = y", "y/2 = z", "z = 6"],
      finalStatement: "x = 36",
      isCorrect: true,
    },
    {
      statements: ["a = 3b", "b = 4c", "c = 2"],
      finalStatement: "a = 24",
      isCorrect: true,
    },
    // Negative numbers
    {
      statements: ["x = -y", "y > 0", "z = x + 1"],
      finalStatement: "z is negative",
      isCorrect: true,
    },
    {
      statements: ["m = -2n", "n = -3", "p = m - 1"],
      finalStatement: "p = 5",
      isCorrect: true,
    },
    // Complex relationships
    {
      statements: ["2x = y", "y = 3z", "z = 4"],
      finalStatement: "x = 6",
      isCorrect: true,
    },
    {
      statements: ["a + b = 10", "b = 2c", "c = 2"],
      finalStatement: "a = 6",
      isCorrect: true,
    },
    // Set theory
    {
      statements: [
        "Set A is a subset of Set B",
        "Set B is disjoint from Set C",
        "Set D contains Set C",
      ],
      finalStatement: "Set A is disjoint from Set D",
      isCorrect: true,
    },
    {
      statements: [
        "Every element of Set X is in Set Y",
        "Set Y contains Set Z",
        "Set X is equivalent to Set Z",
      ],
      finalStatement: "Set X is a subset of Set Z",
      isCorrect: false,
    },
    // Time relationships
    {
      statements: [
        "Event X happened before Event Y",
        "Event Y happened after Event Z",
        "Event Z happened before Event X",
      ],
      finalStatement: "The events form a logical timeline",
      isCorrect: false,
    },
    // Age and Generation Problems
    {
      statements: [
        "Mark is younger than his sister Jane",
        "Jane is two years older than Peter",
        "Peter's twin Amy is older than Mark",
        "Amy is studying in college",
      ],
      finalStatement: "Jane must be out of college",
      isCorrect: false,
    },
    {
      statements: [
        "Each child in the family is 2 years apart",
        "The youngest child is 5 years old",
        "There are 4 children in total",
        "The oldest child plays basketball",
        "Basketball players must be at least 12 years old",
      ],
      finalStatement: "The oldest child cannot play basketball",
      isCorrect: false,
    },

    // Race and Speed Problems
    {
      statements: [
        "Runner A finishes 1 minute before Runner B",
        "Runner B finishes 2 minutes before Runner C",
        "Runner C completes the race in 30 minutes",
        "Runner D finishes between A and B",
        "The race is 10 kilometers long",
      ],
      finalStatement: "Runner A must have run at 25 km/h",
      isCorrect: false,
    },
    {
      statements: [
        "Car X travels faster than Car Y",
        "Car Y travels faster than Car Z",
        "Car Z maintains a speed of 60 km/h",
        "All cars travel the same distance",
        "Car X arrives 30 minutes earlier than Car Z",
      ],
      finalStatement: "Car X must have traveled at 120 km/h",
      isCorrect: false,
    },

    // Family Tree Problems
    {
      statements: [
        "John's grandfather is older than Mary's father",
        "Mary's father is James",
        "James is younger than his cousin Peter",
        "Peter's daughter Sarah is 15",
        "John is older than Sarah",
      ],
      finalStatement: "John must be at least 20 years old",
      isCorrect: false,
    },

    // School and Grade Problems
    {
      statements: [
        "Math class has more students than Science class",
        "Science class has 5 more students than History class",
        "History class has 20 students",
        "Each class must have at least 2 group projects",
        "Groups must have exactly 5 students",
      ],
      finalStatement: "Math class can form exactly 6 groups",
      isCorrect: false,
    },

    // Restaurant and Order Problems
    {
      statements: [
        "Table A ordered before Table B",
        "Table B's food arrived after Table C",
        "Table C waited 20 minutes for their food",
        "Kitchen takes 15 minutes to prepare each order",
        "Table D ordered right after Table A",
      ],
      finalStatement: "Table D's food must arrive before Table C's",
      isCorrect: false,
    },

    // Library Book Problems
    {
      statements: [
        "Book A was checked out before Book B",
        "Book B was returned after Book C",
        "Book C was borrowed for exactly 14 days",
        "Book D was checked out the same day Book A was returned",
        "All books must be returned within 21 days",
      ],
      finalStatement: "Book B must have been borrowed for 21 days",
      isCorrect: false,
    },

    // Movie Theater Problems
    {
      statements: [
        "Theater 1 shows longer movies than Theater 2",
        "Theater 2's movies are 30 minutes longer than Theater 3",
        "Theater 3 shows 90-minute movies",
        "Each theater has 4 showings per day",
        "There must be 30 minutes between showings",
      ],
      finalStatement: "Theater 1 can only show 3 movies per day",
      isCorrect: false,
    },

    // Train Schedule Problems
    {
      statements: [
        "Express train arrives before local train",
        "Local train takes twice as long as the bus",
        "Bus journey takes 45 minutes",
        "Express train makes half the stops of local train",
        "Each stop takes 2 minutes",
        "Local train makes 10 stops",
      ],
      finalStatement: "Express train journey must take 30 minutes",
      isCorrect: false,
    },

    // Shopping Mall Problems
    {
      statements: [
        "Store A has more customers than Store B",
        "Store B has double the customers of Store C",
        "Store C serves 50 customers per hour",
        "Store D has 25 fewer customers than Store A",
        "Each customer spends average 20 minutes in store",
      ],
      finalStatement: "Store A must serve 200 customers per hour",
      isCorrect: false,
    },

    // Paint Mixing Problems
    {
      statements: [
        "Blue paint is used more than red paint",
        "Red paint is used twice as much as yellow paint",
        "Yellow paint needs 2 liters for one room",
        "Green paint uses equal parts blue and yellow",
        "Each room needs the same amount of paint",
      ],
      finalStatement: "A four-room house needs 24 liters of paint total",
      isCorrect: false,
    },
  ],
  hard: [
    // More complex relationships
    {
      statements: ["2x + y = 10", "y = x", "x > 0"],
      finalStatement: "x = 3",
      isCorrect: true,
    },
    {
      statements: ["a = 2b", "b = 3c", "c = 2"],
      finalStatement: "a = 12",
      isCorrect: true,
    },
    // Challenging deductions
    {
      statements: ["a/2 = b", "b/2 = c", "c = 3"],
      finalStatement: "a = 12",
      isCorrect: true,
    },
    {
      statements: ["x + y > z", "z = x", "y < 0"],
      finalStatement: "x + y > x",
      isCorrect: false,
    },
    // Advanced logic
    {
      statements: ["x² > y²", "y > 0", "x < 0"],
      finalStatement: "x is less than -y",
      isCorrect: true,
    },
    {
      statements: ["2p = q", "q = 3r", "r = 6"],
      finalStatement: "p = 9",
      isCorrect: true,
    },
    // Complex word problems
    {
      statements: [
        "If System A fails, System B activates",
        "If System B activates, System C shuts down",
        "If System C shuts down, System D must restart",
        "System D cannot restart while System E is running",
        "System E runs only when System A is stable",
        "System A has failed twice today",
      ],
      finalStatement: "System D has restarted exactly twice today",
      isCorrect: false,
    },
    {
      statements: [
        "When temperature rises above 30°C, Machine X stops",
        "Machine Y starts only when Machine X is running",
        "Machine Z requires both X and Y to be stopped",
        "The temperature fluctuated between 25°C and 35°C",
        "Machine W can only run when Z is active",
        "Machine W ran for 2 hours today",
      ],
      finalStatement: "Machine Y must have been stopped for at least 4 hours",
      isCorrect: false,
    },

    // Complex Resource Distribution Problems
    {
      statements: [
        "Server A handles twice the load of Server B",
        "Server B processes 30% more requests than Server C",
        "Server C fails if load exceeds 1000 requests/second",
        "When any server fails, its load is distributed equally to others",
        "The total system receives 5000 requests/second",
        "No more than two servers can fail simultaneously",
      ],
      finalStatement: "Server A must process exactly 2500 requests/second",
      isCorrect: false,
    },

    // Advanced Time-Space Problems
    {
      statements: [
        "Train α travels twice as fast as Train β in the same direction",
        "Train β maintains constant speed while Train γ accelerates",
        "Train γ starts at the same speed as Train β",
        "Train δ travels in opposite direction at Train α's speed",
        "All trains start at different stations 100km apart",
        "Train β takes 2 hours to reach its destination",
      ],
      finalStatement:
        "Train α and δ must meet exactly halfway between their starting points",
      isCorrect: false,
    },

    // Complex Game Theory Problems
    {
      statements: [
        "Player 1's strategy dominates Player 2's in scenario A",
        "Player 2's payoff doubles when Player 3 cooperates",
        "Player 3 only cooperates when Player 4 defects",
        "Player 4's strategy depends on Player 1's last move",
        "At least two players must cooperate each round",
        "The game has run for 5 rounds",
      ],
      finalStatement: "Player 1 must have cooperated at least 3 times",
      isCorrect: false,
    },

    // Advanced Chemical Reaction Problems
    {
      statements: [
        "Compound X breaks down into Y and Z above 100°C",
        "Y catalyzes the formation of W from Z",
        "W inhibits the breakdown of X",
        "Temperature increased from 90°C to 110°C",
        "Initial concentration of X was 100%",
        "Z has a half-life of 10 minutes at 110°C",
      ],
      finalStatement: "The final concentration of W must be 25%",
      isCorrect: false,
    },

    // Complex Network Flow Problems
    {
      statements: [
        "Node A sends data to both B and C simultaneously",
        "Node B's bandwidth doubles when C is congested",
        "Node C becomes congested at 75% capacity",
        "Node D receives data from B and C equally",
        "Total network throughput is 1000 MB/s",
        "No node can exceed 80% of total capacity",
      ],
      finalStatement: "Node B must handle exactly 400 MB/s",
      isCorrect: false,
    },

    // Advanced Market Dynamics Problems
    {
      statements: [
        "Product A's demand increases when B's price rises",
        "Product B's supply depends on C's production cost",
        "Product C requires twice the resources of A",
        "Resource availability decreased by 30%",
        "Market demand grew by 25%",
        "Production efficiency improved by 15%",
      ],
      finalStatement: "Product A's price must increase by 40%",
      isCorrect: false,
    },

    // Complex Genetic Inheritance Problems
    {
      statements: [
        "Trait X is dominant over trait Y",
        "Trait Y is co-dominant with trait Z",
        "Trait Z expression requires trait W",
        "Trait W is sex-linked",
        "Parent 1 has traits X and W",
        "Parent 2 has traits Y and Z",
        "Three offspring are produced",
      ],
      finalStatement: "At least two offspring must express trait Z",
      isCorrect: false,
    },

    // Advanced Quantum State Problems
    {
      statements: [
        "Particle A's spin correlates with B's position",
        "Particle B's energy level affects C's momentum",
        "Particle C's state collapses when D is measured",
        "Particle D exists in superposition with A",
        "System entropy increased by factor of 2",
        "Initial system temperature was absolute zero",
      ],
      finalStatement: "Particle B must be in its ground state",
      isCorrect: false,
    },
  ],
};

const getGameSettings = (level: number) => {
  return {
    correctStreakLimit: 3,
    wrongStreakLimit: 2,
    basePoints: 1, // Single base point value
    levelMultiplier: level,
    maxLevel: 6,
    minLevel: 1,
  };
};

const getDifficultyFromLevel = (level: number): Difficulty => {
  if (level <= 2) return "easy";
  if (level <= 4) return "medium";
  return "hard";
};

const TrueOrFalseGame = () => {
  const { updateGameStats, gameSession, categoryIndex } = useGame();
  const [feedback, setFeedback] = useState<string>("");
  const [level, setLevel] = useState(gameSession?.[categoryIndex]?.test?.level || 1);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [question, setQuestion] = useState<Question>({
    statements: [],
    finalStatement: "",
    isCorrect: false,
  });
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set());

  const generateQuestion = useCallback((): void => {
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
      setQuestion( randomQuestion );
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
    updateGameStats({ totalQuestions: 1 });
  }, [level, usedQuestions]);

  // Reset used questions and generate new question when level changes
  useEffect(() => {
    setUsedQuestions(new Set());
    generateQuestion();
  }, [level]); // Only depend on level changes

  const handleChoice = (choice: boolean): void => {
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 select-none mt-16">
      {/* Statements Container */}
      <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
        {/* Statements */}
        <div className="flex flex-col gap-4 text-base sm:text-xl md:text-2xl text-center font-bold">
          {question.statements.map((statement, index) => (
            <motion.p
              key={index}
              className="text-yellow-500 px-2 py-1 break-words"
              whileHover={{ scale: 1.02 }}
            >
              {statement}
            </motion.p>
          ))}

          {/* Final Statement */}
          <motion.p
            className="text-white font-semibold my-4 md:my-6 text-lg sm:text-2xl md:text-3xl bg-yellow-800 py-2 px-4 rounded-md break-words"
            whileHover={{ scale: 1.02 }}
          >
            Therefore: {question.finalStatement}... ?
          </motion.p>
        </div>

        {/* Choices */}
        <div className="flex gap-4 md:gap-8 justify-center mt-4">
          <button
            className="bg-yellow-500 px-4 md:px-6 py-2 md:py-3 text-base md:text-xl text-black rounded-md hover:bg-yellow-400 transition-colors"
            onClick={() => handleChoice(true)}
          >
            True
          </button>
          <button
            className="bg-black px-4 md:px-6 py-2 md:py-3 text-base md:text-xl text-white rounded-md border-yellow-500 border hover:bg-gray-900 transition-colors"
            onClick={() => handleChoice(false)}
          >
            False
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.div
            className="fixed top-8 left-0 right-0 text-white text-2xl md:text-6xl font-bold text-center"
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
