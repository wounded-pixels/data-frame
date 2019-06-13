import { createRange, removeValue } from '../util/arrays';
import { randomInt } from '../util/random';

import { Column } from './Column';

export abstract class DataFrame {
  abstract column(name: string): Column;
  abstract columns(): Column[];
  abstract dimensions(): { rows: number; columns: number };
  abstract fromRowIndexes(indexes: number[]): DataFrame;
  abstract rowBind(bottom: DataFrame): DataFrame;

  sampleWithReplacement(size: number): DataFrame {
    const indexes: number[] = [];
    for (let ctr = 0; ctr < size; ctr++) {
      indexes.push(randomInt(0, this.dimensions().rows - 1));
    }

    return this.fromRowIndexes(indexes);
  }

  sampleWithoutReplacement(size: number): DataFrame {
    if (size > this.dimensions().rows) {
      throw new Error('Sample size must be less than data frame height');
    }

    const possibleIndexes = createRange(0, this.dimensions().rows);
    const indexes: number[] = [];

    while (indexes.length < size) {
      const index = possibleIndexes[randomInt(0, possibleIndexes.length - 1)];
      indexes.push(index);
      removeValue(possibleIndexes, index);
    }

    return this.fromRowIndexes(indexes);
  }

  summary() {
    const columns = this.columns().map(column => {
      return column.summary();
    });

    return { columns };
  }

  summaryString(): string {
    const columnSummaryStrings = this.columns()
      .map(column => {
        return column.summaryString();
      })
      .join('\n');

    return `${this.dimensions().rows} rows by ${
      this.dimensions().columns
    } columns\n${columnSummaryStrings}`;
  }
}
