import { OrdinalColumn } from './OrdinalColumn';

const column = new OrdinalColumn(
  'size',
  ['small', 'medium', 'large'],
  ['large', 'large', 'small', 'small', '', null, 'medium']
);

test('basics', () => {
  expect(column.length()).toEqual(7);
  expect(column.name()).toEqual('size');
  expect(column.categories().join()).toEqual('small,medium,large');
  expect(column.values().join()).toEqual('large,large,small,small,,,medium');
  expect(column.percentile(0.0)).toBe('small');
  expect(column.percentile(0.25)).toBe('small');
  expect(column.median()).toBe('medium');
  expect(column.percentile(0.75)).toBe('large');
  expect(column.percentile(1.0)).toBe('large');
});

test('from indexes', () => {
  const firstFirstLast = column.fromRowIndexes([0, 0, 6]);
  expect(firstFirstLast.values().join()).toEqual('large,large,medium');
});

test('parse', () => {
  const rawSizes = [
    'small',
    null,
    undefined,
    'large',
    'hi',
    '',
    'medium',
    'small',
  ];
  const sizes = OrdinalColumn.parse(
    'sizes',
    ['small', 'medium', 'large'],
    rawSizes
  );
  expect(sizes.length()).toBe(8);
  expect(sizes.values().join()).toBe('small,,,large,,,medium,small');
  expect(sizes.median()).toBe('medium');
});

test('empty', () => {
  const empty = new OrdinalColumn('empty', [], []);
  expect(empty.length()).toBe(0);
  expect(empty.values().join()).toBe('');
  expect(empty.median()).toBeNull();
});

test('no mean', () => {
  expect(() => {
    column.mean();
  }).toThrow(Error);
});

test('no sum', () => {
  expect(() => {
    column.sum();
  }).toThrow(Error);
});

test('no min', () => {
  expect(() => {
    column.min();
  }).toThrow(Error);
});

test('no max', () => {
  expect(() => {
    column.max();
  }).toThrow(Error);
});

test('value', () => {
  expect(column.value(0)).toEqual('large');
  expect(column.value(7)).toBeNull();
});
