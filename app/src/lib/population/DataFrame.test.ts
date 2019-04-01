import {NumericalColumn} from './NumericalColumn';
import {DataFrame} from './DataFrame';

const heightColumn = new NumericalColumn('height', [62, 50, 55]);
const weightColumn = new NumericalColumn('weight', [230, 190, 165]);
const heightsAndWeights = new DataFrame([heightColumn, weightColumn]);

test('construction', () => {

    const dimensions = heightsAndWeights.dimensions();
    expect(dimensions).toEqual({rows: 3, columns: 2});
});

test('sample with replacement', () => {
    const swr = heightsAndWeights.sampleWithReplacement(1000);

    expect(swr.dimensions()).toEqual({rows: 1000, columns:2});
    expect(swr.column('height').mean()).toBeCloseTo(heightColumn.mean(), 0);
});

test('sample without replacement', () => {
    for (let ctr = 0; ctr < 100; ctr++) {
        const swor = heightsAndWeights.sampleWithoutReplacement(3);
        expect(swor.dimensions()).toEqual({rows: 3, columns: 2});
        expect(swor.column('height').mean()).toEqual((62 + 50 + 55) / 3);
    }
});

test('row bind', () => {
    const heights1 = new NumericalColumn('height', [62, 50]);
    const weights1 = new NumericalColumn('weight', [230, 190]);
    const heightsAndWeights1 = new DataFrame([heights1, weights1]);

    const heights2 = new NumericalColumn('height', [77, 78]);
    const weights2 = new NumericalColumn('weight', [250, 255]);
    const heightsAndWeights2 = new DataFrame([weights2, heights2]);

    const combined = DataFrame.rowBind(heightsAndWeights1, heightsAndWeights2);
    expect(combined.dimensions()).toEqual({rows: 4, columns: 2});
    expect(combined.column('height').mean()).toEqual((62 + 50 + 77 +78) / 4);
});

// TODO: Add error cases

