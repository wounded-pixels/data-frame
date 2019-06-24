import { DataFrame } from './DataFrame';
import { createRange } from '../util/arrays';

export type ValuePredicate = (value: string | number | Date) => boolean;
export type ObjectPredicate = (obj: any) => boolean;

export class DataFrameFilter {
  private source: DataFrame;
  private rowIndexes: number[];

  constructor(source: DataFrame) {
    this.source = source;

    const rowCount = this.source.dimensions().rows;
    this.rowIndexes = createRange(0, rowCount);
  }

  on(columnName: string, predicate: ValuePredicate) {
    const values = this.source.column(columnName).values();
    this.rowIndexes = this.rowIndexes.filter(index => {
      if (values[index] === null) {
        return false;
      }

      const value = values[index] as string | number | Date;
      return predicate(value);
    });

    return this;
  }

  onRow(predicate: ObjectPredicate) {
    this.rowIndexes = this.rowIndexes.filter(index => {
      const objectOfRow = this.source.asObject(index);
      return predicate(objectOfRow);
    });

    return this;
  }

  take(): DataFrame {
    return this.source.fromRowIndexes(this.rowIndexes);
  }
}
