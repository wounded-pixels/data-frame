import { createRange, removeValue } from '../util/arrays';
import { randomInt } from '../util/random';

import { Column } from './Column';
import { DataFrameFilter } from './DataFrameFilter';

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

  filter(): DataFrameFilter {
    return new DataFrameFilter(this);
  }

  asObject(rowIndex: number): any {
    if (rowIndex < 0 || rowIndex >= this.dimensions().rows) {
      return null;
    }

    const obj: any = {};
    this.columns().forEach((column: Column) => {
      const name: string = column.name();
      const value = column.values()[rowIndex];

      obj[name] = value;
    });

    return obj;
  }
}
