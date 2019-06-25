/**
 * returns a number in the half open interval [min, max)
 * @param min
 * @param max
 */
export const randomBetween = (min: number, max: number): number => {
  return min + (max - min) * Math.random();
};

/**
 * returns an integer in the closed set [min, min+1, ..., max]
 * @param min
 * @param max
 */
export const randomInt = (min: number, max: number): number => {
  const decimal = randomBetween(min - 0.5, max + 0.5);
  return Math.round(decimal);
};
