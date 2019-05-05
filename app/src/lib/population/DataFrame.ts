// @ts-ignore
import random from 'random';

import { createRange, removeValue } from '../util/arrays';
import { NumericalColumn } from './NumericalColumn';
import { Column } from './Column';
import { CategoricalColumn } from './CategoricalColumn';
import { DataFrameParser, ParseDelimiter } from './DataFrameParser';

export class DataFrame {
  private readonly height: number;
  private width: number = 0;
  private columnMap: { [key: string]: Column } = {};

  constructor(columns: Column[]) {
    this.height = columns.length > 0 ? columns[0].length() : 0;

    columns.forEach(column => {
      this.columnMap[column.name()] = column;
      this.width++;
      if (this.height !== column.length()) {
        throw new Error('All columns must have the same length');
      }
    });
  }

  column(name: string): Column {
    return this.columnMap[name];
  }

  fromRowIndexes(indexes: number[]): DataFrame {
    const columns: Column[] = Object.values(this.columnMap).map(column => {
      return column.fromRowIndexes(indexes);
    });

    return new DataFrame(columns);
  }

  sampleWithReplacement(size: number): DataFrame {
    const indexes: number[] = [];
    for (let ctr = 0; ctr < size; ctr++) {
      indexes.push(random.int(0, this.height - 1));
    }

    return this.fromRowIndexes(indexes);
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

    return this.fromRowIndexes(indexes);
  }

  dimensions() {
    return { rows: this.height, columns: this.width };
  }

  static rowBind(top: DataFrame, bottom: DataFrame): DataFrame {
    const combinedColumns: Column[] = Object.values(top.columnMap).map(
      column => {
        return column.bind(bottom.column(column.name()));
      }
    );

    return new DataFrame(combinedColumns);
  }

  static parseCSV(csv: string): DataFrame {
    return DataFrameParser.parse(csv, ',');
  }

  static parse(raw: string, delimiter: ParseDelimiter): DataFrame {
    return DataFrameParser.parse(raw, delimiter);
  }
}
