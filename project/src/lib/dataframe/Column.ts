import { ColumnSummary } from './ColumnSummary';

export abstract class Column {
  private readonly aName: string;

  protected constructor(name: string) {
    this.aName = name;
  }

  name(): string {
    return this.aName;
  }

  summaryString(): string {
    const summary = this.summary();
    const rangeString = summary.min
      ? `Min: ${summary.min} Max: ${summary.max}    `
      : '';
    const percentiles = summary.twentyFifthPercentile
      ? `25%: ${summary.twentyFifthPercentile}  50%: ${summary.median}  75%: ${
          summary.seventyFifthPercentile
        }`
      : '';
    const categories = summary.categories
      ? `Categories: ${summary.categories.join(', ')}`
      : '';
    return `Name: ${
      summary.name
    }    ${rangeString}${percentiles}${categories}`.trim();
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
  abstract median(): number | string | Date | null;
  /** percentile by nearest-rank method */
  abstract percentile(rawRatio: number): number | string | Date | null;
}
