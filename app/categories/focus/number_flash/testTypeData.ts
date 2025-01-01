export interface FlashingNumbersQuestion {
  sequence: number[];
  options: number[][];
  correctOptionIndex: number;
}

export const bgColor = "bg-green-500";

export const getGameSettings = (level: number) => {
  return {
    correctStreakLimit: 3,
    wrongStreakLimit: 2,
    basePoints: 1,
    levelMultiplier: level,
    maxLevel: 6,
    minLevel: 1,
    sequenceLength: Math.min(4 + Math.floor(level / 2), 8), // 4 to 8 numbers
    numberVariation: Math.max(4 - Math.floor(level / 2), 1), // Difference between options (3 to 1)
    displayTime: Math.max(1200 - level * 100, 600), // Display time decreases with level
    optionsCount: 4, // Constant number of options
  };
};

export const generateSequence = (length: number): number[] =>
    Array.from( { length }, () => Math.floor( Math.random() * 10 ) );

export const generateOptions = (
    correctSequence: number[],
    settings: ReturnType<typeof getGameSettings>,
    lastCorrectIndex?: number // Add parameter to track last correct position
  ): { options: number[][]; correctOptionIndex: number } => {
    const options = [correctSequence];

    // Generate wrong options
    while (options.length < settings.optionsCount) {
      const newOption = [...correctSequence];
      const numChanges = Math.ceil(Math.random() * 2);

      for (let i = 0; i < numChanges; i++) {
        const changeIndex = Math.floor(Math.random() * correctSequence.length);
        const currentNum = newOption[changeIndex];
        let newNum;

        do {
          const variation =
            Math.floor(Math.random() * settings.numberVariation) + 1;
          newNum =
            (currentNum + (Math.random() < 0.5 ? variation : -variation) + 10) %
            10;
        } while (newNum === currentNum);

        newOption[changeIndex] = newNum;
      }

      if (!options.some((opt) => opt.join("") === newOption.join(""))) {
        options.push(newOption);
      }
    }

    // Keep shuffling until correct answer is in a different position
    let shuffledOptions;
    let correctOptionIndex;
    do {
      shuffledOptions = options.sort(() => Math.random() - 0.5);
      correctOptionIndex = shuffledOptions.indexOf(correctSequence);
    } while (
      lastCorrectIndex !== undefined &&
      correctOptionIndex === lastCorrectIndex
    );

    return { options: shuffledOptions, correctOptionIndex };
  };