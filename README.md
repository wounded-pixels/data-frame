# resampling

Tools and demos for resampling in statistics
DataFrame type thing in TypeScript

## Todo

- encapsulation of values? X

Columns

- Base class for columns - name, length, values X
- Categorical column X
- Text column X
- parse for text vs categorical X
- Ordinal column
- Date / time column

DataFrameParser - Read from csv

- basic with headers in csv X
- headers from client code X
- refactor with per column hints X
- rename over top of headers in csv X
- handle blank lines X
- test vs dplyr
- test vs Pandas

DataFrame descriptive stats

- dimensions X

Column descriptive stats

- mean X
- max X
- min X
- median X
- percentiles X
- Other percentiles? Need more here. So many ways...
- bins

Summaries

- summary object per column X
- summary object for data frame X

Population

- Specify category for population X
- Specify mix of categories. Map of numbers? 1,2 => 1/3, 2/3
- Ability to merge multiple data frames to form one large set with differences
- Shuffle - maybe sample wo replacement
- Calculate column (mutate?)
- Group by - stats by group

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
