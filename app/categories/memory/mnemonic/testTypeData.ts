
export interface MnemonicGameProps {
  initialLevel?: number;
}

export const GROUP_COLORS: { [key: string]: string } = {
  red: "#FF4444",
  green: "#44AA44",
  yellow: "#FFAA00",
  purple: "#AA44AA",
  blue: "#4444FF",
  orange: "#FF8844",
};

export const bgColor = "bg-blue-500";

// Define type for word pool categories
export type WordPoolCategory = keyof typeof wordPools;

// Define word pools with proper typing
export const wordPools = {
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

export const getRandomGroupColor = (usedColor?: string) => {
  const colors = Object.keys(GROUP_COLORS).filter(
    (color) => color !== usedColor
  );
  return colors[Math.floor(Math.random() * colors.length)];
};

export const generateWordGroups = (level: number) => {
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

export const getGameSettings = (level: number) => {
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

export type WordData = {
  [key: string]: any;
};