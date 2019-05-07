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
  const firstFirstLast = column.fromRowIndexes([0, 0, 2]);
  expect(firstFirstLast.values().join()).toEqual('62,62,55');
});

test('sparse - mean should ignore nulls', () => {
  const sparseColumn = new NumericalColumn('sparse', [1, 2, null, 5, 7, 1, 1]);
  expect(sparseColumn.mean()).toBe((1 + 2 + 5 + 7 + 1 + 1) / 6);
  expect(sparseColumn.values().join()).toEqual('1,2,,5,7,1,1');
});

test('from strings', () => {
  const raw = ['1', '1.12', '', '1e2', null, 5, 'a', , '4'];
  const column = NumericalColumn.parse('from raw', raw) as NumericalColumn;
  expect(column.mean()).toBe((1 + 1.12 + 100 + 5 + 4) / 5);
  expect(column.values()[2]).toBeNull();
});

test('from strings with lots of nulls', () => {
  const raw = ['1', '', '', undefined, null, 5, 'a', '4'];
  const column = NumericalColumn.parse('from raw', raw) as NumericalColumn;
  expect(column.mean()).toBe((1 + 5 + 4) / 3);
  expect(column.values()[2]).toBeNull();
});

test('from strings with less than 80% of defined values being parsable', () => {
  const raw = ['1', '2', '3', '4', '5', '6', 7, 8, 'a', 'b', 'c'];
  const column = NumericalColumn.parse('from raw', raw);
  expect(column).toBeNull();
});

test('from strings with 80% of defined values being parsable', () => {
  const raw = ['1', '2', '3', '4', '5', '6', 7, 8, 'a', 'b', null, null];
  const column = NumericalColumn.parse('from raw', raw) as NumericalColumn;
  expect(column.mean()).toBe(36 / 8);
});

test('override of permissible ', () => {
  const raw = ['1', '2', '3', '4', '5', '6', 7, 8, 'a', 'b', null, null];
  const column = NumericalColumn.parse('from raw', raw, 0.7) as NumericalColumn;
  expect(column.mean()).toBe(36 / 8);
});

test('basic descriptive stats', () => {
  const values = [1, 5, 2, 8, 9, 3, 4, 7, 6];
  const column = new NumericalColumn('digits', values);
  expect(column.min()).toBe(1);
  expect(column.max()).toBe(9);

  expect(column.percentile(0.25)).toBe(3);
  expect(column.percentile(0.5)).toBe(5);
  expect(column.median()).toBe(5);
  expect(column.percentile(0.75)).toBe(7);
});

test('compare with Numpy', () => {
  const values = [1, 5, 9, 12, 13, 14, 20, 21, 23];
  const column = new NumericalColumn('values', values);
  expect(column.percentile(0.25)).toBe(9);
  expect(column.percentile(0.5)).toBe(13);
  expect(column.percentile(0.75)).toBe(20);
});

test('empty', () => {
  const empty = new NumericalColumn('empty', []);

  expect(empty.min()).toBeNull();
  expect(empty.percentile(0.5)).toBeNull();
  expect(empty.max()).toBeNull();
});

test('no categories', () => {
  const call = () => {
    column.categories();
  };

  expect(call).toThrow(Error);
});
