# resampling
Tools and demos for resampling in statistics
DataFrame type thing in TypeScript

## Todo
 * encapsulation of values?
 * Text column
 * Categorical column
 * Ability to merge and shuffle multiple populations to form one large population with differences
 * Histogram
 * Selections
    * select(predicate) returns a selection. underlying is not changed
    * select on a selection returns another selection... so on
    * mutate a selection? set a column value?
    df.select((row) => row.height < 0).mutate(row => row.height = null)
    

