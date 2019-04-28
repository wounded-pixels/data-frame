# resampling
Tools and demos for resampling in statistics
DataFrame type thing in TypeScript

## Todo
 * encapsulation of values? Pretty good
 
 Columns
 * Base class for columns - name, length, values
 * Categorical column
 * Text column
 * Ordinal column
 * Read from array and deduce type
 
 DataFrame
 * Read from csv
 * Ability to merge and shuffle multiple data frames to form one large set with differences
 * Calculate column (mutate?)
 * Group by - Groups
   * size
   * mean
   * max
   * min
   * etc
 
 * Selections
    * select(predicate) returns a selection. underlying is not changed
    * select on a selection returns another selection... so on
    * mutate a selection? set a column value?
    df.select((row) => row.height < 0).mutate(row => row.height = null)
    * Selection asDataFrame
    
  * Projection - specify columns
    * by name
    * by predicate
    * Projection asDataFrame
    * Selection and Projection asDataFrame ?
