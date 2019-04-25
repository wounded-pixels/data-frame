export class NumericalColumn {
  private readonly aName: string;
  private readonly theValues: number[];

  constructor(name: string, values: number[]) {
    this.aName = name;
    this.theValues = values;
  }

  sum(): number {
      let sum = 0;
      for (let ctr = 0; ctr < this.theValues.length; ctr++) {
          sum += this.theValues[ctr];
      }

      return sum;
  }

  mean(): number {
    return this.sum() / this.length();
  }

  name(): string {
    return this.aName;
  }

  values(): number[] {
      return [...this.theValues];
  }

  length(): number {
      return this.theValues.length;
  }
}