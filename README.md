# data-frame

Tidy data. On the Web.

## Installing
TLDR: ```npm i @wounded-pixels/data-frame --save```

For installation details and usage visit [the project](https://github.com/wounded-pixels/data-frame/blob/master/project/README.md)
or [npm package](https://www.npmjs.com/package/@wounded-pixels/data-frame)

## Contributing

TBD
- lock down and take PRs?


## Mutations

- mutate a column in place pass function Examples:
- Replace negative with null
- To int
- Limit precision

Mutate data frame by creating a new column from a function NEED MORE THOUGHT. Real world exercises from dplyr

- createColumn('adjusted weight', (row) => row.weight/row.height)
- include overall info createColumn('height ratio', (row, summaryMap) => row.height/summaryMap['height'].max

## DataFrameParser - Read from csv

- basic with headers in csv X
- headers from client code X
- refactor with per column hints X
- rename over top of headers in csv X
- handle blank lines X
- test vs dplyr
- test vs Pandas

## DataFrame descriptive stats

- dimensions X

### Column descriptive stats

- mean X
- max X
- min X
- median X
- percentiles X
- Other percentiles? Need more here. So many ways...
- bins

### Summaries

- summary object per column X
- summary object for data frame X
- include percentiles X
- Summary string X

### Population

- Specify category for population X
- Specify mix of categories. Map of numbers? 1,2 => 1/3, 2/3
- Ability to merge multiple data frames to form one large set with differences
- Shuffle - maybe sample wo replacement
- Calculate column (mutate?)
- Group by - stats by group

### Selections

- select(predicate) returns a selection. underlying is not changed
- select on a selection returns another selection... so on
- mutate a selection? set a column value?
  df.select((row) => row.height < 0).mutate(row => row.height = null)
- Selection asDataFrame
- ObservableSelection? onChange callbacks?
- Projection - specify columns
  - by name
  - by predicate
  - Projection asDataFrame
  - Selection and Projection asDataFrame ?
