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
    let sum = 0;
    for (let ctr = 0; ctr < this.values.length; ctr++) {
      sum += this.values[ctr];
    }

    return sum / this.values.length;
  }
}