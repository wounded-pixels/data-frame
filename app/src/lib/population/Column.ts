export abstract class Column {
  protected readonly aName: string;
  private readonly aType: string;

  protected constructor(type: string, name: string) {
    this.aType = type;
    this.aName = name;
  }

  type(): string {
    return this.aType;
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
