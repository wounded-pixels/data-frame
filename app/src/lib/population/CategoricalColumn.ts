import { Column } from './Column';

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
}
