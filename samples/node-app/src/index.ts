import { parseCSV, Type } from '@wounded-pixels/data-frame';

const csv = `
  name, gender,height, weight, dob, shirt size
  fred,m, 72, 195, 03/06/1951, XL
  
  wilma,f, 65, 110, 05/01/1956, M
  barney, m,70,190, 04/01/1955, 
  bad entry,m,72,,,
  really bad entry,,,,,
  `;

const calculateBMI = row => {
  return row.weight !== null && row.height !== null
    ? (row.weight * 703) / (row.height * row.height)
    : null;
};

const shirtSizes = ['S', 'M', 'L', 'XL'];

const df = parseCSV(csv, {
  columns: {
    'shirt size': { orderedCategories: shirtSizes },
    name: { type: Type.Text },
  },
});

df.createColumn('bmi with nulls', calculateBMI);
console.log('\n\nas is + new column');
console.log(df.summaryString());
console.log('\n');
console.log(df.toCSV());

const usefulData = df
  .filter()
  .on('height', height => height !== null)
  .on('weight', weight => weight !== null)
  .take();
usefulData.createColumn('bmi', calculateBMI);
console.log('\n\nfiltered + new column');
console.log(usefulData.summaryString());
console.log('\n');
console.log(usefulData.toCSV());

console.log('\n\n original df is unchanged');
console.log(df.toCSV());
