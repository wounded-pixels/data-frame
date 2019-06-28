import { createRange, removeValue } from '../util/arrays';
import { randomInt } from '../util/random';

import { Column } from './Column';
import { DataFrameFilter } from './DataFrameFilter';
import { ColumnHints, Value } from './Types';

export abstract class DataFrame {
  abstract column(name: string): Column;
  abstract columns(): Column[];
  abstract dimensions(): { rows: number; columns: number };
  abstract fromRowIndexes(indexes: number[]): DataFrame;
  abstract rowBind(bottom: DataFrame): DataFrame;
  abstract createColumn(
    name: string,
    valueFunction: (row: any) => string | number | null,
    hints: ColumnHints
  ): void;

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

  toObject(rowIndex: number): any {
    if (rowIndex < 0 || rowIndex >= this.dimensions().rows) {
      return null;
    }

    const obj: any = {};
    this.columns().forEach((column: Column) => {
      const name: string = column.name();
      obj[name] = column.value(rowIndex);
    });

    return obj;
  }

  toArray(): any[] {
    const { rows: rowCount } = this.dimensions();
    const results = [];
    for (let ctr = 0; ctr < rowCount; ctr++) {
      results.push(this.toObject(ctr));
    }

    return results;
  }

  toJSON(): string {
    return JSON.stringify(this.toArray());
  }

  rowValues(index: number): (number | string | Date | null)[] {
    return this.columns().map(column => column.values()[index]);
  }

  toCSV(): string {
    const header: string = this.columns()
      .map(column => column.name())
      .join(',');

    let data = '';
    const { rows: rowCount, columns: columnCount } = this.dimensions();
    for (let rowCtr = 0; rowCtr < rowCount; rowCtr++) {
      data += this.rowValues(rowCtr).join(',');
      data += '\n';
    }
    return header + '\n' + data.trim();
  }
}
