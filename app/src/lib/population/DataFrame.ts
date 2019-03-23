// @ts-ignore
import random from 'random';

import {NumericalColumn} from './NumericalColumn';

export class DataFrame {
  height: number;
  columnMap: {[key: string]: NumericalColumn} = {};
  // TODO need base Column class? how to handle things that have numerical methods vs not?

  constructor(columns: NumericalColumn[]) {
    this.height = columns[0].length;

    columns.forEach(column => {
      this.columnMap[column.name] = column;
      if (this.height !== column.length) {
        throw new Error('All columns must have the same length');
      }
    });
  }

  column(name: string): NumericalColumn {
    return this.columnMap[name];
  }

  sampleWithReplacement(size: number) {
    const indexes: number[] = [];
    for (let ctr=0; ctr < size; ctr++) {
      indexes.push(random.int(0, this.height-1));
    }

    const sampleColumns: NumericalColumn[] = Object.values(this.columnMap).map(column => {
      const newValues = indexes.map(index => {
        return column.values[index];
      });

      return new NumericalColumn(column.name, newValues);
    });

    return new DataFrame(sampleColumns);
  }
}