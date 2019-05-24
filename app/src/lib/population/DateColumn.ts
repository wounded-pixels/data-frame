import { Column, ColumnSummary } from './Column';
import { clamp } from '../util/math';

export class DateColumn extends Column {
  private readonly timesInMilliseconds: (number | null)[];
  private readonly sortedTimesInMilliseconds: number[];

  constructor(name: string, values: (Date | number | null)[]) {
    super(name);
    this.timesInMilliseconds = values.map(value => {
      if (value === null) {
        return null;
      }

      return typeof value === 'object' ? value.getTime() : value;
    });

    const justNumbers = this.timesInMilliseconds.filter(
      value => value !== null
    ) as number[];
    this.sortedTimesInMilliseconds = justNumbers.sort((a: number, b: number) =>
      Math.sign(a - b)
    );
  }

  /** copy of values */
  values(): (Date | null)[] {
    return [...this.timesInMilliseconds].map(time =>
      time ? new Date(time) : null
    );
  }

  length(): number {
    return this.timesInMilliseconds.length;
  }

  bind(bottom: Column): Column {
    const bottomDC = bottom as DateColumn;
    return new DateColumn(this.name(), this.values().concat(bottomDC.values()));
  }

  fromRowIndexes(indexes: number[]): Column {
    const newTimes = indexes.map(index => {
      return this.timesInMilliseconds[index];
    });

    return new DateColumn(this.name(), newTimes);
  }

  min(): Date | null {
    return this.sortedTimesInMilliseconds[0]
      ? new Date(this.sortedTimesInMilliseconds[0])
      : null;
  }

  max(): Date | null {
    return this.sortedTimesInMilliseconds.length > 0
      ? new Date(
          this.sortedTimesInMilliseconds[
            this.sortedTimesInMilliseconds.length - 1
          ]
        )
      : null;
  }

  median(): Date | null {
    return this.percentile(0.5);
  }

  percentile(rawRatio: number): Date | null {
    if (this.sortedTimesInMilliseconds.length === 0) {
      return null;
    }

    const ratio = clamp(0, 1, rawRatio);

    if (this.sortedTimesInMilliseconds.length % 2 === 0) {
      // even length
      const decimalIndex = ratio * this.sortedTimesInMilliseconds.length;
      const wholeIndex = Math.round(decimalIndex);

      const averageTimeInMilliseconds =
        (this.sortedTimesInMilliseconds[wholeIndex] +
          this.sortedTimesInMilliseconds[wholeIndex - 1]) /
        2;
      return new Date(averageTimeInMilliseconds);
    } else {
      // odd length
      const decimalIndex = ratio * (this.sortedTimesInMilliseconds.length - 1);
      const wholeIndex = Math.ceil(decimalIndex);
      return new Date(this.sortedTimesInMilliseconds[wholeIndex]);
    }
  }

  summary(): ColumnSummary {
    return {
      name: this.name(),
      min: this.min(),
      max: this.max(),
    };
  }

  mean(): number {
    throw new Error('no mean for Date column');
  }

  categories(): string[] {
    throw new Error('no categories for Date column');
  }

  sum(): number {
    throw new Error('no sum for Date column');
  }
}
