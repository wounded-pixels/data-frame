import { NumericalColumn } from './NumericalColumn';
import { DataFrame } from './DataFrame';
import { CategoricalColumn } from './CategoricalColumn';

const heightColumn = new NumericalColumn('height', [72, 68, 61]);
const weightColumn = new NumericalColumn('weight', [230, 190, 101]);
const genderColumn = new CategoricalColumn('gender', [
  'male',
  'male',
  'female',
]);

const heightsWeightsGenders = new DataFrame([
  heightColumn,
  weightColumn,
  genderColumn,
]);

test('construction', () => {
  const dimensions = heightsWeightsGenders.dimensions();
  expect(dimensions).toEqual({ rows: 3, columns: 3 });
  expect(heightsWeightsGenders.column('height').mean()).toBe(
    (72 + 68 + 61) / 3
  );
  expect(heightsWeightsGenders.column('height').sum()).toBe(72 + 68 + 61);
});

test('uneven columns in construction', () => {
  const shortColumn = new NumericalColumn('short', [1, 2]);
  const longColumn = new NumericalColumn('long', [1, 2, 3, 4]);

  const badConstruction = () => {
    new DataFrame([shortColumn, longColumn]);
  };
  expect(badConstruction).toThrow(Error);
});

test('sample with replacement', () => {
  const swr = heightsWeightsGenders.sampleWithReplacement(1000);

  expect(swr.dimensions()).toEqual({ rows: 1000, columns: 3 });
  expect(swr.column('height').mean()).toBeCloseTo(heightColumn.mean(), 0);
});

test('sample without replacement', () => {
  let fiftyFirstCtr = 0;
  const reps = 10000;
  for (let ctr = 0; ctr < reps; ctr++) {
    const sample = heightsWeightsGenders.sampleWithoutReplacement(3);
    expect(sample.dimensions()).toEqual({ rows: 3, columns: 3 });
    const hc = sample.column('height');

    const values = hc.values();
    expect(values.length).toBe(3);

    expect(values.includes(72)).toBeTruthy();
    expect(values.includes(68)).toBeTruthy();
    expect(values.includes(61)).toBeTruthy();

    const mean = heightColumn.mean();
    expect(mean).toBeCloseTo((72 + 68 + 61) / 3);

    values[0] === 68 && fiftyFirstCtr++;
  }

  expect(fiftyFirstCtr / reps).toBeCloseTo(1 / 3, 1);
});

test('too many without replacement', () => {
  const badSample = () => {
    heightsWeightsGenders.sampleWithoutReplacement(4);
  };

  expect(badSample).toThrow(Error);
});

test('row bind', () => {
  const heights1 = new NumericalColumn('height', [72, 68]);
  const weights1 = new NumericalColumn('weight', [230, 190]);
  const heightsWeightsGenders1 = new DataFrame([heights1, weights1]);

  const heights2 = new NumericalColumn('height', [77, 78]);
  const weights2 = new NumericalColumn('weight', [268, 261]);
  const heightsWeightsGenders2 = new DataFrame([weights2, heights2]);

  const combined = DataFrame.rowBind(
    heightsWeightsGenders1,
    heightsWeightsGenders2
  );
  expect(combined.dimensions()).toEqual({ rows: 4, columns: 2 });
  expect(combined.column('height').mean()).toEqual((72 + 68 + 77 + 78) / 4);
});

// TODO: Add error cases
