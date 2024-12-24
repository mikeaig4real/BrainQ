"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";

interface MnemonicGameProps {
  initialLevel?: number;
}

const GROUP_COLORS: { [key: string]: string } = {
  red: "#FF4444",
  green: "#44AA44",
  yellow: "#FFAA00",
  purple: "#AA44AA",
  blue: "#4444FF",
  orange: "#FF8844",
};

const bgColor = "bg-blue-500";

// Define type for word pool categories
type WordPoolCategory = keyof typeof wordPools;

// Define word pools with proper typing
const wordPools = {
  animals: [
    "cat",
    "dog",
    "bird",
    "fish",
    "lion",
    "tiger",
    "bear",
    "wolf",
    "fox",
    "deer",
    "horse",
    "rabbit",
  ],
  colors: [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
    "brown",
    "gray",
    "black",
    "white",
  ],
  fruits: [
    "apple",
    "banana",
    "orange",
    "grape",
    "mango",
    "cherry",
    "kiwi",
    "lemon",
    "peach",
    "plum",
  ],
  countries: [
    "france",
    "spain",
    "italy",
    "germany",
    "japan",
    "china",
    "india",
    "brazil",
    "egypt",
    "canada",
  ],
  tech: [
    "python",
    "java",
    "react",
    "node",
    "swift",
    "kotlin",
    "ruby",
    "rust",
    "golang",
    "typescript",
  ],
  science: [
    "atom",
    "cell",
    "gene",
    "wave",
    "force",
    "energy",
    "mass",
    "light",
    "heat",
    "sound",
  ],
} as const;

const getRandomGroupColor = (usedColor?: string) => {
  const colors = Object.keys(GROUP_COLORS).filter(
    (color) => color !== usedColor
  );
  return colors[Math.floor(Math.random() * colors.length)];
};

const generateWordGroups = (level: number) => {
  // Determine number of common words based on level
  const commonWordsCount = Math.min(1 + Math.floor(level / 3), 4); // 1-4 common words
  const totalWordsPerGroup = Math.min(4 + Math.floor(level / 2), 8); // 4-8 total words

  // Select random category for this round
  const categories = Object.keys(wordPools) as WordPoolCategory[];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const availableWords: string[] = [...wordPools[category]];

  // Generate common words
  const commonWords: string[] = [];
  for (let i = 0; i < commonWordsCount; i++) {
    if (availableWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      commonWords.push(availableWords[randomIndex]);
      availableWords.splice(randomIndex, 1);
    }
  }

  // Generate unique words for each group
  const generateGroupWords = (commonWords: string[]) => {
    const groupWords = [...commonWords];
    while (
      groupWords.length < totalWordsPerGroup &&
      availableWords.length > 0
    ) {
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const word = availableWords[randomIndex];
      if (!groupWords.includes(word)) {
        groupWords.push(word);
        availableWords.splice(randomIndex, 1);
      }
    }
    return groupWords.sort(() => Math.random() - 0.5); // Shuffle the words
  };

  const group1 = generateGroupWords(commonWords);
  const group2 = generateGroupWords(commonWords);

  return {
    group1,
    group2,
    commonWords,
  };
};

const getGameSettings = (level: number) => {
  return {
    correctStreakLimit: 1, // Correct answers needed for level up
    wrongStreakLimit: 2, // Wrong answers before level down
    basePoints: 1, // Single base point value
    levelMultiplier: level,
    maxLevel: 6,
    minLevel: 1,
    displayTime: Math.max(5000 - level * 200, 2500), // Keep the display time scaling
    wordCount: Math.min(4 + Math.floor(level / 2), 8), // Keep the word count scaling
  };
};

type WordData = {
  [key: string]: any;
};

const MnemonicGame: React.FC = () => {
  const { updateGameStats, gameSession, categoryIndex } = useGame();
  const [currentGroup, setCurrentGroup] = useState(1);
  const [wordData, setWordData] = useState<WordData>({});
  const [gamePhase, setGamePhase] = useState("showing1");
  const [feedback, setFeedback] = useState("");
  const [group1Color, setGroup1Color] = useState("");
  const [group2Color, setGroup2Color] = useState("");
  const [level, setLevel] = useState(
    gameSession?.[categoryIndex]?.test?.level || 1
  );
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  // Update the useEffect for level changes to include a delay
  useEffect(() => {
    const startNewRound = () => {
      const wordInfo = generateWordGroups(level);
      setWordData(wordInfo);
      const color1 = getRandomGroupColor();
      const color2 = getRandomGroupColor(color1);
      setGroup1Color(color1);
      setGroup2Color(color2);
      setGamePhase("showing1");
      setSelectedWords([]);
    };

    // Add a small delay before starting new round when level changes
    const timer = setTimeout(() => {
      startNewRound();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentGroup]);

  // Update the display timing useEffect to use the settings
  useEffect(() => {
    const settings = getGameSettings(level);
    let timer: ReturnType<typeof setTimeout>;

    if (gamePhase === "showing1") {
      timer = setTimeout(() => {
        setGamePhase("showing2");
      }, settings.displayTime);
    } else if (gamePhase === "showing2") {
      timer = setTimeout(() => {
        updateGameStats({ totalQuestions: 1 });
        setGamePhase("guessing");
      }, settings.displayTime);
    }

    return () => clearTimeout(timer);
  }, [gamePhase]);

  // In the handleChoice function of the Mnemonic game:
  const handleChoice = (word: string) => {
    if (selectedWords.includes(word)) {
      return; // Prevent selecting the same word twice
    }

    const newSelectedWords = [...selectedWords, word];
    setSelectedWords(newSelectedWords);

    // Check if we've selected enough words
    if (newSelectedWords.length === wordData.commonWords.length) {
      const settings = getGameSettings(level);
      const isCorrect =
        newSelectedWords.every((w) => wordData.commonWords.includes(w)) &&
        wordData.commonWords.every((w: string) => newSelectedWords.includes(w));

      if (isCorrect) {
        updateGameStats({
          totalCorrect: 1,
        });
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

      // Ensure consistent timing between rounds
      setTimeout(() => {
        setFeedback("");
        setCurrentGroup((prev) => prev + 1);
      }, 1500);
    }
  };

  const getUniqueWords = () => {
    const allWords = [...wordData.group1, ...wordData.group2];
    return [...new Set(allWords)];
  };

  return (
    <div className="relative py-32 mt-16">
      {gamePhase === "showing1" && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            className="text-2xl font-bold"
            style={{ color: GROUP_COLORS[group1Color] }}
          >
            GROUP {group1Color.toUpperCase()}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {wordData.group1?.map((word: string, index: number) => (
              <motion.button
                key={index}
                className="p-2 m-2 rounded-lg text-neutral-800 dark:text-neutral-200 font-bold text-sm lg:text-base break-words min-w-[90px]"
                style={{ backgroundColor: GROUP_COLORS[group1Color] }}
              >
                {word}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {gamePhase === "showing2" && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            className="text-2xl font-bold"
            style={{ color: GROUP_COLORS[group2Color] }}
          >
            GROUP {group2Color.toUpperCase()}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {wordData.group2?.map((word: string, index: number) => (
              <motion.button
                key={index}
                className="p-2 m-2 rounded-lg text-neutral-800 dark:text-neutral-200 font-bold text-sm lg:text-base break-words min-w-[90px]"
                style={{ backgroundColor: GROUP_COLORS[group2Color] }}
              >
                {word}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {gamePhase === "guessing" && (
        <div>
          <div className="text-xl mb-16 text-center">
            Find words that appeared in both groups:
          </div>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {getUniqueWords().map((word, index) => (
              <button
                key={index}
                className={`${bgColor} p-2 m-2 rounded-lg text-neutral-800 dark:text-neutral-200 font-bold text-sm lg:text-base break-words min-w-[90px] 
                  ${selectedWords.includes(word) ? "opacity-50" : ""}`}
                onClick={() => handleChoice(word)}
                disabled={selectedWords.includes(word)}
              >
                {word}
              </button>
            ))}
          </motion.div>
        </div>
      )}

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
  );
};

export default MnemonicGame;
