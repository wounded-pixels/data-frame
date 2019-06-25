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

  expect(buckets[5] / 10000).toBeCloseTo(SAMPLE_SIZE / 30000, 0);
  expect(buckets[6] / 10000).toBeCloseTo(SAMPLE_SIZE / 30000, 0);
  expect(buckets[7] / 10000).toBeCloseTo(SAMPLE_SIZE / 30000, 0);
});

function validateBetween(low: number, high: number, scale = 1) {
  const SAMPLE_SIZE = 1e4;

  const values = [];
  for (let ctr = 0; ctr < SAMPLE_SIZE; ctr++) {
    values.push(randomBetween(low, high));
  }

  const sum = values.reduce((previous: number, current: number) => {
    return previous + current;
  }, 0);

  const mean = sum / SAMPLE_SIZE;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const expectedMean = low + (high - low) / 2;

  expect(mean / scale).toBeCloseTo(expectedMean / scale, 0);
  expect(min).toBeCloseTo(low, 0);
  expect(max).toBeCloseTo(high, 0);
}

test('0.555 to 0.556', () => {
  validateBetween(0.555, 0.556);
});

test('-10 to 10', () => {
  validateBetween(-10, 10);
});

test('-5 to 500', () => {
  validateBetween(-5, 500, 10);
});
