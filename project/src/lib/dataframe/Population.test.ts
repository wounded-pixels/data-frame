import { DataFrame } from './DataFrame';
import { Population } from './Population';

const greens: DataFrame = new Population()
  .addNormalColumn('size', 6, 0.5)
  .addCategoricalColumn('color', 'green')
  .generate(100 * 1000);

const blues: DataFrame = new Population()
  .addNormalColumn('size', 4, 0.3)
  .addCategoricalColumn('color', 'blue')
  .generate(100 * 1000);

test('means of normal', () => {
  expect(greens.column('size').mean()).toBeCloseTo(6);
  expect(blues.column('size').mean()).toBeCloseTo(4);

  expect(
    greens
      .column('color')
      .categories()
      .join()
  ).toBe('green');
  expect(
    blues
      .column('color')
      .categories()
      .join()
  ).toBe('blue');
});

test('sample with replacement', () => {
  const greens: DataFrame = new Population()
    .addNormalColumn('size', 6, 0.5)
    .generate(100 * 1000);

  const someGreens = greens.sampleWithReplacement(1000);
  expect(someGreens.column('size').mean()).toBeCloseTo(6, 1);
});
