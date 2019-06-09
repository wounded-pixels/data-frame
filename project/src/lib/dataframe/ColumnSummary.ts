export type ColumnSummary = {
  name: string;
  readonly categories?: string[];
  max?: number | Date | null;
  mean?: number;
  min?: number | Date | null;
  twentyFifthPercentile?: number | Date | null;
  median?: number | Date | null;
  seventyFifthPercentile?: number | Date | null;
};
