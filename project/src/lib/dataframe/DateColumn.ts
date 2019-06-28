import moment from 'moment';

import { Column } from './Column';
import { ColumnSummary } from './ColumnSummary';

import { clamp, percentile } from '../util/math';
import { ValueMutator, ValuePredicate } from './Types';

export class DateColumn extends Column {
  private timesInMilliseconds: (number | null)[];
  private sortedTimesInMilliseconds: number[] = [];

  constructor(name: string, values: (Date | number | null)[]) {
    super(name);
    this.timesInMilliseconds = values.map(value => {
      if (value === null) {
        return null;
      }

      return typeof value === 'object' ? value.getTime() : value;
    });

    this.sort();
  }

  private sort() {
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

  value(index: number): Date | null {
    const valueInMilliseconds = this.timesInMilliseconds[index];
    return valueInMilliseconds ? new Date(valueInMilliseconds) : null;
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

    const percentileTimeInMilliseconds = percentile(
      rawRatio,
      this.sortedTimesInMilliseconds
    );
    return new Date(percentileTimeInMilliseconds);
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

  mutate(predicate: ValuePredicate, mutator: ValueMutator) {
    this.timesInMilliseconds = this.timesInMilliseconds.map(
      millisecondsValue => {
        const value =
          millisecondsValue !== null ? new Date(millisecondsValue) : null;
        const mutatedDate: Date | null = predicate(value)
          ? (mutator(value) as Date | null)
          : value;
        const mutatedMilliseconds =
          mutatedDate !== null ? mutatedDate.getTime() : null;
        return mutatedMilliseconds as number | null;
      }
    );

    this.sort();
  }

  // returns a DateColumn unless less than acceptanceRatio of non-empty values are non-numeric
  // it can be sparse, but it must be at least acceptanceRatio numbers
  static parse(
    name: string,
    rawValues: (string | number | null | undefined)[],
    dateFormat: string = 'MM/DD/YYYY',
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
