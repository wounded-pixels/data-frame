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
  const firstFirstLast = column.fromIndexes([0, 0, 4]);
  expect(firstFirstLast.values().join()).toEqual('honda,honda,chevy');
});

test('no mean', () => {
  const callMean = () => {
    column.mean();
  };

  expect(callMean).toThrow(Error);
});

test('no sum', () => {
  const callSum = () => {
    column.sum();
  };

  expect(callSum).toThrow(Error);
});
