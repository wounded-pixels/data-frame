import { DataFrame } from "@wounded-pixels/data-frame";

const csv = `
  name, gender,height, weight, dob, shirt size
  fred,m, 72, 195, 03/06/1951, XL
  
  wilma,f, 65, 110, 05/01/1956, M
  barney, m,70,190, 04/01/1955, L
  `;

const shirtSizes = ["S", "M", "L", "XL"];

const df = DataFrame.parseCSV(csv, {
  columns: { "shirt size": { orderedCategories: shirtSizes } }
});

console.log("df.dimensions()", df.dimensions());
console.log("df.summary()", df.summary());
console.log(df.summary().columns[0].name);

const summary = df.summary();
const nameSummary = summary.columns[0];
const name = nameSummary.name;
console.log(`first column name is ${df.summary().columns[0].name}`);
