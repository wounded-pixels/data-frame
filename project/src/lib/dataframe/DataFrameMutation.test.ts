import { parseCSV, Type } from '../../data-frame';

const csv = `
 name, height, shirt size,gender
 Fred, 72, XL,m
 Ted, 60, L,m
 Ned,,m
 Wilma,66,S,f
 `;

const calculateHeightCategory = (row: any) => {
  if (row.height === null) {
    return null;
  }

  if (row.gender === 'f' && row.height >= 66) {
    return 'tall';
  }

  return row.height > 70 ? 'tall' : 'short';
};

test('add a converted column', () => {
  const df = parseCSV(csv);
  df.createColumn('height in cm', row =>
    row.height !== null ? row.height * 2.54 : null
  );
  expect(df.column('height in cm').value(1)).toBe(60 * 2.54);
  expect(df.column('height in cm').value(2)).toBeNull();
});

test('add a text column', () => {
  const df = parseCSV(csv);
  df.createColumn(
    'shouted name',
    row => (row.name !== null ? `${row.name.toUpperCase()}!` : null),
    { type: Type.Text }
  );

  expect(df.column('shouted name').value(1)).toBe('TED!');
});
const df = parseCSV(csv);

test('add a date column with hint', () => {
  const df = parseCSV(csv);
  df.createColumn(
    'odd date',
    row => (row.height !== null ? `19${row.height}/1/1` : null),
    { dateFormat: 'YYYY/M/D' }
  );

  expect((df.column('odd date').value(0) as Date).getFullYear()).toBe(1972);
  expect(df.column('odd date').value(2)).toBeNull();
});

test('add a categorical column', () => {
  const df = parseCSV(csv);
  df.createColumn('height category', calculateHeightCategory);

  expect(
    df
      .column('height category')
      .values()
      .join()
  ).toBe('tall,short,,tall');
});

test('add a ordinal column', () => {
  const df = parseCSV(csv);
  df.createColumn('height category', calculateHeightCategory, {
    orderedCategories: ['short', 'tall'],
  });

  expect(
    df
      .column('height category')
      .values()
      .join()
  ).toBe('tall,short,,tall');

  expect(df.column('height category').median()).toBe('tall');
});
