// @ts-ignore
import random from 'random';

import { DataFrame } from './DataFrame';
import { NumericalColumn } from './NumericalColumn';
import { Column } from './Column';
import { CategoricalColumn } from './CategoricalColumn';

abstract class ColumnDefinition {
  protected name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  abstract generate(size: number): Column;
}

class NormalColumnDefinition extends ColumnDefinition {
  private readonly mu: number;
  private readonly sigma: number;

  constructor(name: string, mu: number, sigma: number) {
    super(name);
    this.mu = mu;
    this.sigma = sigma;
  }

  generate(size: number): NumericalColumn {
    const normalGenerator = random.normal(this.mu, this.sigma);
    const values = [];
    for (let ctr = 0; ctr < size; ctr++) {
      values.push(normalGenerator());
    }

    return new NumericalColumn(this.name, values);
  }
}

class ConstantCategoryDefinition extends ColumnDefinition {
  private readonly value: string;

  constructor(name: string, value: string) {
    super(name);
    this.value = value;
  }

  generate(size: number): CategoricalColumn {
    const values = [];
    for (let ctr = 0; ctr < size; ctr++) {
      values.push(this.value);
    }

    return new CategoricalColumn(this.name, values);
  }
}

export class Population {
  columnDefinitions: ColumnDefinition[] = [];

  addNormalColumn(name: string, mu: number, sigma: number): Population {
    this.columnDefinitions.push(new NormalColumnDefinition(name, mu, sigma));
    return this;
  }

  addCategoricalColumn(name: string, value: string): Population {
    this.columnDefinitions.push(new ConstantCategoryDefinition(name, value));
    return this;
  }

  generate(size: number): DataFrame {
    const columns = this.columnDefinitions.map(cd => {
      return cd.generate(size);
    });
    return new DataFrame(columns);
  }
}
