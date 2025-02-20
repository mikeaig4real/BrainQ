
export const wordCategories = {
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

export interface GameSettings {
  correctStreakLimit: number;
  wrongStreakLimit: number;
  basePoints: number;
  levelMultiplier: number;
  maxLevel: number;
  minLevel: number;
  lives: number;
  timeLimit: number;
  hintCount: number; // Add this new property
}

export interface GameState {
  lives: number;
  totalLives: number;
  selectedWord: string;
  currentCategory: string;
  guessedLetters: string[];
  feedback: string;
  level: number;
  correctStreak: number;
  wrongStreak: number;
  usedWords: Set<string>;
  gameInitialized: boolean;
  isWordComplete: boolean;
  remainingHints: number;
  revealedHints: number[];
}

export const getGameSettings = (level: number): GameSettings => {
  return {
    correctStreakLimit: 3,
    wrongStreakLimit: 2,
    basePoints: 1,
    levelMultiplier: level,
    maxLevel: 6,
    minLevel: 1,
    lives: Math.max(7 - Math.floor(level / 2), 4),
    timeLimit: Math.max(90 - level * 10, 30),
    hintCount: Math.min(2 + Math.floor(level / 2), 5), // Starts at 3, increases with level, caps at 7
  };
};

export const getDifficulty = (level: number): "easy" | "medium" | "hard" => {
  if (level <= 2) return "easy";
  if (level <= 4) return "medium";
  return "hard";
};
