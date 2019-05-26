import moment from 'moment';

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
      const wholeIndex = Math.min(
        Math.round(decimalIndex),
        this.sortedTimesInMilliseconds.length - 1
      );

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
      twentyFifthPercentile: this.percentile(0.25),
      median: this.median(),
      seventyFifthPercentile: this.percentile(0.75),
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

  // returns a DateColumn unless less than acceptanceRatio of non-empty values are non-numeric
  // it can be sparse, but it must be at least acceptanceRatio numbers
  static parse(
    name: string,
    rawValues: (string | number | null | undefined)[],
    dateFormat: string,
    acceptanceRatio: number = 0.8
  ): DateColumn | null {
    // map everything to either a valid date or null
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

      return moment('' + raw, dateFormat).valueOf();
    });

    const missingAndBadCount = values.filter(value => !value).length;
    const goodCount = values.length - missingAndBadCount;
    const badCount = missingAndBadCount - missingCount;
    const goodRatio = goodCount / (goodCount + badCount);
    return goodRatio > acceptanceRatio ? new DateColumn(name, values) : null;
  }
}
