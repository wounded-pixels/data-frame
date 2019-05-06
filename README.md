# resampling

Tools and demos for resampling in statistics
DataFrame type thing in TypeScript

## Todo

- encapsulation of values? X

Columns

- Base class for columns - name, length, values X
- Categorical column X
- Text column
- Ordinal column
- Read from array and deduce type X

Population

- Specify category for population X
- Specify mix of categories. Map of numbers? 1,2 => 1/3, 2/3

DataFrame

- Read from csv
  - basic with headers in source X
  - headers from client code X
- Ability to merge multiple data frames to form one large set with differences
- Shuffle - maybe sample wo replacement
- Calculate column (mutate?)
- Group by - stats by group

- Descriptive stats

  - size
  - mean
  - max
  - min
  - median
  - percentiles Need more here. So many ways...
  - etc

- Selections
  - select(predicate) returns a selection. underlying is not changed
  - select on a selection returns another selection... so on
  - mutate a selection? set a column value?
    df.select((row) => row.height < 0).mutate(row => row.height = null)
  - Selection asDataFrame
- Projection - specify columns
  - by name
  - by predicate
  - Projection asDataFrame
  - Selection and Projection asDataFrame ?
