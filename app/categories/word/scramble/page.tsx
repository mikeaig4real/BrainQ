"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";

const bgColor = "bg-orange-500";

const wordPools = {
  easy: [
    "apple",
    "beach",
    "chair",
    "dance",
    "eagle",
    "flame",
    "grape",
    "heart",
    "image",
    "juice",
    "kite",
    "lemon",
    "music",
    "north",
    "ocean",
    "paint",
    "queen",
    "river",
    "smile",
    "table",
    "uncle",
    "voice",
    "water",
    "youth",
    "zebra",
    "bread",
    "cloud",
    "dream",
    "flash",
    "green",
    "honey",
    "ivory",
    "jumbo",
    "knife",
    "light",
    "money",
    "nurse",
    "paper",
    "quiet",
    "radio",
    "snake",
    "tiger",
    "umbrella",
    "video",
    "whale",
    "amber",
    "brick",
    "candy",
    "daisy",
    "earth",
    "fairy",
    "glass",
    "happy",
    "index",
    "jelly",
    "lunar",
    "magic",
    "noble",
    "olive",
    "pearl",
    "quilt",
    "royal",
    "sugar",
    "tulip",
    "urban",
    "vault",
    "wagon",
    "xenon",
    "yacht",
    "zesty",
  ],
  medium: [
    "balloon",
    "captain",
    "diamond",
    "elephant",
    "factory",
    "garden",
    "harmony",
    "island",
    "journey",
    "kitchen",
    "library",
    "machine",
    "network",
    "octopus",
    "penguin",
    "quality",
    "rainbow",
    "science",
    "thunder",
    "uniform",
    "village",
    "warrior",
    "crystal",
    "dolphin",
    "eclipse",
    "falcon",
    "glacier",
    "horizon",
    "ignite",
    "jasmine",
    "kangaroo",
    "leopard",
    "mineral",
    "neutron",
    "orchids",
    "phoenix",
    "quantum",
    "raccoon",
    "sapphire",
    "tornado",
    "unicorn",
    "volcano",
    "walrus",
    "xylophone",
    "yogurt",
    "zephyr",
    "bamboo",
    "cascade",
    "dazzle",
    "emerald",
    "flamingo",
    "gazelle",
    "harvest",
    "impulse",
    "jaguar",
    "koala",
    "lantern",
    "mammoth",
    "nebula",
    "ocelot",
    "panther",
    "quasar",
    "reptile",
    "scarlet",
    "textile",
    "upgrade",
    "velvet",
    "whisper",
    "yonder",
    "zenith",
  ],
  hard: [
    "adventure",
    "beautiful",
    "challenge",
    "discovery",
    "education",
    "fountain",
    "grateful",
    "heritage",
    "industry",
    "junction",
    "knowledge",
    "language",
    "mountain",
    "navigate",
    "obstacle",
    "paradise",
    "question",
    "resource",
    "schedule",
    "treasure",
    "universe",
    "valuable",
    "warranty",
    "abstract",
    "backbone",
    "calendar",
    "database",
    "elephant",
    "festival",
    "geometry",
    "harmonic",
    "infinite",
    "judgment",
    "keyboard",
    "leverage",
    "magnetic",
    "nitrogen",
    "operator",
    "platinum",
    "quadrant",
    "relative",
    "sequence",
    "terminal",
    "ultimate",
    "vacation",
    "wavelength",
    "yearbook",
    "zoology",
    "academic",
    "baseline",
    "capacity",
    "deadline",
    "engineer",
    "feedback",
    "graphics",
    "hardware",
    "imperial",
    "junction",
    "kinetics",
    "leverage",
    "molecule",
    "notebook",
    "optimize",
    "protocol",
    "quantity",
    "research",
    "software",
    "template",
    "upgrade",
    "validate",
    "wireless",
    "accelerate",
    "benchmark",
    "calculate",
    "dashboard",
    "elaborate",
    "framework",
    "generate",
    "highlight",
    "implement",
    "junction",
    "keyboard",
    "landscape",
    "mechanism",
    "normalize",
    "optimize",
    "parameter",
    "qualified",
    "reference",
    "structure",
    "technical",
    "underline",
    "validate",
    "workshop",
    "architect",
    "blueprint",
    "component",
    "developer",
    "ecosystem",
    "frequency",
    "generator",
    "hierarchy",
    "interface",
    "knowledge",
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

// Get random word based on level
const getRandomWord = (level: number) => {
  let pool;
  if (level <= 2) pool = wordPools.easy;
  else if (level <= 4) pool = wordPools.medium;
  else pool = wordPools.hard;

  return pool[Math.floor(Math.random() * pool.length)];
};

const WordScrambleGame = () => {
  const { updateGameStats } = useGame();
  const [scrambledWord, setScrambledWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [ previousScrambled, setPreviousScrambled ] = useState( "" ); // Add this state
  
  const inputRef = useRef<HTMLInputElement>( null );

  const handleLevelProgression = () => {
    const settings = getGameSettings(level);

    // Check if we should increase level
    if (
      correctStreak >= settings.correctStreakLimit &&
      level < settings.maxLevel
    ) {
      updateGameStats({ level: level + 1 }, "set");
      setLevel((prev) => prev + 1);
      setCorrectStreak(0);
      setWrongStreak(0);
      return true;
    }

    // Check if we should decrease level
    if (wrongStreak >= settings.wrongStreakLimit && level > settings.minLevel) {
      updateGameStats({ level: level - 1 }, "set");
      setLevel((prev) => prev - 1);
      setCorrectStreak(0);
      setWrongStreak(0);
      return true;
    }

    return false;
  };

  const calculateScore = (isCorrect: boolean) => {
    const settings = getGameSettings(level);
    if (isCorrect) {
      // Base points * level multiplier
      return settings.basePoints * settings.levelMultiplier;
    }
    return 0;
  };

  // Scramble the word
  const scrambleWord = (word: string) => {
    const arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
  };

  const generateNewWord = () => {
    const newWord = getRandomWord(level);
    setCurrentWord(newWord);

    let scrambled = scrambleWord(newWord);

    // Keep generating new scrambled versions until we get one that's
    // different from both the original word and the previous scrambled version
    while (scrambled === newWord || scrambled === previousScrambled) {
      scrambled = scrambleWord(newWord);
    }

    setPreviousScrambled(scrambled);
    setScrambledWord(scrambled);
    setUserInput( "" );
    updateGameStats( { totalQuestions: 1 } );
    // focus on input so user can type without clicking on input
    inputRef.current && inputRef.current.focus();
  };

  // Initialize game
  useEffect(() => {
    generateNewWord();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value.toLowerCase());
  };

  // Handle submission
  const handleSubmit = () => {
    const isCorrect = userInput.replace(' ', "") === currentWord;
    const scoreChange = calculateScore(isCorrect);

    if (isCorrect) {
      updateGameStats({
        score: scoreChange,
        totalCorrect: 1,
      });
      setFeedback("Good!");
      setScore((prev) => Math.max(0, prev + scoreChange));
      setCorrectStreak((prev) => prev + 1);
      setWrongStreak(0);
    } else {
      setFeedback("Wrong!");
      setScore((prev) => Math.max(0, prev + scoreChange));
      setWrongStreak((prev) => prev + 1);
      setCorrectStreak(0);
    }

    // Check for level changes
    const levelChanged = handleLevelProgression();

    setTimeout(() => {
      setFeedback("");
      generateNewWord();
      setUserInput("");
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen md:p-8 select-none">
      <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
        {/* Scrambled Word Display */}
        <motion.div
          key={scrambledWord}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="flex justify-center mb-12"
        >
          <div className="border-4 border-orange-500 rounded-lg w-full py-8 flex items-center justify-center">
            <div className="text-6xl font-bold text-orange-500 tracking-wider">
              {scrambledWord}
            </div>
          </div>
        </motion.div>

        {/* Input Field */}
        <div className="flex flex-col md:flex-row gap-4 w-full px-4 sm:px-0">
          <motion.input
            type="text"
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 text-lg sm:text-2xl rounded-md border-2 border-orange-500 
             focus:outline-none focus:border-orange-600"
            placeholder="Type your answer..."
            whileFocus={{ scale: 1.02 }}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          />
          <motion.button
            onClick={handleSubmit}
            className={`${bgColor} w-full sm:w-auto px-6 sm:px-4 py-3 sm:py-4 text-lg sm:text-2xl text-white rounded-md`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit
          </motion.button>
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
    </div>
  );
};

export default WordScrambleGame;
