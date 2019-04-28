import {Column} from './Column';


export class NumericalColumn extends Column {
    private readonly theValues: number[];

    constructor(name: string, values: number[]) {
        super(name);
        this.theValues = values;
    }

    sum(): number {
        let sum = 0;
        for (let ctr = 0; ctr < this.theValues.length; ctr++) {
            sum += this.theValues[ctr];
        }

        return sum;
    }

    mean(): number {
        return this.sum() / this.length();
    }

    /** copy of values */
    values(): number[] {
        return [...this.theValues];
    }

    length(): number {
        return this.theValues.length;
    }
}