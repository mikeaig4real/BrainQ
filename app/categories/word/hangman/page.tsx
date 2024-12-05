"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const wordCategories = {
  programming: {
    easy: [
      "python",
      "coding",
      "script",
      "arrays",
      "loops",
      "string",
      "input",
      "print",
      "class",
      "logic",
      "debug",
      "float",
      "const",
      "break",
      "while",
      "scope",
      "stack",
      "queue",
      "files",
      "parse",
      "cache",
      "data",
      "build",
      "tests",
      "error",
    ],
    medium: [
      "javascript",
      "typescript",
      "framework",
      "debugging",
      "database",
      "function",
      "variable",
      "compiler",
      "iterator",
      "promise",
      "callback",
      "boolean",
      "interface",
      "package",
      "module",
      "template",
      "protocol",
      "pointer",
      "runtime",
      "library",
      "platform",
      "backend",
      "frontend",
      "reactive",
      "storage",
    ],
    hard: [
      "authentication",
      "serialization",
      "implementation",
      "documentation",
      "asynchronous",
      "optimization",
      "encapsulation",
      "inheritance",
      "polymorphism",
      "abstraction",
      "middleware",
      "dependency",
      "configuration",
      "architecture",
      "microservice",
      "deployment",
      "orchestration",
      "virtualization",
      "encryption",
      "persistence",
      "scalability",
      "transaction",
      "distributed",
      "integration",
    ],
  },
  animals: {
    easy: [
      "monkey",
      "rabbit",
      "turtle",
      "penguin",
      "panda",
      "koala",
      "tiger",
      "zebra",
      "eagle",
      "snake",
      "horse",
      "sheep",
      "camel",
      "whale",
      "shark",
      "mouse",
      "puppy",
      "kitten",
      "birds",
      "duck",
      "goose",
      "fish",
      "bear",
      "deer",
      "wolf",
    ],
    medium: [
      "elephant",
      "crocodile",
      "kangaroo",
      "dolphin",
      "octopus",
      "giraffe",
      "panther",
      "buffalo",
      "gorilla",
      "leopard",
      "ostrich",
      "peacock",
      "hamster",
      "raccoon",
      "squirrel",
      "antelope",
      "jaguar",
      "walrus",
      "platypus",
      "hedgehog",
      "flamingo",
      "penguin",
      "meerkat",
      "tortoise",
      "pelican",
    ],
    hard: [
      "hippopotamus",
      "rhinoceros",
      "chimpanzee",
      "orangutan",
      "pterodactyl",
      "tyrannosaurus",
      "velociraptor",
      "stegosaurus",
      "triceratops",
      "brachiosaurus",
      "archaeopteryx",
      "ankylosaurus",
      "parasaurolophus",
      "diplodocus",
      "allosaurus",
      "megalosaurus",
      "ichthyosaurus",
      "plesiosaurus",
      "dimetrodon",
      "spinosaurus",
      "giganotosaurus",
      "carnotaurus",
      "pachycephalosaurus",
      "chasmosaurus",
    ],
  },
  countries: {
    easy: [
      "spain",
      "japan",
      "italy",
      "france",
      "china",
      "india",
      "brazil",
      "egypt",
      "chile",
      "cuba",
      "ghana",
      "kenya",
      "nepal",
      "peru",
      "qatar",
      "sudan",
      "syria",
      "togo",
      "yemen",
      "wales",
      "haiti",
      "libya",
      "malta",
      "niger",
      "oman",
    ],
    medium: [
      "australia",
      "argentina",
      "portugal",
      "thailand",
      "germany",
      "malaysia",
      "pakistan",
      "singapore",
      "vietnam",
      "belgium",
      "colombia",
      "denmark",
      "ethiopia",
      "finland",
      "hungary",
      "indonesia",
      "jamaica",
      "morocco",
      "norway",
      "philippines",
      "romania",
      "slovakia",
      "tanzania",
      "uruguay",
      "zimbabwe",
    ],
    hard: [
      "switzerland",
      "netherlands",
      "kazakhstan",
      "madagascar",
      "afghanistan",
      "azerbaijan",
      "bangladesh",
      "cameroon",
      "democratic",
      "guatemala",
      "kyrgyzstan",
      "luxembourg",
      "mauritania",
      "mozambique",
      "nicaragua",
      "tajikistan",
      "uzbekistan",
      "venezuela",
      "yugoslavia",
      "turkmenistan",
      "liechtenstein",
      "azerbaijan",
      "bangladesh",
      "mauritius",
    ],
  },
  sports: {
    easy: [
      "rugby",
      "tennis",
      "soccer",
      "golf",
      "polo",
      "judo",
      "swim",
      "surf",
      "bike",
      "run",
      "jump",
      "skip",
      "dive",
      "bowl",
      "fish",
      "sail",
      "ski",
      "box",
      "race",
      "dart",
      "lift",
      "shoot",
      "fence",
      "climb",
      "row",
    ],
    medium: [
      "baseball",
      "volleyball",
      "basketball",
      "cricket",
      "football",
      "handball",
      "hockey",
      "cycling",
      "archery",
      "bowling",
      "curling",
      "fencing",
      "rowing",
      "skating",
      "diving",
      "wrestling",
      "triathlon",
      "badminton",
      "canoeing",
      "karate",
      "lacrosse",
      "netball",
      "softball",
      "squash",
      "taekwondo",
    ],
    hard: [
      "skateboarding",
      "weightlifting",
      "parasailing",
      "mountaineering",
      "snowboarding",
      "windsurfing",
      "waterpolo",
      "gymnastics",
      "equestrian",
      "pentathlon",
      "powerlifting",
      "racquetball",
      "trampolining",
      "wakeboarding",
      "bodybuilding",
      "cheerleading",
      "paddleboarding",
      "rockclimbing",
      "rollerblading",
      "iceskating",
      "synchronized",
      "orienteering",
      "kiteboarding",
      "longboarding",
    ],
  },
};


interface GameSettings {
  correctStreakLimit: number;
  wrongStreakLimit: number;
  basePoints: number;
  levelMultiplier: number;
  maxLevel: number;
  minLevel: number;
  lives: number;
  timeLimit: number;
}

const getGameSettings = (level: number): GameSettings => {
  return {
    correctStreakLimit: 2,
    wrongStreakLimit: 2,
    basePoints: 10,
    levelMultiplier: level,
    maxLevel: 6,
    minLevel: 1,
    lives: Math.max(7 - Math.floor(level / 2), 4), // Lives decrease with level but minimum 4
    timeLimit: Math.max(90 - level * 10, 30), // Time limit decreases with level but minimum 30s
  };
};

const getDifficulty = (level: number): "easy" | "medium" | "hard" => {
  if (level <= 2) return "easy";
  if (level <= 4) return "medium";
  return "hard";
};

const HangmanGame = () => {
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [lives, setLives] = useState<number>(6);
  const [feedback, setFeedback] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [correctStreak, setCorrectStreak] = useState<number>(0);
  const [wrongStreak, setWrongStreak] = useState<number>(0);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [gameInitialized, setGameInitialized] = useState<boolean>(false);
  const [isWordComplete, setIsWordComplete] = useState<boolean>(false);

  const settings = getGameSettings(level);

  // Check if word is complete whenever guessed letters change
  useEffect(() => {
    if (selectedWord && guessedLetters.length > 0) {
      const complete = selectedWord
        .split("")
        .every((letter) => guessedLetters.includes(letter));
      setIsWordComplete(complete);
    }
  }, [guessedLetters, selectedWord]);

  // Modified setRandomWord function
  const setRandomWord = () => {
    const categories = Object.keys(wordCategories);
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const difficulty = getDifficulty(level);

    const availableWords = wordCategories[
      randomCategory as keyof typeof wordCategories
    ][difficulty].filter((word) => !usedWords.has(word));

    if (availableWords.length === 0) {
      setUsedWords(new Set());
      setRandomWord();
      return;
    }

    const randomWord =
      availableWords[Math.floor(Math.random() * availableWords.length)];
    setSelectedWord(randomWord);
    setCurrentCategory(randomCategory);
    setGuessedLetters([]);
    setLives(settings.lives);
    setFeedback("");
    setIsWordComplete(false); // Reset word completion state
    setUsedWords((prev) => new Set(prev).add(randomWord));
    setGameInitialized(true);
  };

  // Handle level progression
  const handleLevelProgression = (success: boolean) => {
    if (success) {
      setCorrectStreak((prev) => prev + 1);
      setWrongStreak(0);
      if (correctStreak + 1 >= settings.correctStreakLimit) {
        if (level < settings.maxLevel) {
          setLevel((prev) => prev + 1);
          setCorrectStreak(0);
        }
      }
    } else {
      setWrongStreak((prev) => prev + 1);
      setCorrectStreak(0);
      if (wrongStreak + 1 >= settings.wrongStreakLimit) {
        if (level > settings.minLevel) {
          setLevel((prev) => prev - 1);
          setWrongStreak(0);
        }
      }
    }
  };

  // Initialize game
  useEffect(() => {
    if (!gameInitialized) {
      setRandomWord();
    }
  }, []);

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || lives <= 0 || isWordComplete) {
      return;
    }

    setGuessedLetters((prev) => [...prev, letter]);

    if (!selectedWord.includes(letter)) {
      setLives((prev) => prev - 1);
      setFeedback("Wrong Guess!");
      setTimeout(() => setFeedback(""), 1000);
    } else {
      setFeedback("Good Guess!");
      setTimeout(() => setFeedback(""), 1000);
    }
  };

  // Handle game completion and level progression
  useEffect(() => {
    if (isWordComplete) {
      const points = settings.basePoints * settings.levelMultiplier;
      setScore((prev) => prev + points);
      setFeedback(`Good!`);
      handleLevelProgression(true);
      setTimeout(() => {
        setFeedback("");
        setRandomWord();
      }, 1000);
    } else if (lives <= 0) {
      setFeedback("Wrong!");
      handleLevelProgression(false);
      setTimeout(() => {
        setFeedback("");
        setRandomWord();
      }, 1000);
    }
  }, [isWordComplete, lives]);

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  // Hangman drawing components
  const HangmanDrawing = ({
    remainingLives,
    totalLives,
  }: {
    remainingLives: number;
    totalLives: number;
  }) => {
    const wrongGuesses = totalLives - remainingLives;

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
      <svg width="160" height="160">
        {remainingLives === 0 ? parts :  parts.slice(0, wrongGuesses)}
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 mt-16">
      {/* Game Header */}
      <div className="text-center">
        <p className="text-lg text-orange-500">Lives : {lives}</p>
        <p className="text-lg text-orange-500">Category: {currentCategory}</p>
      </div>

      {/* Hangman Drawing */}
      <div className="flex flex-col items-center">
        <HangmanDrawing remainingLives={lives} totalLives={settings.lives} />

        {/* Word Display */}
        <div className="flex justify-center gap-2 text-2xl font-mono mt-4">
          {selectedWord.split("").map((letter, index) => (
            <span 
              key={index} 
              className="w-8 h-8 flex items-center justify-center border-b-2 border-gray-400"
            >
              {guessedLetters.includes(letter) ? letter : "_"}
            </span>
          ))}
        </div>
      </div>

      {/* Keyboard */}
      <div className="grid grid-cols-7 gap-2">
        {alphabet.map((letter) => (
          <motion.button
            key={letter}
            onClick={() => handleGuess(letter)}
            className={`sm:px-4 sm:py-2 p-1  text-white rounded-md ${
              guessedLetters.includes(letter)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
            disabled={guessedLetters.includes(letter)}
            whileHover={{ scale: 1.1 }}
          >
            {letter.toUpperCase()}
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
  );
};

export default HangmanGame;
