import { CategoricalColumn } from './CategoricalColumn';

const column = new CategoricalColumn('make', [
  'honda',
  'honda',
  'chevy',
  'subaru',
  'chevy',
]);

test('basics', () => {
  expect(column.length()).toEqual(5);
  expect(column.name()).toEqual('make');
  expect(column.categories().join()).toEqual('chevy,honda,subaru');
  expect(column.values().join()).toEqual('honda,honda,chevy,subaru,chevy');
});

test('from indexes', () => {
  const firstFirstLast = column.fromRowIndexes([0, 0, 4]);
  expect(firstFirstLast.values().join()).toEqual('honda,honda,chevy');
});

test('sparse', () => {
  const sparseColumn = new CategoricalColumn('sparse', [
    'red',
    'blue',
    null,
    'red',
  ]);

  expect(sparseColumn.values().join()).toEqual('red,blue,,red');
  expect(sparseColumn.values()[2]).toBeNull();

  const firstThirdFourth = sparseColumn.fromRowIndexes([0, 2, 3]);
  expect(firstThirdFourth.values().join()).toEqual('red,,red');
});

test('parse from strings small', () => {
  const raw = [
    'red',
    'blue',
    '',
    'red',
    null,
    'green',
    'red',
    undefined,
    'blue',
  ];
  const column = CategoricalColumn.parse('from raw', raw);
  expect(column.values().join()).toEqual('red,blue,,red,,green,red,,blue');
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

test('no percentile', () => {
  expect(() => {
    column.percentile(0.5);
  }).toThrow(Error);
});

test('no median', () => {
  expect(() => {
    column.median();
  }).toThrow(Error);
});
