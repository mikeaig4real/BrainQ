import { FaSquare, FaCircle, FaStar, FaHeart } from "react-icons/fa";
import { BsFillTriangleFill as FaTriangle } from "react-icons/bs";

export const bgColor = "bg-yellow-500";

export type Pattern = NumberPattern | IconPattern | MixedPattern;

export interface LevelTemplate {
  patterns: Pattern[];
}

export interface NumberPattern {
  type: "number";
  sequence: number[];
  answer: number;
  patternType: string;
}

export interface IconPattern {
  type: "icon";
  sequence: string[];
  answer: string;
  patternType: string;
}

export interface MixedPattern {
  type: "mixed";
  sequence: (string | number)[];
  answer: string | number;
  patternType: string;
}

// Available icons mapped to components
export const ICONS = {
  square: FaSquare,
  circle: FaCircle,
  triangle: FaTriangle,
  star: FaStar,
  heart: FaHeart,
} as const;

// Number Pattern Generator
export const generateNumberPattern = (
  valueRange: { min: number; max: number },
  length: number
) => {
  const patternTypes = [
    "arithmetic", // Numbers increasing by a constant (e.g., 2,4,6,8)
    "geometric", // Numbers multiplied by a constant (e.g., 2,4,8,16)
    "fibonacci", // Each number is sum of previous two (e.g., 1,1,2,3,5)
    "square", // Square numbers (e.g., 1,4,9,16)
    "power", // Powers of a base number (e.g., 2,4,8,16 or 3,9,27,81)
  ];

  const patternType =
    patternTypes[Math.floor(Math.random() * patternTypes.length)];
  const sequence: number[] = [];

  switch (patternType) {
    case "arithmetic": {
      const step =
        Math.floor(
          (Math.random() * (valueRange.max - valueRange.min)) / length
        ) + 1;
      const start =
        Math.floor(Math.random() * (valueRange.max - step * length)) +
        valueRange.min;
      sequence.push(start);
      for (let i = 1; i < length; i++) {
        sequence.push(sequence[i - 1] + step);
      }
      return {
        type: "number",
        sequence,
        answer: sequence[length - 1] + step,
        patternType,
      };
    }

    case "geometric": {
      const ratio = Math.floor(Math.random() * 3) + 2; // multiplier between 2 and 4
      const start = Math.floor(Math.random() * 5) + 1; // start between 1 and 5
      sequence.push(start);
      for (let i = 1; i < length; i++) {
        sequence.push(sequence[i - 1] * ratio);
      }
      return {
        type: "number",
        sequence,
        answer: sequence[length - 1] * ratio,
        patternType,
      };
    }

    case "fibonacci": {
      if (length < 2) sequence.push(1);
      else {
        sequence.push(1, 1);
        for (let i = 2; i < length; i++) {
          sequence.push(sequence[i - 1] + sequence[i - 2]);
        }
      }
      return {
        type: "number",
        sequence,
        answer: sequence[length - 1] + sequence[length - 2],
        patternType,
      };
    }

    case "square": {
      const start = Math.floor(Math.random() * 3) + 1; // Start with 1, 2, or 3
      for (let i = 0; i < length; i++) {
        sequence.push((start + i) * (start + i));
      }
      return {
        type: "number",
        sequence,
        answer: (start + length) * (start + length),
        patternType,
      };
    }

    case "power": {
      const base = Math.floor(Math.random() * 2) + 2; // Base of 2 or 3
      for (let i = 1; i <= length; i++) {
        sequence.push(Math.pow(base, i));
      }
      return {
        type: "number",
        sequence,
        answer: Math.pow(base, length + 1),
        patternType,
      };
    }

    default: {
      // Fallback to arithmetic progression
      const step = 2;
      const start = Math.floor(Math.random() * 5) + 1;
      sequence.push(start);
      for (let i = 1; i < length; i++) {
        sequence.push(sequence[i - 1] + step);
      }
      return {
        type: "number",
        sequence,
        answer: sequence[length - 1] + step,
        patternType,
      };
    }
  }
};

// Improved Icon Pattern Generator
export const generateIconPattern = (icons: string[], length: number) => {
  // Define clear pattern types
  const patternTypes = [
    "sequence",
    "alternate",
    "accumulate",
    "binary", // New pattern type
  ];

  const patternType =
    patternTypes[Math.floor(Math.random() * patternTypes.length)];
  const sequence: string[] = [];

  switch (patternType) {
    case "binary": {
      // Select two icons to represent 1 and 0
      const oneIcon = icons[Math.floor(Math.random() * icons.length)];
      const zeroIcon = icons.filter((i) => i !== oneIcon)[
        Math.floor(Math.random() * (icons.length - 1))
      ];

      // Create binary patterns like:
      // 1. counting up: 001, 010, 011, 100
      // 2. shifting: 100, 010, 001, 000
      // 3. alternating: 101, 110, 111
      const binaryPatternTypes = ["counting", "shifting", "alternating"];
      const binaryType =
        binaryPatternTypes[
          Math.floor(Math.random() * binaryPatternTypes.length)
        ];

      switch (binaryType) {
        case "counting": {
          for (let i = 0; i < length; i++) {
            const binary = i.toString(2).padStart(3, "0");
            const shapes = binary
              .split("")
              .map((bit) => (bit === "1" ? oneIcon : zeroIcon))
              .join(",");
            sequence.push(shapes);
          }
          const nextNum = length.toString(2).padStart(3, "0");
          const answer = nextNum
            .split("")
            .map((bit) => (bit === "1" ? oneIcon : zeroIcon))
            .join(",");
          return { type: "icon" as const, sequence, answer, patternType };
        }

        case "shifting": {
          const shiftBits = "1000";
          for (let i = 0; i < length; i++) {
            const shifted = shiftBits.slice(i) + shiftBits.slice(0, i);
            const shapes = shifted
              .slice(0, 3)
              .split("")
              .map((bit) => (bit === "1" ? oneIcon : zeroIcon))
              .join(",");
            sequence.push(shapes);
          }
          const nextShift =
            shiftBits.slice(length) + shiftBits.slice(0, length);
          const answer = nextShift
            .slice(0, 3)
            .split("")
            .map((bit) => (bit === "1" ? oneIcon : zeroIcon))
            .join(",");
          return { type: "icon" as const, sequence, answer, patternType };
        }

        case "alternating": {
          for (let i = 0; i < length; i++) {
            const pattern = i % 2 === 0 ? "101" : "110";
            const shapes = pattern
              .split("")
              .map((bit) => (bit === "1" ? oneIcon : zeroIcon))
              .join(",");
            sequence.push(shapes);
          }
          const answer = (length % 2 === 0 ? "101" : "110")
            .split("")
            .map((bit) => (bit === "1" ? oneIcon : zeroIcon))
            .join(",");
          return { type: "icon" as const, sequence, answer, patternType };
        }
      }
    }
    case "sequence":
      // Create a repeating sequence like: square, triangle, circle, square, triangle, circle
      const sequenceLength = 2 + Math.floor(Math.random() * 2); // 2-3 icons in sequence
      const baseSequence = icons
        .sort(() => Math.random() - 0.5)
        .slice(0, sequenceLength);

      for (let i = 0; i < length; i++) {
        sequence.push(baseSequence[i % baseSequence.length]);
      }
      return {
        type: "icon" as const,
        sequence,
        answer: baseSequence[length % baseSequence.length],
        patternType,
      };

    case "alternate":
      // Simple alternating pattern: square, circle, square, circle
      const icon1 = icons[Math.floor(Math.random() * icons.length)];
      const icon2 = icons.filter((i) => i !== icon1)[
        Math.floor(Math.random() * (icons.length - 1))
      ];
      for (let i = 0; i < length; i++) {
        sequence.push(i % 2 === 0 ? icon1 : icon2);
      }
      return {
        type: "icon" as const,
        sequence,
        answer: length % 2 === 0 ? icon1 : icon2,
        patternType,
      };

    case "accumulate":
      // Pattern that adds one more icon each time: □, □□, □□□
      const baseIcon = icons[Math.floor(Math.random() * icons.length)];
      for (let i = 1; i <= length; i++) {
        sequence.push(Array(i).fill(baseIcon).join(","));
      }
      return {
        type: "icon" as const,
        sequence,
        patternType,
        answer: Array(length + 1)
          .fill(baseIcon)
          .join(","),
      };
  }
};

// Improved Mixed Pattern Generator
export const generateMixedPattern = (
  valueRange: { min: number; max: number },
  icons: string[],
  length: number
) => {
  // Create patterns that alternate between numbers and icons with a rule
  const patternTypes = [
    "numberThenIcon", // Number followed by its count in icons
    "iconThenDouble", // Icon followed by doubled number
  ];

  const patternType =
    patternTypes[Math.floor(Math.random() * patternTypes.length)];
  const sequence: (string | number)[] = [];
  let answer: string | number;

  switch (patternType) {
    case "numberThenIcon": {
      // Pattern like: 2, □□, 3, □□□, (answer should be 4)
      const icon = icons[Math.floor(Math.random() * icons.length)];
      for (let i = 0; i < length - 1; i += 2) {
        const num = i / 2 + 2;
        sequence.push(num);
        sequence.push(Array(num).fill(icon).join(","));
      }
      // Changed to return next number in sequence (previous + 1)
      const lastNum = sequence[sequence.length - 2] as number; // Get the last number in sequence
      answer = lastNum + 1; // Simply add 1 to the last number
      break;
    }

    case "iconThenDouble": {
      // Pattern like: □, 2, □□, 4, (answer should be □□□□)
      const icon = icons[Math.floor(Math.random() * icons.length)];
      let num = 1;
      for (let i = 0; i < length - 1; i += 2) {
        const iconCount = Math.floor(i / 2) + 1;
        sequence.push(Array(iconCount).fill(icon).join(","));
        sequence.push((num *= 2));
      }
      const lastIconCount = Math.floor((length - 1) / 2) + 1;
      const nextIconCount = lastIconCount * 2;
      answer = Array(nextIconCount).fill(icon).join(",");
      break;
    }
    default: {
      answer = "";
      break;
    }
  }

  return { type: "mixed", sequence, answer, patternType };
};

export interface GameSettings {
  correctStreakLimit: number;
  wrongStreakLimit: number;
  pointsPerCorrect: number;
  feedbackDuration: number;
}

export const generatePattern = (
  level: number,
  icons: string[],
  valueRange: { min: number; max: number },
  sequenceLength: number
): any => {
  // Choose the type of pattern randomly or based on level
  const types: ("number" | "icon" | "mixed")[] = ["number", "icon", "mixed"];
  const type = types[Math.floor(Math.random() * types.length)];

  switch (type) {
    case "number":
      return generateNumberPattern(valueRange, sequenceLength);
    case "icon":
      return generateIconPattern(icons, sequenceLength);
    case "mixed":
      return generateMixedPattern(valueRange, icons, sequenceLength);
    default:
      throw new Error("Unsupported pattern type");
  }
};

export const getGameSettings = (): GameSettings => ({
  correctStreakLimit: 3,
  wrongStreakLimit: 2,
  pointsPerCorrect: 1,
  feedbackDuration: 2000,
});

export interface GameState {
  level: number;
  currentPattern: Pattern | null;
  options: (string | number)[];
  feedback: string;
  correctStreak: number;
  wrongStreak: number;
  isTransitioning: boolean;
}

export // Helper function to generate options
  const generateOptions = (
    answer: string | number,
    sequence: (string | number)[],
    patternType?: string
  ) => {
    const options = [answer];
    const count = 3; // Number of incorrect options

    if (typeof answer === "number") {
      while (options.length <= count) {
        const option =
          answer +
          Math.floor(Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1);
        if (!options.includes(option)) options.push(option);
      }
    } else {
      const iconKeys = Object.keys(ICONS);
      // Get the length of icons in the answer
      const answerLength = answer.split(",").length;

      while (options.length <= count) {
        // Generate wrong options with the same length as answer
        const randomIcons = Array.from(
          { length: answerLength },
          () => iconKeys[Math.floor(Math.random() * iconKeys.length)]
        ).join(",");

        // Only add if it's not already in options
        if (!options.includes(randomIcons)) {
          options.push(randomIcons);
        }
      }
    }

    // Shuffle the options
    return options.sort(() => Math.random() - 0.5);
  };