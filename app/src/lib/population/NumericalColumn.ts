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

  // returns a NumericalColumn unless less than acceptanceRatio of non-empty values are non-numeric
  // it can be sparse, but it must be at least acceptanceRatio numbers
  static parse(
    name: string,
    rawValues: (string | number | null | undefined)[],
    acceptanceRatio: number = 0.8
  ): NumericalColumn | null {
    let missingCount = 0;
    const values = rawValues.map(raw => {
      if (raw === null || raw === undefined) {
        missingCount++;
        return null;
      }

      if (('' + raw).trim().length === 0) {
        missingCount++;
        return null;
      }

      return parseFloat('' + raw);
    });

    const missingAndBadCount = values.filter(
      value => !isFinite(value as number)
    ).length;
    const goodCount = values.length - missingAndBadCount;
    const badCount = missingAndBadCount - missingCount;
    const goodRatio = goodCount / (goodCount + badCount);
    return goodRatio > acceptanceRatio
      ? new NumericalColumn(name, values)
      : null;
  }
}
