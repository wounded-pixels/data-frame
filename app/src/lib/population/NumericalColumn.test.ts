import { NumericalColumn } from './NumericalColumn';

const column = new NumericalColumn('numbers', [62, 50, 55]);

test('basics', () => {
  expect(column.length()).toEqual(3);
  expect(column.name()).toEqual('numbers');
  expect(column.sum()).toEqual(167);
  expect(column.mean()).toEqual(167 / 3);
});

test('column values are immutable', () => {
  const copy = column.values();
  expect(copy.join()).toEqual('62,50,55');
  copy[0] = 100;
  expect(copy.join()).toEqual('100,50,55');
  expect(column.values().join()).toEqual('62,50,55');
  expect(column.mean()).toEqual(167 / 3);
});

test('from indexes', () => {
  const firstFirstLast = column.fromIndexes([0, 0, 2]);
  expect(firstFirstLast.values().join()).toEqual('62,62,55');
});
