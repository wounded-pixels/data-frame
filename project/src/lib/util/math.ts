export const clamp = (min: number, max: number, inputValue: number): number => {
  return Math.max(min, Math.min(max, inputValue));
};

export const percentile = (
  rawRatio: number,
  sortedValues: number[]
): number => {
  const ratio = clamp(0, 1, rawRatio);
  const indexDecimal = (sortedValues.length - 1) * ratio;
  const index = clamp(0, sortedValues.length - 1, Math.ceil(indexDecimal));
  return sortedValues[index];
};
