import { randomInt, randomBetween } from './random';

test('random integers', () => {
  const SAMPLE_SIZE = 1e7;
  const buckets: { [key: number]: number } = {};

  for (let ctr = 0; ctr < SAMPLE_SIZE; ctr++) {
    const value = randomInt(5, 7);
    if (!buckets[value]) {
      buckets[value] = 1;
    } else {
      buckets[value] = buckets[value] + 1;
    }
  }

  expect(Object.keys(buckets).length).toBe(3);
  expect(buckets[5] / 10000).toBeCloseTo(SAMPLE_SIZE / 30000, 0);
  expect(buckets[6] / 10000).toBeCloseTo(SAMPLE_SIZE / 30000, 0);
  expect(buckets[7] / 10000).toBeCloseTo(SAMPLE_SIZE / 30000, 0);
});

function validateBetween(low: number, high: number) {
  const SAMPLE_SIZE = 1e6;

  const values = [];
  for (let ctr = 0; ctr < SAMPLE_SIZE; ctr++) {
    values.push(randomBetween(low, high));
  }

  const sum = values.reduce((previous: number, current: number) => {
    return previous + current;
  }, 0);

  const mean = sum / SAMPLE_SIZE;
  const min = values.reduce(
    (previous, current) => Math.min(previous, current),
    Number.MAX_VALUE
  );
  const max = values.reduce(
    (previous, current) => Math.max(previous, current),
    Number.MIN_VALUE
  );
  const expectedMean = low + (high - low) / 2;

  expect(mean).toBeCloseTo(expectedMean, 0);
  expect(min).toBeCloseTo(low, 2);
  expect(max).toBeCloseTo(high, 2);
  expect(min).toBeGreaterThanOrEqual(low);
  expect(max).toBeLessThanOrEqual(high);
}

test('0.555 to 0.556', () => {
  validateBetween(0.555, 0.556);
});

test('-10 to 10', () => {
  validateBetween(-10, 10);
});

test('-5 to 500', () => {
  validateBetween(-5, 500);
});
