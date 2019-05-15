import { DataFrame } from './DataFrame';
import { Column } from './Column';
import { NumericalColumn } from './NumericalColumn';
import { CategoricalColumn } from './CategoricalColumn';
import { TextColumn } from './TextColumn';

interface StringMap {
  [key: string]: string;
}

export type ParseDelimiter = ',' | '|';

export type ParsingHints = {
  columnNames?: string[];
  columnTypes?: StringMap;
};

export class DataFrameParser {
  static parse(
    raw: string,
    delimiter: ParseDelimiter,
    parsingHints: ParsingHints
  ): DataFrame {
    const columns: Column[] = [];

    const columnNames = parsingHints.columnNames || [];
    const columnTypes = parsingHints.columnTypes || {};

    // split rows and ignore empty lines
    const rows: string[] = raw
      .split(/\r?\n/)
      .filter(row => row.trim().length > 0);
    const headers =
      columnNames.length === 0
        ? rows[0].split(delimiter).map(header => header.trim())
        : columnNames;
    const rawColumns: (string | null)[][] = headers.map(ignore => []);
    const startRowIndex = columnNames.length === 0 ? 1 : 0;

    // flip data to columnar
    for (let rowCtr = startRowIndex; rowCtr < rows.length; rowCtr++) {
      const values = rows[rowCtr].split(delimiter).map(value => value.trim());
      for (let columnCtr = 0; columnCtr < headers.length; columnCtr++) {
        const value = values[columnCtr] || null;
        rawColumns[columnCtr].push(value);
      }
    }

    for (let columnCtr = 0; columnCtr < headers.length; columnCtr++) {
      const name = headers[columnCtr];
      const rawValues = rawColumns[columnCtr];

      const type = columnTypes[name];

      if (type === 'text') {
        const textColumn = new TextColumn(name, rawValues);
        columns.push(textColumn);
        continue;
      }

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
