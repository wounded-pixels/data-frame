import {
  parseCSV,
  ParsingHints,
  Type,
  ValueMutator,
  ValuePredicate,
} from '../../data-frame';

const csv = `
 name, height, dob
 Fred, 72, 1/1/1980
 Ted, 60, 2/1/1990
 Red, -10, 1/1/1899
  , 74, 1/1/1999
 `;

test('numeric column mutation', () => {
  const df = parseCSV(csv);
  expect(df.column('height').min()).toBe(-10);

  df.column('height').mutate(
    value => value !== null && (value < 0 || value > 120),
    () => null
  );
  expect(df.column('height').min()).toBe(60);

  df.column('height').mutate(
    value => value !== null,
    value => (value as number) * 2.54
  );
  expect(df.column('height').min()).toBe(60 * 2.54);
});

test('date column mutation', () => {
  const df = parseCSV(csv);
  const earliestBirth = df.column('dob').min() as Date;
  expect(earliestBirth.getFullYear()).toBe(1899);

  const unreasonableDatePredicate: ValuePredicate = value =>
    value !== null && (value as Date).getFullYear() < 1900;
  df.column('dob').mutate(unreasonableDatePredicate, () => null);
  const firstAfter1900 = df.column('dob').min() as Date;
  expect(firstAfter1900.getFullYear()).toBe(1980);

  const addYearMutator: ValueMutator = v => {
    const value = v as Date;
    return new Date(value.getFullYear() + 1, value.getMonth(), value.getDate());
  };

  const previousTedBirth = df.column('dob').value(1) as Date;
  df.column('dob').mutate(value => value !== null, addYearMutator);
  const tedBirth = df.column('dob').value(1) as Date;
  expect(tedBirth.getFullYear()).toBe(previousTedBirth.getFullYear() + 1);
  expect(tedBirth.getMonth()).toBe(previousTedBirth.getMonth());
  expect(tedBirth.getDate()).toBe(previousTedBirth.getDate());
});

test('text column mutation', () => {
  const hints: ParsingHints = { columns: { name: { type: Type.Text } } };
  const df = parseCSV(csv, hints);
  expect(df.column('name').value(0)).toBe('Fred');

  df.column('name').mutate(v => v !== null, v => (v as string).toUpperCase());
  expect(df.column('name').value(0)).toBe('FRED');
});
