// @ts-ignore
import random from 'random';

import {DataFrame} from './DataFrame';
import {NumericalColumn} from './NumericalColumn';


abstract class ColumnDefinition {
  name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  abstract generate(size: number): NumericalColumn;
}

class NormalColumnDefinition extends ColumnDefinition {
  mu: number;
  sigma: number;

  constructor(name: string, mu: number, sigma: number) {
    super(name);
    this.mu = mu;
    this.sigma = sigma;
  }

  generate(size: number): NumericalColumn {
    const normalGenerator = random.normal(this.mu, this.sigma);
    const values = [];
    for (let ctr=0;ctr<size;ctr++) {
      values.push(normalGenerator());
    }

    return new NumericalColumn(this.name, values);
  }
}

export class Population {
  columnDefinitions: ColumnDefinition[] = [];

  addNormalColumn(name: string, mu: number, sigma: number): Population {
    this.columnDefinitions.push(new NormalColumnDefinition(name, mu, sigma));
    return this;
  }

  generate(size: number): DataFrame {
    const columns = this.columnDefinitions.map(cd => {
      return cd.generate(size);
    });
    return new DataFrame(columns);
  }
}