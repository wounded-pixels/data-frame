export class NumericalColumn {
  name: string;
  values: number[];
  length: number;

  constructor(name: string, values: number[]) {
    this.name = name;
    this.values = values;
    this.length = values.length;
  }

  mean() {
    const sum = this.values.reduce((previous, current) => {
      return previous+current
    }, 0);
    return sum / this.values.length;
  }
}