import { Column } from './Column';
import { ColumnSummary } from './ColumnSummary';

import { clamp } from '../util/math';

export class OrdinalColumn extends Column {
  private readonly indexes: (number | null)[] = [];
  private readonly orderedCategories: string[];
  private readonly sortedIndexes: number[] = [];

  constructor(
    name: string,
    orderedCategories: string[],
    rawValues: (string | null)[]
  ) {
    super(name);
    this.orderedCategories = orderedCategories;
    this.indexes = rawValues.map(value => {
      const index = value !== null ? this.orderedCategories.indexOf(value) : -1;
      return index >= 0 ? index : null;
    });
    const nonNulls = this.indexes.filter(index => index !== null) as number[];
    this.sortedIndexes = nonNulls.sort();
  }

  length(): number {
    return this.indexes.length;
  }

  mean(): number {
    throw new Error('no mean for Ordinal column');
  }

  sum(): number {
    throw new Error('no sum for Ordinal column');
  }

  min(): number {
    throw new Error('no min for Ordinal column');
  }

  max(): number {
    throw new Error('no max for Ordinal column');
  }

  median(): string | null {
    return this.percentile(0.5);
  }

  percentile(rawRatio: number): string | null {
    if (this.sortedIndexes.length === 0) {
      return null;
    }

    const ratio = clamp(0, 1, rawRatio);

    if (this.sortedIndexes.length % 2 === 0) {
      // even length
      const decimalIndex = ratio * this.sortedIndexes.length;
      const wholeIndex = Math.min(
        Math.round(decimalIndex),
        this.sortedIndexes.length - 1
      );

      const averageIndex =
        (this.sortedIndexes[wholeIndex] + this.sortedIndexes[wholeIndex - 1]) /
        2;
      const index = clamp(
        0,
        this.orderedCategories.length - 1,
        Math.round(averageIndex)
      );
      return this.orderedCategories[this.sortedIndexes[index]];
    } else {
      // odd length
      const decimalIndex = ratio * (this.sortedIndexes.length - 1);
      const index = Math.ceil(decimalIndex);
      return this.orderedCategories[this.sortedIndexes[index]];
    }
  }

  /** copy of values */
  values(): (string | null)[] {
    return this.indexes.map(index => {
      return index !== null ? this.orderedCategories[index] : null;
    });
  }

  /** copy of categories */
  categories(): string[] {
    return [...this.orderedCategories];
  }

  fromRowIndexes(indexes: number[]): Column {
    const newValues = indexes.map(rowIndex => {
      const categoryIndex = this.indexes[rowIndex];
      return categoryIndex !== null
        ? this.orderedCategories[categoryIndex]
        : null;
    });

    return new OrdinalColumn(this.name(), this.orderedCategories, newValues);
  }

  bind(bottom: Column): Column {
    const bottomCC = bottom as OrdinalColumn;
    return new OrdinalColumn(
      this.name(),
      this.orderedCategories,
      this.values().concat(bottomCC.values())
    );
  }

  summary(): ColumnSummary {
    return {
      name: this.name(),
      categories: this.categories(),
    };
  }

  static parse(
    name: string,
    orderedCategories: string[],
    rawValues: (string | number | null | undefined)[]
  ): OrdinalColumn {
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
    return new OrdinalColumn(name, orderedCategories, values);
  }
}
