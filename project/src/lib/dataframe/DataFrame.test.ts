import { NumericalColumn } from './NumericalColumn';
import { DataFrame } from './DataFrame';
import { CategoricalColumn } from './CategoricalColumn';
import { TextColumn } from './TextColumn';
import { DateColumn } from './DateColumn';
import { OrdinalColumn } from './OrdinalColumn';

const nameColumn = new TextColumn('name', ['Fred', 'Barney', 'Wilma']);
const heightColumn = new NumericalColumn('height', [72, 68, 61]);
const weightColumn = new NumericalColumn('weight', [230, 190, 101]);
const genderColumn = new CategoricalColumn('gender', [
  'male',
  'male',
  'female',
]);
const birthDateColumn = new DateColumn('birth date', [
  new Date(1951, 3, 13),
  new Date(1955, 4, 5),
  null,
]);
const shirtSizeColumn = new OrdinalColumn(
  'shirt size',
  ['S', 'M', 'L', 'XL'],
  ['XL', 'L', '']
);

const heightsWeightsGenders = new DataFrame([
  nameColumn,
  heightColumn,
  weightColumn,
  genderColumn,
  birthDateColumn,
  shirtSizeColumn,
]);

test('construction', () => {
  const dimensions = heightsWeightsGenders.dimensions();
  expect(dimensions).toEqual({ rows: 3, columns: 6 });
  expect(heightsWeightsGenders.column('height').mean()).toBe(
    (72 + 68 + 61) / 3
  );
  expect(heightsWeightsGenders.column('height').sum()).toBe(72 + 68 + 61);
  expect(
    heightsWeightsGenders
      .column('gender')
      .categories()
      .join()
  ).toBe('female,male');
});

test('uneven columns in construction', () => {
  const shortColumn = new NumericalColumn('short', [1, 2]);
  const longColumn = new NumericalColumn('long', [1, 2, 3, 4]);

  const badConstruction = () => {
    new DataFrame([shortColumn, longColumn]);
  };
  expect(badConstruction).toThrow(Error);
});

test('silly construction', () => {
  const empty = new DataFrame([]);
  expect(empty.dimensions()).toEqual({ rows: 0, columns: 0 });
});

test('sample with replacement', () => {
  const sampleSize = 10000;
  const swr = heightsWeightsGenders.sampleWithReplacement(sampleSize);

  expect(swr.dimensions()).toEqual({ rows: sampleSize, columns: 6 });
  expect(swr.column('height').mean()).toBeCloseTo(heightColumn.mean(), 0);

  const femaleCount = swr
    .column('gender')
    .values()
    .reduce((count: number, gender) => {
      return gender === 'female' ? count + 1 : count;
    }, 0);

  const expectedFemaleCount = Math.round(sampleSize / 3);
  expect(femaleCount / 1000).toBeCloseTo(expectedFemaleCount / 1000, 0);
});

test('sample without replacement', () => {
  let fiftyFirstCtr = 0;
  let maleFirstCtr = 0;

  const reps = 10000;
  for (let ctr = 0; ctr < reps; ctr++) {
    const sample = heightsWeightsGenders.sampleWithoutReplacement(3);
    expect(sample.dimensions()).toEqual({ rows: 3, columns: 6 });

    const heightValues = sample.column('height').values();
    const genderValues = sample.column('gender').values();

    expect(heightValues.length).toBe(3);
    expect(genderValues.length).toBe(3);

    expect(heightValues.includes(72)).toBeTruthy();
    expect(heightValues.includes(68)).toBeTruthy();
    expect(heightValues.includes(61)).toBeTruthy();

    expect(genderValues.includes('male')).toBeTruthy();
    expect(genderValues.includes('female')).toBeTruthy();

    const mean = heightColumn.mean();
    expect(mean).toBeCloseTo((72 + 68 + 61) / 3);

    heightValues[0] === 68 && fiftyFirstCtr++;
    genderValues[0] === 'male' && maleFirstCtr++;
  }

  expect(fiftyFirstCtr / reps).toBeCloseTo(1 / 3, 1);
  expect(maleFirstCtr / reps).toBeCloseTo(2 / 3, 1);
});

test('too many without replacement', () => {
  const badSample = () => {
    heightsWeightsGenders.sampleWithoutReplacement(4);
  };

  expect(badSample).toThrow(Error);
});

test('row bind', () => {
  const names1 = new TextColumn('name', ['Fred', 'Barney']);
  const heights1 = new NumericalColumn('height', [72, 68]);
  const weights1 = new NumericalColumn('weight', [230, 190]);
  const genders1 = new CategoricalColumn('gender', ['male', 'male']);
  const shirtSizes1 = new OrdinalColumn(
    'shirt size',
    ['S', 'M', 'L', 'XL'],
    ['XL', 'L']
  );
  const heightsWeightsGenders1 = new DataFrame([
    names1,
    heights1,
    weights1,
    genders1,
    shirtSizes1,
  ]);

  const names2 = new TextColumn('name', ['Wilma', 'Betty']);
  const heights2 = new NumericalColumn('height', [77, 78]);
  const weights2 = new NumericalColumn('weight', [268, 261]);
  const genders2 = new CategoricalColumn('gender', ['female', 'female']);
  const shirtSizes2 = new OrdinalColumn(
    'shirt size',
    ['S', 'M', 'L', 'XL'],
    ['M', 'S']
  );

  const heightsWeightsGenders2 = new DataFrame([
    names2,
    weights2,
    heights2,
    genders2,
    shirtSizes2,
  ]);

  const combined = DataFrame.rowBind(
    heightsWeightsGenders1,
    heightsWeightsGenders2
  );
  expect(combined.dimensions()).toEqual({ rows: 4, columns: 5 });
  expect(combined.column('height').mean()).toEqual((72 + 68 + 77 + 78) / 4);
  expect(combined.column('name').values()[2]).toBe('Wilma');
  expect(combined.column('gender').values()[2]).toBe('female');
  expect(combined.column('shirt size').values()[2]).toBe('M');
});

test('min and max', () => {
  expect(heightsWeightsGenders.column('height').min()).toBe(61);
  expect(heightsWeightsGenders.column('height').max()).toBe(72);

  const minBirthDate = heightsWeightsGenders.column('birth date').min() as Date;
  const maxBirthDate = heightsWeightsGenders.column('birth date').max() as Date;

  expect(minBirthDate.getFullYear()).toBe(1951);
  expect(maxBirthDate.getFullYear()).toBe(1955);
});

test('percentile', () => {
  expect(heightsWeightsGenders.column('height').percentile(0.5)).toBe(68);
  const medianBirthDate = heightsWeightsGenders
    .column('birth date')
    .percentile(0.5) as Date;
  expect(medianBirthDate.getFullYear()).toBe(1953);
  expect(heightsWeightsGenders.column('birth date').median()).toEqual(
    medianBirthDate
  );
});

test('summary', () => {
  heightsWeightsGenders.column('birth date').percentile(0.75);
  const summary = heightsWeightsGenders.summary();
  expect(summary.columns.length).toBe(6);

  expect(summary.columns[0]).toEqual({
    name: 'name',
  });

  expect(summary.columns[1]).toEqual({
    name: 'height',
    max: 72,
    mean: (72 + 68 + 61) / 3,
    min: 61,
    median: 68,
    twentyFifthPercentile: 68,
    seventyFifthPercentile: 72,
  });

  expect(summary.columns[3]).toEqual({
    name: 'gender',
    categories: ['female', 'male'],
  });

  expect(summary.columns[4].name).toEqual('birth date');
  const bd = summary.columns[4];

  const minDate = bd.min as Date;
  const maxDate = bd.max as Date;
  const twentyFifthPercentileDate = bd.twentyFifthPercentile as Date;
  const medianDate = bd.median as Date;
  const seventyFifthPercentileDate = bd.seventyFifthPercentile as Date;

  expect(minDate.toString().substring(0, 15)).toEqual('Fri Apr 13 1951');
  expect(maxDate.toString().substring(0, 15)).toEqual('Thu May 05 1955');
  expect(twentyFifthPercentileDate.toString().substring(0, 15)).toEqual(
    'Thu Apr 23 1953'
  );
  expect(medianDate.toString().substring(0, 15)).toEqual('Thu Apr 23 1953');
  expect(seventyFifthPercentileDate.toString().substring(0, 15)).toEqual(
    'Thu Apr 23 1953'
  );
});

test('summary string', () => {
  const heightSummary = heightsWeightsGenders.column('height').summaryString();
  expect(heightSummary).toEqual(
    'Name: height    Min: 61 Max: 72    25%: 68  50%: 68  75%: 72'
  );

  const birthSummary = heightsWeightsGenders
    .column('birth date')
    .summaryString();
  expect(birthSummary).toContain('Name: birth date');
  expect(birthSummary).toContain('Min: Fri Apr 13 1951');
  expect(birthSummary).toContain('Max: Thu May 05 1955');
  expect(birthSummary).toContain('25%: Thu Apr 23 1953');
  expect(birthSummary).toContain('50%: Thu Apr 23 1953');
  expect(birthSummary).toContain('75%: Thu Apr 23 1953');

  const genderSummary = heightsWeightsGenders.column('gender').summaryString();
  expect(genderSummary).toBe('Name: gender    Categories: female, male');

  const dfSummaryString = heightsWeightsGenders.summaryString();
  const expectedFirstFive = `3 rows by 5 columns\nName: name\nName: height    Min: 61 Max: 72    25%: 68  50%: 68  75%: 72\nName: weight    Min: 101 Max: 230    25%: 190  50%: 190  75%: 230\nName: gender    Categories: female, male\nName: birth date `;
  expect(dfSummaryString.startsWith(expectedFirstFive));
});
