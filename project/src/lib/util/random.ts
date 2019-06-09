export const randomBetween = (min: number, max: number): number => {
  return min + (max - min) * Math.random();
};

/**
 * returns an integer in the closed set [min, max]
 */
export const randomInt = (min: number, max: number): number => {
  const decimal = randomBetween(Math.floor(min), Math.floor(max) + 0.99999999);
  return Math.floor(decimal);
};
