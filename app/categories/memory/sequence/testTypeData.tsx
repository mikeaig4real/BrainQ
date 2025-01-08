import {
  FaHeart,
  FaStar,
  FaCircle,
  FaSquare,
  FaCross,
  FaMoon,
  FaSun,
  FaCloud,
} from "react-icons/fa";

export const bgColor = "bg-blue-500";

export interface IconOption {
  id: string;
  icon: React.ReactNode;
}

export interface Sequence {
  pattern: string[];
  displayDuration: number;
  displayInterval: number;
  activeIcons: IconOption[];
}

// All available icons
export const allIconOptions = ( size: string | number | undefined = 32 ): IconOption[] =>
{
  return [
    { id: "heart", icon: <FaHeart size={size} /> },
    { id: "star", icon: <FaStar size={size} /> },
    { id: "circle", icon: <FaCircle size={size} /> },
    { id: "square", icon: <FaSquare size={size} /> },
    { id: "cross", icon: <FaCross size={size} /> },
    { id: "moon", icon: <FaMoon size={size} /> },
    { id: "sun", icon: <FaSun size={size} /> },
    { id: "cloud", icon: <FaCloud size={size} /> },
  ];
};

export const getGameSettings = (level: number) => {
  return {
    correctStreakLimit: 1, // Number of correct sequences needed to level up
    wrongStreakLimit: 2, // Number of wrong attempts before level down
    basePoints: 1, // Base points for each correct sequence
    levelMultiplier: level,
    maxLevel: 6, // Maximum achievable level
    minLevel: 1,
    // Sequence gets longer and faster with level
    sequenceLength: Math.min(4 + Math.floor(level / 2), 8),
    displayDuration: Math.max(1000 - level * 50, 400), // Time each icon is shown
    displayInterval: Math.max(1500 - level * 75, 600), // Time between icons
    // Number of icons increases with level
    numIcons: Math.min(2 + Math.floor(level / 2), allIconOptions().length),
  };
};
export const generatePattern = (
  length: number,
  availableIds: string[]
): string[] => {
  return Array.from(
    { length },
    () => availableIds[Math.floor(Math.random() * availableIds.length)]
  );
};
// Modified getDifficultySettings to use game settings
export const getDifficultySettings = (level: number): Sequence => {
  const settings = getGameSettings(level);
  const currentIcons = allIconOptions().slice(0, settings.numIcons);

  return {
    pattern: generatePattern(
      settings.sequenceLength,
      currentIcons.map((icon) => icon.id)
    ),
    displayDuration: settings.displayDuration,
    displayInterval: settings.displayInterval,
    activeIcons: currentIcons,
  };
};
