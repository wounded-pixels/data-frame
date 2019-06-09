import { createRange, removeValue } from '../util/arrays';
import { randomInt } from '../util/random';

import { Column } from './Column';
import {
  DataFrameParser,
  ParseDelimiter,
  ParsingHints,
} from './DataFrameParser';

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
      indexes.push(randomInt(0, this.height - 1));
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
      const index = possibleIndexes[randomInt(0, possibleIndexes.length - 1)];
      indexes.push(index);
      removeValue(possibleIndexes, index);
    }

    return this.fromRowIndexes(indexes);
  }

  dimensions() {
    return { rows: this.height, columns: this.width };
  }

  summary() {
    const columns = Object.values(this.columnMap).map(column => {
      return column.summary();
    });

    return { columns };
  }

  summaryString(): string {
    const columnSummaryStrings = Object.values(this.columnMap)
      .map(column => {
        return column.summaryString();
      })
      .join('\n');

    return `${this.dimensions().rows} rows by ${
      this.dimensions().columns
    } columns\n${columnSummaryStrings}`;
  }

  static rowBind(top: DataFrame, bottom: DataFrame): DataFrame {
    const combinedColumns: Column[] = Object.values(top.columnMap).map(
      column => {
        return column.bind(bottom.column(column.name()));
      }
    );

    return new DataFrame(combinedColumns);
  }

  static parseCSV(csv: string, parsingHints: ParsingHints = {}): DataFrame {
    return DataFrameParser.parse(csv, ',', parsingHints);
  }

  static parse(
    raw: string,
    delimiter: ParseDelimiter,
    parsingHints: ParsingHints = {}
  ): DataFrame {
    return DataFrameParser.parse(raw, delimiter, parsingHints);
  }
}
