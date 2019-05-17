import { Column, ColumnSummary } from './Column';

export class CategoricalColumn extends Column {
  private readonly indexes: (number | null)[] = [];
  private readonly theCategories: string[] = [];

  constructor(name: string, rawValues: (string | null)[]) {
    super(name);
    this.theCategories = Array.from(
      new Set(rawValues.filter(value => !!value))
    ).sort() as string[];
    this.indexes = rawValues.map(value => {
      return !value ? null : this.theCategories.indexOf(value);
    });
  }

  length(): number {
    return this.indexes.length;
  }

  mean(): number {
    throw new Error('no mean for Categorical column');
  }

  sum(): number {
    throw new Error('no sum for Categorical column');
  }

  /** copy of values */
  values(): (string | null)[] {
    return this.indexes.map(index => {
      return index !== null ? this.theCategories[index as number] : null;
    });
  }

  /** copy of categories */
  categories(): string[] {
    return [...this.theCategories];
  }

  fromRowIndexes(indexes: number[]): Column {
    const newValues = indexes.map(rowIndex => {
      const categoryIndex = this.indexes[rowIndex];
      return categoryIndex !== null
        ? this.theCategories[categoryIndex as number]
        : null;
    });

    return new CategoricalColumn(this.name(), newValues);
  }

  bind(bottom: Column): Column {
    const bottomCC = bottom as CategoricalColumn;
    return new CategoricalColumn(
      this.name(),
      this.values().concat(bottomCC.values())
    );
  }

  summary(): ColumnSummary {
    const summary = super.summary();
    summary.categories = this.categories();
    return summary;
  }

  static parse(
    name: string,
    rawValues: (string | number | null | undefined)[]
  ): CategoricalColumn {
    const values = rawValues.map(raw => {
      if (raw === null || raw === undefined) {
        return null;
      }

      const asString = ('' + raw).trim();

      if (asString.length === 0) {
        return null;
      }

      return asString;
    });
    return new CategoricalColumn(name, values);
  }
}
