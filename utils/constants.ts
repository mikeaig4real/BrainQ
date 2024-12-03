import { PiMathOperationsFill as MathIcon } from "react-icons/pi";
import { FaBrain as MemoryIcon } from "react-icons/fa6";
import { BsFillStopwatchFill as ReactionIcon } from "react-icons/bs";
import { FaEye as FocusIcon } from "react-icons/fa6";
import { ImSpellCheck as WordsIcon } from "react-icons/im";
import { TbManualGearboxFilled as LogicIcon } from "react-icons/tb";


export const categories = [
  { 
    id: 1,
    icon: MemoryIcon, 
    label: "memory",
    description: "TEST AND IMPROVE YOUR MEMORY SKILLS THROUGH SEQUENCE AND SHAPE RECOGNITION",
    bgColor: "bg-blue-500",
    tests: [
      {
        id: 1,
        label: "mnemonic",
        description: "FIND THE WORD(S) COMMON TO THE TWO DISPLAYED GROUPS."
      },
      {
        id: 2,
        label: "sequence", 
        description: "REMEMBER AND REPRODUCE THE SEQUENCE OF ITEM"
      },
      {
        id: 3,
        label: "shapes",
        description: "MEMORIZE AND RECALL GEOMETRIC SHAPES AND PATTERNS"
      }
    ]
  },
  {
    id: 2,
    icon: MathIcon, 
    label: "math",
    description: "CHALLENGE YOUR MATHEMATICAL ABILITIES WITH EQUATIONS AND FRACTIONS",
    bgColor: "bg-red-500",
    tests: [
      {
        id: 1,
        label: "arithmetic",
        description: "IDENTIFY THE OPERATOR OR NUMBER NEEDED TO COMPLETE EACH EQUATION"
      },
      {
        id: 2,
        label: "chips",
        description: "CLICK ON THE GROUP OF CHIPS THAT ARE WORTH MORE"
      }
    ]
  },
  { 
    id: 3,
    icon: LogicIcon, 
    label: "logic",
    description: "DEVELOP LOGICAL THINKING THROUGH PATTERN RECOGNITION AND BOOLEAN REASONING",
    bgColor: "bg-yellow-500",
    tests: [
      {
        id: 1,
        label: "true_or_false",
        description: "EVALUATE LOGICAL STATEMENTS AND MAKE DECISIONS"
      },
      {
        id: 2,
        label: "patterns",
        description: "IDENTIFY AND COMPLETE LOGICAL PATTERNS"
      }
    ]
  },
  { 
    id: 4,
    icon: ReactionIcon, 
    label: "reaction",
    description: "TEST AND IMPROVE YOUR REACTION TIME AND QUICK THINKING ABILITIES",
    bgColor: "bg-purple-500",
    tests: [
      {
        id: 1,
        label: "clock_it",
        description: "QUICKLY STOP THE TIMER AT THE REQUIRED TIME"
      },
      {
        id: 2,
        label: "whack_it",
        description: "QUICKLY CLICK TARGETS AS FAST AS YOU CAN AS THEY APPEAR"
      }
    ]
  },
  { 
    id: 5,
    icon: FocusIcon, 
    label: "focus",
    description: "ENHANCE FOCUS/VISUAL PERCEPTION AND PROCESSING SKILLS",
    bgColor: "bg-green-500",
    tests: [
      {
        id: 1,
        label: "number_flash",
        description: "QUICKLY IDENTIFY FLASHING NUMBERS"
      },
      {
        id: 2,
        label: "rotation",
        description: "TRACK AND IDENTIFY ROTATING OBJECTS"
      }
    ]
  },
  { 
    id: 6,
    icon: WordsIcon, 
    label: "word",
    description: "CHALLENGE YOUR VERBAL AND LANGUAGE PROCESSING ABILITIES",
    bgColor: "bg-orange-500",
    tests: [
      {
        id: 1,
        label: "scramble",
        description: "UNSCRAMBLE JUMBLED LETTERS TO FORM A VALID WORD"
      },
      {
        id: 2,
        label: "search",
        description: "FIND SPECIFIC WORDS IN A COLLECTION"
      }
    ]
  }
];

export type TestType = {
  label: string;
  description: string;
}

export type CategoryType = {
  id: number;
  icon: React.ComponentType;
  label: string;
  description: string;
  bgColor: string;
  tests: TestType[];
}

export type CategoriesType = CategoryType[];