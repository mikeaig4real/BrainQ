export interface BouncingBallsQuestion {
  balls: Ball[];
  options: number[];
  correctOptionIndex: number;
}

export interface Ball {
  id: number;
  maxHeight: number;
  color: string;
  initialHeight: number;
}

export const bgColor = "bg-green-500";

export const getGameSettings = ( level: number ) =>
{
  const ballCount = Math.min(4 + Math.floor(level / 2), 8); // 4 to 8 balls
  return {
    correctStreakLimit: 3,
    wrongStreakLimit: 2,
    basePoints: 1,
    levelMultiplier: level,
    maxLevel: 6,
    minLevel: 1,
    ballCount,
    heightVariation: Math.max(100 - level * 10, 20), // Difference between heights decreases with level
    optionsCount: ballCount,
  };
};

  export const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  export const generateBalls = (
    settings: ReturnType<typeof getGameSettings>
  ): Ball[] => {
    const balls: Ball[] = [];
    const baseHeight =
      window.innerWidth < 640
        ? 80
        : window.innerWidth < 768
        ? 110
        : 150 + Math.random() * 100;

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
  
export  const generateOptions = (
    balls: Ball[],
    settings: ReturnType<typeof getGameSettings>,
    lastCorrectIndex?: number
  ): { options: number[]; correctOptionIndex: number } => {
    // Find the ball that bounces the highest
    const highestBall = balls.reduce((prev, current) =>
      current.maxHeight > prev.maxHeight ? current : prev
    );

    // Since we want all balls as options, we can simply use all ball IDs
    const options = balls.map((ball) => ball.id);

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
