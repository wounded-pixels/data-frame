import { DataFrame } from './DataFrame';
import { Column } from './Column';
import { NumericalColumn } from './NumericalColumn';
import { CategoricalColumn } from './CategoricalColumn';

export type ParseDelimiter = ',' | '|';

export class DataFrameParser {
  static parse(raw: string, delimiter: ParseDelimiter): DataFrame {
    const columns: Column[] = [];

    // split rows and ignore empty lines
    const rows: string[] = raw
      .split(/\r?\n/)
      .filter(row => row.trim().length > 0);
    const headers = rows[0].split(delimiter).map(header => header.trim());
    const rawColumns: (string | null)[][] = headers.map(ignore => []);

    // flip data to columnar
    for (let rowCtr = 1; rowCtr < rows.length; rowCtr++) {
      const values = rows[rowCtr].split(delimiter).map(value => value.trim());
      for (let columnCtr = 0; columnCtr < headers.length; columnCtr++) {
        const value = values[columnCtr] || null;
        rawColumns[columnCtr].push(value);
      }
    }

    for (let columnCtr = 0; columnCtr < headers.length; columnCtr++) {
      const name = headers[columnCtr];
      const rawValues = rawColumns[columnCtr];

      const numericalColumn = NumericalColumn.parse(name, rawValues);
      if (numericalColumn) {
        columns.push(numericalColumn);
        continue;
      }

      const categoricalColumn = new CategoricalColumn(name, rawValues);
      columns.push(categoricalColumn);
    }

    return new DataFrame(columns);
  }
}
