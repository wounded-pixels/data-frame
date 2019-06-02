export const clamp = (min: number, max: number, inputValue: number) => {
  return Math.max(min, Math.min(max, inputValue));
};
