import { DataFrame } from './DataFrame';
import { Column } from './Column';
import { NumericalColumn } from './NumericalColumn';
import { CategoricalColumn } from './CategoricalColumn';
import { TextColumn } from './TextColumn';
import { DateColumn } from './DateColumn';
import { OrdinalColumn } from './OrdinalColumn';
import { DataFrameStorage } from './DataFrameStorage';
import { ParseDelimiter, ParsingHints, Type } from './Types';

export function parseCSV(
  csv: string,
  parsingHints: ParsingHints = {}
): DataFrame {
  return parse(csv, ',', parsingHints);
}

export function parse(
  raw: string,
  delimiter: ParseDelimiter,
  parsingHints: ParsingHints = {}
): DataFrame {
  const columns: Column[] = [];

  const columnNames = parsingHints.columnNames || [];
  const replacementNames = parsingHints.replacementNames || [];
  const columnHints = parsingHints.columns || {};

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

  if (replacementNames.length) {
    replacementNames.forEach((name, index) => {
      headers[index] = name;
    });
  }

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

    const hints = columnHints[name] || {};
    const { type, dateFormat, orderedCategories } = hints;

    if (type === Type.Text) {
      const textColumn = new TextColumn(name, rawValues);
      columns.push(textColumn);
      continue;
    }

    if (orderedCategories) {
      const ordinalColumn = new OrdinalColumn(
        name,
        orderedCategories,
        rawValues
      );
      columns.push(ordinalColumn);
      continue;
    }

    const dateColumn = DateColumn.parse(name, rawValues, dateFormat);
    if (dateColumn) {
      columns.push(dateColumn);
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

  return new DataFrameStorage(columns);
}
