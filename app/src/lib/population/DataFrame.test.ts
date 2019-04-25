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
    let fiftyFirstCtr = 0;
    const reps = 10000;
    for (let ctr=0; ctr<reps;ctr++) {
        const sample = heightsAndWeights.sampleWithoutReplacement(3);
        expect(sample.dimensions()).toEqual({rows: 3, columns: 2});
        const hc = sample.column('height');

        const values = hc.values();
        expect(values.length).toBe(3);

        expect(values.includes(62)).toBeTruthy();
        expect(values.includes(50)).toBeTruthy();
        expect(values.includes(55)).toBeTruthy();

        const mean = heightColumn.mean();
        expect(mean).toBeCloseTo((62 + 50 + 55) / 3);

        values[0] === 50 && fiftyFirstCtr++;
    }

    expect(fiftyFirstCtr/reps).toBeCloseTo(1/3, 1);

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

