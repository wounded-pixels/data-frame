import { TextColumn } from '../../data-frame';

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
  expect(() => {
    column.categories();
  }).toThrow(Error);
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
