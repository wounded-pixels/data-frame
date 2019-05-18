import { Column } from './Column';

export class DateColumn extends Column {
  private readonly timesInMilliseconds: (number | null)[];

  constructor(name: string, values: (Date | number | null)[]) {
    super(name);
    this.timesInMilliseconds = values.map(value => {
      if (value === null) {
        return null;
      }

      return typeof value === 'object' ? value.getTime() : value;
    });
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
