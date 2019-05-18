import { Column } from './Column';

export class TextColumn extends Column {
  private readonly theValues: (string | null)[];

  constructor(name: string, values: (string | null)[]) {
    super(name);
    this.theValues = values;
  }

  /** copy of values */
  values(): (string | null)[] {
    return [...this.theValues];
  }

  length(): number {
    return this.theValues.length;
  }

  fromRowIndexes(indexes: number[]): Column {
    const newValues = indexes.map(index => {
      return this.theValues[index];
    });

    return new TextColumn(this.name(), newValues);
  }

  bind(bottom: Column): Column {
    const bottomTC = bottom as TextColumn;
    return new TextColumn(this.name(), this.values().concat(bottomTC.values()));
  }

  mean(): number {
    throw new Error('no mean for Text column');
  }

  min(): number {
    throw new Error('no min for Text column');
  }

  max(): number {
    throw new Error('no max for Text column');
  }

  sum(): number {
    throw new Error('no sum for Text column');
  }

  categories(): string[] {
    throw new Error('no categories for Text column');
  }
}
