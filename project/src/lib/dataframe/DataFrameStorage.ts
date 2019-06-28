import { DataFrame } from './DataFrame';
import { Column } from './Column';
import { ColumnHints } from './Types';
import { parseColumn } from './DataFrameParser';

export class DataFrameStorage extends DataFrame {
  private readonly height: number;
  private width: number = 0;
  private columnMap: { [key: string]: Column } = {};

  constructor(columns: Column[]) {
    super();

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

  columns(): Column[] {
    return Object.values(this.columnMap);
  }

  dimensions() {
    return { rows: this.height, columns: this.width };
  }

  fromRowIndexes(indexes: number[]): DataFrame {
    const columns: Column[] = this.columns().map(column => {
      return column.fromRowIndexes(indexes);
    });

    return new DataFrameStorage(columns);
  }

  rowBind(bottom: DataFrame): DataFrame {
    const combinedColumns: Column[] = this.columns().map(column => {
      return column.bind(bottom.column(column.name()));
    });

    return new DataFrameStorage(combinedColumns);
  }

  createColumn(
    name: string,
    valueFunction: (row: any) => string | number | null,
    hints: ColumnHints
  ): void {
    const rawValues = this.toArray().map(valueFunction);
    this.columnMap[name] = parseColumn(name, rawValues, hints);
  }
}

export function fromColumns(columns: Column[]) {
  return new DataFrameStorage(columns);
}
