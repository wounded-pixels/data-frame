import { clamp, percentile } from './math';
import { NumericalColumn } from '../dataframe/NumericalColumn';

test('simple clamp cases', () => {
  expect(clamp(0, 1, -1)).toBe(0);
  expect(clamp(0, 1, 0.5)).toBe(0.5);
  expect(clamp(0, 1, 2)).toBe(1);
  expect(clamp(-1, 1, -1)).toBe(-1);
});

test('even percentile case', () => {
  const sortedValues = [1, 5, 9, 12, 13, 14, 20, 21, 23, 31];

  expect(percentile(0.01, sortedValues)).toBe(5);
  expect(percentile(0.25, sortedValues)).toBe(12);
  expect(percentile(0.5, sortedValues)).toBe(14);
  expect(percentile(0.75, sortedValues)).toBe(21);
  expect(percentile(0.99, sortedValues)).toBe(31);
});

test('odd percentile case', () => {
  const sortedValues = [1, 5, 9, 12, 13, 14, 20, 21, 23];

  expect(percentile(0.01, sortedValues)).toBe(5);
  expect(percentile(0.25, sortedValues)).toBe(9);
  expect(percentile(0.5, sortedValues)).toBe(13);
  expect(percentile(0.75, sortedValues)).toBe(20);
  expect(percentile(0.99, sortedValues)).toBe(23);
});
