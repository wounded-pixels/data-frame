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

  const minDate = dateColumn.min() as Date;
  expect(minDate.getFullYear()).toBe(2014);

  const maxDate = dateColumn.max() as Date;
  expect(maxDate.getFullYear()).toBe(2019);
});

test('from strings', () => {
  const raw = [
    '02/01/1977',
    '03/12/2020',
    '02/10/1901',
    '02/01/1801',
    '',
    '',
    null,
    1,
    '',
    undefined,
    '12/31/1990',
  ];
  const parsed = DateColumn.parse('parsed', raw, 'MM/DD/YYYY') as DateColumn;
  expect(parsed.length()).toBe(11);

  const firstDate = parsed.values()[0];
  expect(firstDate).toEqual(new Date(1977, 1, 1));
});

test('from strings with less than 80% of defined values being parsable', () => {
  const raw = ['01/01/1999', 'b', 'c'];
  const column = DateColumn.parse('from raw', raw, 'MM/DD/YYYY');
  expect(column).toBeNull();
});

test('from strings with less than 80% of defined values being parsable. Override', () => {
  const raw = ['01/01/1999', 'b', 'c'];
  const column = DateColumn.parse(
    'from raw',
    raw,
    'MM/DD/YYYY',
    0.3
  ) as DateColumn;
  expect(column.length()).toBe(3);
});

test('from strings, standard formats', () => {
  const raw = ['03/06/2011', '1/1/1999', ''];
  const column = DateColumn.parse('from raw', raw) as DateColumn;
  expect(column.length()).toBe(3);
  const firstDate = column.values()[0] as Date;
  expect(firstDate.getFullYear()).toBe(2011);
});

test('from indexes', () => {
  const firstFirstThird = dateColumn.fromRowIndexes([0, 0, 2]);
  const dateStrings = firstFirstThird
    .values()
    .map(date => (date ? date.toString().substr(0, 15) : null));
  expect(dateStrings.join()).toEqual(
    'Tue Jan 01 2019,Tue Jan 01 2019,Fri Jan 01 2016'
  );
  const medianDate = firstFirstThird.percentile(0.5) as Date;
  expect(medianDate.toString().substr(0, 15)).toBe('Tue Jan 01 2019');
  expect(firstFirstThird.median()).toEqual(medianDate);
});

test('bind', () => {
  const combinedColumn = dateColumn.bind(otherColumn);
  expect(combinedColumn.length()).toBe(8);
});

test('empty', () => {
  const emptyDateColumn = new DateColumn('empty', [null, null, null]);
  expect(emptyDateColumn.min()).toBeNull();
  expect(emptyDateColumn.max()).toBeNull();
  expect(emptyDateColumn.percentile(0.5)).toBeNull();
  expect(emptyDateColumn.median()).toBeNull();
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
