// @ts-ignore
import random from 'random';

import {createRange, removeValue} from '../util/arrays';
import {NumericalColumn} from './NumericalColumn';

export class DataFrame {
    private readonly height: number;
    private width: number = 0;
    private columnMap: { [key: string]: NumericalColumn } = {};

    // TODO need base Column class? how to handle things that have numerical methods vs not?

    constructor(columns: NumericalColumn[]) {
        this.height = columns[0].length();

        columns.forEach(column => {
            this.columnMap[column.name()] = column;
            this.width++;
            if (this.height !== column.length()) {
                throw new Error('All columns must have the same length');
            }
        });
    }

    column(name: string): NumericalColumn {
        return this.columnMap[name];
    }

    dataFrameFromIndexes(indexes: number[]): DataFrame {
        const columns: NumericalColumn[] = Object.values(this.columnMap).map(column => {
            const originalValues = column.values();
            const newValues = indexes.map(index => {
                return originalValues[index];
            });

            return new NumericalColumn(column.name(), newValues);
        });

        return new DataFrame(columns);
    }

    sampleWithReplacement(size: number): DataFrame {
        const indexes: number[] = [];
        for (let ctr = 0; ctr < size; ctr++) {
            indexes.push(random.int(0, this.height - 1));
        }

        return this.dataFrameFromIndexes(indexes);
    }

    sampleWithoutReplacement(size: number): DataFrame {
        if (size > this.height) {
            throw new Error('Sample size must be less than data frame height');
        }

        const possibleIndexes = createRange(0, this.height);
        const indexes: number[] = [];

        while (indexes.length < size) {
            const index = possibleIndexes[random.int(0, possibleIndexes.length - 1)];
            indexes.push(index);
            removeValue(possibleIndexes, index);
        }

        return this.dataFrameFromIndexes(indexes);

    }

    dimensions() {
        return {rows: this.height, columns: this.width};
    }

    static rowBind(top: DataFrame, bottom: DataFrame): DataFrame {
        const combinedColumns: NumericalColumn[] = Object.values(top.columnMap).map(column => {
            const name = column.name();
            const values = column.values();
            const bottomValues: number[] = bottom.column(name).values();

            return new NumericalColumn(name, values.concat(bottomValues));
        });

        return new DataFrame(combinedColumns);
    }
}