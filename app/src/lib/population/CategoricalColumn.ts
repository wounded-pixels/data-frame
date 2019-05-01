import { Column } from './Column';
import { NumericalColumn } from './NumericalColumn';

export class CategoricalColumn extends Column {
  private readonly indexes: number[] = [];
  private readonly theCategories: string[] = [];

  constructor(name: string, rawValues: string[]) {
    super(name);
    this.theCategories = Array.from(new Set(rawValues)).sort();
    this.indexes = rawValues.map(value => {
      return this.theCategories.indexOf(value);
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
  values(): string[] {
    return this.indexes.map(value => {
      return this.theCategories[value];
    });
  }

  /** copy of categories */
  categories(): string[] {
    return [...this.theCategories];
  }

  fromIndexes(indexes: number[]): Column {
    const newValues = indexes.map(row => {
      const index = this.indexes[row];
      return this.theCategories[index];
    });

    return new CategoricalColumn(this.name(), newValues);
  }

  bind(bottom: Column): Column {
    const bottomCC = bottom as CategoricalColumn;
    return new CategoricalColumn(name, this.values().concat(bottomCC.values()));
  }
}
