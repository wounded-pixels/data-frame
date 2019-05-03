import { Column } from './Column';

export class NumericalColumn extends Column {
  private readonly theValues: (number | null)[];

  constructor(name: string, values: (number | null)[]) {
    super(name);
    this.theValues = values;
  }

  sum(): number {
    let sum = 0;
    for (let ctr = 0; ctr < this.theValues.length; ctr++) {
      if (this.theValues[ctr]) {
        sum += this.theValues[ctr] as number;
      }
    }

    return sum;
  }

  mean(): number {
    return this.sum() / this.nonNullLength();
  }

  /** copy of values */
  values(): (number | null)[] {
    return [...this.theValues];
  }

  length(): number {
    return this.theValues.length;
  }

  fromRowIndexes(indexes: number[]): Column {
    const newValues = indexes.map(index => {
      return this.theValues[index];
    });

    return new NumericalColumn(this.name(), newValues);
  }

  bind(bottom: Column): Column {
    const bottomNC = bottom as NumericalColumn;
    return new NumericalColumn(
      this.name(),
      this.values().concat(bottomNC.values())
    );
  }

  categories(): string[] {
    throw new Error('no categories for Numerical column');
  }

  private nonNullLength(): number {
    return this.theValues.filter(value => !!value).length;
  }
}
