import { DataFrame } from './DataFrame';
import { Type } from './DataFrameParser';

const shirtSizes = ['S', 'M', 'L', 'XL'];

const csv = `
  name, gender,height, weight, dob, shirt size
  fred,m, 72, 195, 03/06/1951, XL
  
  wilma,f, 65, 110, 05/01/1956, M
  barney, m,70,190, 04/01/1955, L
  `;

const csvWithMissing = `
  name,gender, height, weight, dob, shirt size
  fred,m, 72, 195, 3/6/1951, XL
  wilma,f, 65, , , M
  barney,m,70,190, 4/1/1955, L
  `;

const csvNoHeader = `

  fred,m, 72, 195, 1951-03-06, XL
  wilma,f, 65, , 1956-05-01, M
  barney,m,70,190, 1955-04-01,L
  `;

const columnAsString = (df: DataFrame, columnName: string) => {
  return df
    .column(columnName)
    .values()
    .join();
};

test('parse csv perfect data', () => {
  const df = DataFrame.parseCSV(csv, {
    columns: { 'shirt size': { orderedCategories: shirtSizes } },
  });
  expect(df.dimensions().columns).toEqual(6);
  expect(df.dimensions().rows).toEqual(3);
  expect(columnAsString(df, 'name')).toEqual('fred,wilma,barney');
  expect(columnAsString(df, 'gender')).toEqual('m,f,m');
  expect(columnAsString(df, 'height')).toEqual('72,65,70');
  expect(columnAsString(df, 'weight')).toEqual('195,110,190');
  expect(columnAsString(df, 'shirt size')).toEqual('XL,M,L');

  const barneysBirthday = df.column('dob').values()[2] as Date;
  expect(barneysBirthday.getFullYear()).toBe(1955);
  expect(barneysBirthday.getFullYear()).toBe(1955);
  expect(barneysBirthday.getMonth()).toBe(3);
  expect(barneysBirthday.getDate()).toBe(1);

  const genderCategories = df.column('gender').categories();
  expect(genderCategories.join()).toBe('f,m');

  const sizeCategories = df.column('shirt size').categories();
  expect(sizeCategories.join()).toBe('S,M,L,XL');
});

test('parse perfect data', () => {
  const df = DataFrame.parse(csv, ',', {
    columns: { 'shirt size': { orderedCategories: shirtSizes } },
  });
  expect(df.dimensions().columns).toEqual(6);
  expect(df.dimensions().rows).toEqual(3);

  const sizeCategories = df.column('shirt size').categories();
  expect(sizeCategories.join()).toBe('S,M,L,XL');
});

test('parse csv missing data', () => {
  const df = DataFrame.parseCSV(csvWithMissing, {
    columns: { 'shirt size': { orderedCategories: shirtSizes } },
  });
  expect(df.dimensions().columns).toEqual(6);
  expect(df.dimensions().rows).toEqual(3);
  expect(columnAsString(df, 'name')).toEqual('fred,wilma,barney');
  expect(columnAsString(df, 'gender')).toEqual('m,f,m');
  expect(columnAsString(df, 'height')).toEqual('72,65,70');
  expect(columnAsString(df, 'weight')).toEqual('195,,190');

  const sizeCategories = df.column('shirt size').categories();
  expect(sizeCategories.join()).toBe('S,M,L,XL');
});

test('parse provided header', () => {
  const df = DataFrame.parse(csvNoHeader, ',', {
    columnNames: ['Name', 'Gender', 'Height', 'Weight', 'DOB', 'Size'],
    columns: {
      DOB: { dateFormat: 'YYYY-MM-DD' },
      Size: { orderedCategories: shirtSizes },
    },
  });
  expect(df.dimensions().columns).toEqual(6);
  expect(df.dimensions().rows).toEqual(3);
  expect(columnAsString(df, 'Name')).toEqual('fred,wilma,barney');
  expect(df.column('Name').categories().length).toBe(3);
  expect(df.column('Height').mean()).toBe((72 + 65 + 70) / 3);
  expect(df.column('Weight').mean()).toBe((195 + 190) / 2);
  expect(columnAsString(df, 'Size')).toEqual('XL,M,L');
  const sizeCategories = df.column('Size').categories();
  expect(sizeCategories.join()).toBe('S,M,L,XL');

  const barneysBirthday = df.column('DOB').values()[2] as Date;
  expect(barneysBirthday.getFullYear()).toBe(1955);
  expect(barneysBirthday.getMonth()).toBe(3);
  expect(barneysBirthday.getDate()).toBe(1);
});

test('parse force text column', () => {
  const df = DataFrame.parseCSV(csv, {
    columns: { name: { type: Type.Text } },
  });
  expect(df.dimensions().columns).toEqual(6);
  expect(df.dimensions().rows).toEqual(3);
  expect(columnAsString(df, 'name')).toEqual('fred,wilma,barney');
  expect(columnAsString(df, 'gender')).toEqual('m,f,m');
  expect(columnAsString(df, 'height')).toEqual('72,65,70');
  expect(columnAsString(df, 'weight')).toEqual('195,110,190');
  expect(() => df.column('name').categories()).toThrow(Error);
  const sizeCategories = df.column('shirt size').categories();
  expect(sizeCategories.join()).toBe('L,M,XL');
});

test('ordinal requires hint', () => {
  const df = DataFrame.parseCSV(csv);
  expect(df.dimensions().columns).toEqual(6);
  expect(df.dimensions().rows).toEqual(3);
  expect(columnAsString(df, 'name')).toEqual('fred,wilma,barney');
  expect(columnAsString(df, 'gender')).toEqual('m,f,m');
  expect(columnAsString(df, 'height')).toEqual('72,65,70');
  expect(columnAsString(df, 'weight')).toEqual('195,110,190');
  const sizeCategories = df.column('shirt size').categories();
  expect(sizeCategories.join()).toBe('L,M,XL');
});

test('ordinal requires hint', () => {
  const df = DataFrame.parse(csv, ',');
  expect(df.dimensions().columns).toEqual(6);
  expect(df.dimensions().rows).toEqual(3);
  expect(columnAsString(df, 'name')).toEqual('fred,wilma,barney');
  expect(columnAsString(df, 'gender')).toEqual('m,f,m');
  expect(columnAsString(df, 'height')).toEqual('72,65,70');
  expect(columnAsString(df, 'weight')).toEqual('195,110,190');
  const sizeCategories = df.column('shirt size').categories();
  expect(sizeCategories.join()).toBe('L,M,XL');
});

test('parse rename headers', () => {
  const df = DataFrame.parse(csv, ',', {
    replacementNames: [
      'Name',
      'Gender',
      'Height',
      'Weight',
      'Birth Date',
      'Size',
    ],
    columns: { Size: { orderedCategories: shirtSizes } },
  });
  expect(df.dimensions().columns).toEqual(6);
  expect(df.dimensions().rows).toEqual(3);
  expect(columnAsString(df, 'Name')).toEqual('fred,wilma,barney');
  expect(df.column('Name').categories().length).toBe(3);
  expect(df.column('Height').mean()).toBe((72 + 65 + 70) / 3);
  expect(df.column('Weight').mean()).toBe((195 + 110 + 190) / 3);
  expect(columnAsString(df, 'Size')).toEqual('XL,M,L');
  const sizeCategories = df.column('Size').categories();
  expect(sizeCategories.join()).toBe('S,M,L,XL');
});
