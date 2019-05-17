export type ColumnSummary = {
  categories: string[] | null;
  name: string;
  max: number | null;
  mean: number | null;
  min: number | null;
};

export abstract class Column {
  private readonly aName: string;

  protected constructor(name: string) {
    this.aName = name;
  }

  name(): string {
    return this.aName;
  }

  summary(): ColumnSummary {
    return {
      name: this.name(),
      categories: null,
      max: null,
      min: null,
      mean: null,
    };
  }

  // subclasses must implement these required methods
  abstract length(): number;
  abstract values(): (number | string | null)[];
  abstract fromRowIndexes(indexes: number[]): Column;
  abstract bind(bottom: Column): Column;

  // optional methods. subclasses may throw an error if unable to support
  // i may revisit in the future but all of the other options seem terrible
  abstract categories(): string[];
  abstract mean(): number;
  abstract sum(): number;
}
