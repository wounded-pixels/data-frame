import { clamp } from './math';

test('simple cases', () => {
  expect(clamp(0, 1, -1)).toBe(0);
  expect(clamp(0, 1, 0.5)).toBe(0.5);
  expect(clamp(0, 1, 2)).toBe(1);
  expect(clamp(-1, 1, -1)).toBe(-1);
});
