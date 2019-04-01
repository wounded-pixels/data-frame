import {DataFrame} from './DataFrame';
import {Population} from './Population';

test('means of normal', () => {
  // fluent style
  const greens: DataFrame = new Population()
    .addNormalColumn('size', 6, 0.5)
    .generate(100*1000)
  ;

  const blues: DataFrame = new Population()
    .addNormalColumn('size', 4, 0.3)
    .generate(100*1000)
  ;

  expect(greens.column('size').mean()).toBeCloseTo(6);
  expect(blues.column('size').mean()).toBeCloseTo(4);
});

test('sample with replacement', () => {
  const greens: DataFrame = new Population()
    .addNormalColumn('size', 6, 0.5)
    .generate(100*1000)
  ;

  const someGreens = greens.sampleWithReplacement(1000);
  expect(someGreens.column('size').mean()).toBeCloseTo(6, 1);

});


// TODO: build population data frames by addding? or rules based?
// TODO: population.addCategoricalColumn('color', [{value: 'blue', ratio: 1}])  addFactorColumn ??