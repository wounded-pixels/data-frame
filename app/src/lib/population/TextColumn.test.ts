import { TextColumn } from './TextColumn';

const column = new TextColumn('text', [
  'hi there',
  'how are you?',
  'i am fine',
  'thanks',
]);

test('basics', () => {
  expect(column.length()).toEqual(4);
  expect(column.name()).toEqual('text');
});

test('column values are immutable', () => {
  const copy = column.values();
  expect(copy.join()).toEqual('hi there,how are you?,i am fine,thanks');
  copy[0] = 'yo';
  expect(copy.join()).toEqual('yo,how are you?,i am fine,thanks');
  expect(column.values().join()).toEqual(
    'hi there,how are you?,i am fine,thanks'
  );
});

test('from indexes', () => {
  const firstFirstLast = column.fromRowIndexes([0, 0, 3]);
  expect(firstFirstLast.values().join()).toEqual('hi there,hi there,thanks');
});

test('no categories', () => {
  const call = () => {
    column.categories();
  };

  expect(call).toThrow(Error);
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
