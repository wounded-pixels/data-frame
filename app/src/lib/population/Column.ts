export abstract class Column {
  private readonly aName: string;

  protected constructor(name: string) {
    this.aName = name;
  }

  name(): string {
    return this.aName;
  }

  abstract length(): number;
  abstract values(): (number | string)[];
  abstract mean(): number;
  abstract sum(): number;
  abstract fromIndexes(indexes: number[]): Column;
  abstract bind(bottom: Column): Column;
}
