export const bgColor = "bg-purple-500";

export const getGameSettings = ( level: number ) =>
{
  const precisionRequired = Number(
    Math.max( 1.0 - ( level - 1 ) * 0.2, 0.1 ).toFixed( 1 )
  );
  const maxOvershoot = +(precisionRequired * 1).toFixed(1);
  return {
    correctStreakLimit: 2,
    wrongStreakLimit: 2,
    basePoints: 1,
    levelMultiplier: level,
    maxLevel: 6,
    minLevel: 1,
    // Precision gets stricter as level increases (from 1.0s to 0.0s)
    precisionRequired,
    maxOvershoot, // Constant max overshoot
  };
};