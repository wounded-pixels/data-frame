export type ColumnSummary = {
  name: string;
  readonly categories?: string[];
  max?: number | Date | null;
  mean?: number;
  min?: number | Date | null;
};

export abstract class Column {
  private readonly aName: string;

  protected constructor(name: string) {
    this.aName = name;
  }

  name(): string {
    return this.aName;
  }

  // subclasses must implement these required methods
  abstract length(): number;
  abstract values(): (number | string | Date | null)[];
  abstract fromRowIndexes(indexes: number[]): Column;
  abstract bind(bottom: Column): Column;
  abstract summary(): ColumnSummary;

  // optional methods. subclasses may throw an error if unable to support
  // i may revisit in the future but all of the other options seem terrible
  abstract categories(): string[];
  abstract mean(): number;
  abstract sum(): number;
  abstract min(): number | Date | null;
  abstract max(): number | Date | null;

  // TODO: add median and percentile with tests in DataFrame.test - Dates too
}
