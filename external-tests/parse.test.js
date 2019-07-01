const { parseCSV, Type } = require('@wounded-pixels/data-frame');

const csv = `
name, dob, height, weight, shirt size
Fred, 1951/1/1, 72, 210, XL
Ted, 1952/2/2, 74, 203, XL

`;

test('parse', () => {
  const df = parseCSV(csv, {
    columns: {
      name: { type: Type.Text },
      dob: { dateFormat: 'YYYY/M/M' },
      'shirt size': { orderedCategories: ['S', 'M', 'L', 'XL'] },
    },
  });
  expect(df.dimensions().rows).toBe(2);
  expect(df.dimensions().columns).toBe(5);

  const nameSummary = df.summary().columns[0];
  expect(nameSummary.name).toBe('name');
  expect(nameSummary.categories).toBeUndefined();

  expect(
    df
      .column('dob')
      .min()
      .getFullYear()
  ).toBe(1951);

  expect(df.column('height').mean()).toBe(73);
  expect(df.column('weight').max()).toBe(210);
  expect(df.column('shirt size').min()).toBe('XL');
});
