import { DateColumn } from './DateColumn';

const dateColumn = new DateColumn('date', [
  new Date(2019, 0, 1),
  new Date(2018, 11, 31),
  new Date(2016, 0, 1),
  null,
  new Date(2014, 5, 10),
]);

const otherColumn = new DateColumn('date', [
  new Date(2011, 0, 1),
  null,
  new Date(2020, 5, 10),
]);

test('simple', () => {
  expect(dateColumn.length()).toBe(5);
  const firstDate = dateColumn.values()[0] as Date;
  expect(firstDate.getFullYear()).toBe(2019);
});

test('from indexes', () => {
  const firstFirstThird = dateColumn.fromRowIndexes([0, 0, 2]);
  const dateStrings = firstFirstThird
    .values()
    .map(date => (date ? date.toString().substr(0, 15) : null));
  expect(dateStrings.join()).toEqual(
    'Tue Jan 01 2019,Tue Jan 01 2019,Fri Jan 01 2016'
  );
});

test('bind', () => {
  const combinedColumn = dateColumn.bind(otherColumn);
  expect(combinedColumn.length()).toBe(8);
});

test('no categories', () => {
  expect(() => {
    dateColumn.categories();
  }).toThrow(Error);
});

test('no sum', () => {
  expect(() => {
    dateColumn.sum();
  }).toThrow(Error);
});

test('no mean', () => {
  expect(() => {
    dateColumn.mean();
  }).toThrow(Error);
});
