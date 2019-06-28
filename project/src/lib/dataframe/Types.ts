export type Value = string | number | Date | null;
export type ValuePredicate = (value: Value) => boolean;
export type ValueMutator = (value: Value) => Value;

export type ObjectPredicate = (obj: any) => boolean;

export enum Type {
  Text,
}

export type ColumnHints = {
  type?: Type;
  dateFormat?: string;
  orderedCategories?: string[];
};

export type ColumnMap = {
  [key: string]: ColumnHints;
};

export type ParseDelimiter = ',' | '|';

export type ParsingHints = {
  columnNames?: string[];
  replacementNames?: string[];
  columns?: ColumnMap;
};
