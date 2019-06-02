import { createRange, removeValue } from './arrays';

test('create range', () => {
  const singles = createRange(0, 10);
  expect(singles.length).toBe(10);
  expect(singles[0]).toBe(0);
  expect(singles[9]).toBe(9);
});

test('create range evens', () => {
  const singles = createRange(0, 10, 2);
  expect(singles.length).toBe(5);
  expect(singles[0]).toBe(0);
  expect(singles[4]).toBe(8);
});

test('remove value', () => {
  const mixed = ['fred', 1, 'a'];
  removeValue(mixed, 'fred');
  expect(mixed.length).toBe(2);

  removeValue(mixed, 'a');
  expect(mixed.length).toBe(1);
  expect(mixed[0]).toBe(1);
});

test('impossible remove', () => {
  const mixed = ['fred', 1, 'a'];
  removeValue(mixed, 'ted');
  expect(mixed.length).toBe(3);
});

test('multiples', () => {
  const mixed = ['fred', 1, 'a', 'fred'];
  removeValue(mixed, 'fred');
  expect(mixed.length).toBe(2);
  expect(mixed.join(',')).toBe('1,a');
});
