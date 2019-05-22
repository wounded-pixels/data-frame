import { Column, ColumnSummary } from './Column';

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
