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
