import { parseCSV } from '../../data-frame';

const csv = `
 name, height
 Fred, 72
 Ted, 60
 Ned, 
 `;

test('add a converted column', () => {
  const df = parseCSV(csv);
  df.createColumn(
    'height in cm',
    (row: any) => (row.height !== null ? row.height * 2.54 : null),
    {}
  );
  expect(df.column('height in cm').value(1)).toBe(60 * 2.54);
  expect(df.column('height in cm').value(2)).toBeNull();
});

test('add a text column', () => {});

test('add a date column with hint', () => {});

test('add a categorical column', () => {});

test('add a ordinal column', () => {});
