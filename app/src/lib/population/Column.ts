export abstract class Column {
    protected readonly aName: string;

    protected constructor(name: string) {
        this.aName = name;
    }

    name(): string {
        return this.aName;
    }

    abstract length(): number;
}