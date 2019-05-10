import { NumericalColumn } from './NumericalColumn';
import { DataFrame } from './DataFrame';
import { CategoricalColumn } from './CategoricalColumn';
import { TextColumn } from './TextColumn';

const columnAsString = (df: DataFrame, columnName: string) => {
  return df
    .column(columnName)
    .values()
    .join();
};

const nameColumn = new TextColumn('name', ['Fred', 'Barney', 'Wilma']);
const heightColumn = new NumericalColumn('height', [72, 68, 61]);
const weightColumn = new NumericalColumn('weight', [230, 190, 101]);
const genderColumn = new CategoricalColumn('gender', [
  'male',
  'male',
  'female',
]);

const heightsWeightsGenders = new DataFrame([
  nameColumn,
  heightColumn,
  weightColumn,
  genderColumn,
]);

const csv = `
  name, gender,height, weight
  fred,m, 72, 195
  wilma,f, 65, 110
  barney, m,70,190
  `;

const csvWithMissing = `
  name,gender, height, weight
  fred,m, 72, 195
  wilma,f, 65
  barney,m,70,190
  `;

const csvNoHeader = `

  fred,m, 72, 195
  wilma,f, 65
  barney,m,70,190
  `;

test('construction', () => {
  const dimensions = heightsWeightsGenders.dimensions();
  expect(dimensions).toEqual({ rows: 3, columns: 4 });
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

  expect(swr.dimensions()).toEqual({ rows: sampleSize, columns: 4 });
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
    expect(sample.dimensions()).toEqual({ rows: 3, columns: 4 });

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
  const heightsWeightsGenders1 = new DataFrame([
    names1,
    heights1,
    weights1,
    genders1,
  ]);

  const names2 = new TextColumn('name', ['Wilma', 'Betty']);
  const heights2 = new NumericalColumn('height', [77, 78]);
  const weights2 = new NumericalColumn('weight', [268, 261]);
  const genders2 = new CategoricalColumn('gender', ['female', 'female']);
  const heightsWeightsGenders2 = new DataFrame([
    names2,
    weights2,
    heights2,
    genders2,
  ]);

  const combined = DataFrame.rowBind(
    heightsWeightsGenders1,
    heightsWeightsGenders2
  );
  expect(combined.dimensions()).toEqual({ rows: 4, columns: 4 });
  expect(combined.column('height').mean()).toEqual((72 + 68 + 77 + 78) / 4);
  expect(combined.column('name').values()[2]).toBe('Wilma');
  expect(combined.column('gender').values()[2]).toBe('female');
});

test('parse csv perfect data', () => {
  const df = DataFrame.parseCSV(csv);
  expect(df.dimensions().columns).toEqual(4);
  expect(df.dimensions().rows).toEqual(3);
  expect(columnAsString(df, 'name')).toEqual('fred,wilma,barney');
  expect(columnAsString(df, 'gender')).toEqual('m,f,m');
  expect(columnAsString(df, 'height')).toEqual('72,65,70');
  expect(columnAsString(df, 'weight')).toEqual('195,110,190');
});

test('parse perfect data', () => {
  const df = DataFrame.parse(csv, ',');
  expect(df.dimensions().columns).toEqual(4);
  expect(df.dimensions().rows).toEqual(3);
});

test('parse csv missing data', () => {
  const df = DataFrame.parseCSV(csvWithMissing);
  expect(df.dimensions().columns).toEqual(4);
  expect(df.dimensions().rows).toEqual(3);
  expect(columnAsString(df, 'name')).toEqual('fred,wilma,barney');
  expect(columnAsString(df, 'gender')).toEqual('m,f,m');
  expect(columnAsString(df, 'height')).toEqual('72,65,70');
  expect(columnAsString(df, 'weight')).toEqual('195,,190');
});

test('parse provided header', () => {
  const df = DataFrame.parse(csvNoHeader, ',', [
    'Name',
    'Gender',
    'Height',
    'Weight',
  ]);
  expect(df.dimensions().columns).toEqual(4);
  expect(df.dimensions().rows).toEqual(3);
  expect(columnAsString(df, 'Name')).toEqual('fred,wilma,barney');
  expect(df.column('Height').mean()).toBe((72 + 65 + 70) / 3);
  expect(df.column('Weight').mean()).toBe((195 + 190) / 2);
});
