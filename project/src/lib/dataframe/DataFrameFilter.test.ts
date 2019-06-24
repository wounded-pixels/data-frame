import { parseCSV } from './DataFrameParser';

const shirtSizes = ['S', 'M', 'L', 'XL'];

const csv = `
  name, gender,height, weight, dob, shirt size
  fred,m, 72, 195, 03/06/1951, XL
  wilma,f, 65,, 05/01/1956, M
  barney, m,70,190, 04/01/1955, L
  pebbles,f, 55,80, 05/22/1978, S
  bam bam,m, 50,80, 05/22/1978, S
  `;

const df = parseCSV(csv, {
  columns: { 'shirt size': { orderedCategories: shirtSizes } },
});

test('single column predicate', () => {
  const males = df
    .filter()
    .on('gender', g => g === 'm')
    .take();
  expect(males.column('height').mean()).toBe((72 + 70 + 50) / 3);
});

test('single column with null', () => {
  const lightWeights = df
    .filter()
    .on('weight', w => w < 100)
    .take();
  expect(lightWeights.column('weight').mean()).toBe(80);
  expect(lightWeights.dimensions().rows).toBe(2);
});

test('multiple column predicates', () => {
  const maleChildren = df
    .filter()
    .on('gender', g => g === 'm')
    .on('dob', d => (d as Date).getFullYear() > 1975)
    .take();

  expect(maleChildren.column('height').mean()).toBe(50);
  expect(maleChildren.column('gender').values()).toStrictEqual(['m']);
});

test('row predicate', () => {
  const maleChildren = df
    .filter()
    .onRow(row => row.gender === 'm' && row.dob.getFullYear() > 1975)
    .take();

  expect(maleChildren.column('height').mean()).toBe(50);
  expect(maleChildren.column('gender').values()).toStrictEqual(['m']);
});
