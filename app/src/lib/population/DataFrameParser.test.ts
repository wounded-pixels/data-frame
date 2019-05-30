import { DataFrame } from './DataFrame';
import { Type } from './DataFrameParser';

// TODO: parse ordinals based on hint
const csv = `
  name, gender,height, weight, dob
  fred,m, 72, 195, 03/06/1951
  
  wilma,f, 65, 110, 05/01/1956
  barney, m,70,190, 04/01/1955
  `;

const csvWithMissing = `
  name,gender, height, weight, dob
  fred,m, 72, 195, 3/6/1951
  wilma,f, 65
  barney,m,70,190, 4/1/1955
  `;

const csvNoHeader = `

  fred,m, 72, 195, 1951-03-06
  wilma,f, 65, , 1956-05-01
  barney,m,70,190, 1955-04-01
  `;

const columnAsString = (df: DataFrame, columnName: string) => {
  return df
    .column(columnName)
    .values()
    .join();
};

test('parse csv perfect data', () => {
  const df = DataFrame.parseCSV(csv);
  expect(df.dimensions().columns).toEqual(5);
  expect(df.dimensions().rows).toEqual(3);
  expect(columnAsString(df, 'name')).toEqual('fred,wilma,barney');
  expect(columnAsString(df, 'gender')).toEqual('m,f,m');
  expect(columnAsString(df, 'height')).toEqual('72,65,70');
  expect(columnAsString(df, 'weight')).toEqual('195,110,190');

  const barneysBirthday = df.column('dob').values()[2] as Date;
  expect(barneysBirthday.getFullYear()).toBe(1955);
  expect(barneysBirthday.getFullYear()).toBe(1955);
  expect(barneysBirthday.getMonth()).toBe(3);
  expect(barneysBirthday.getDate()).toBe(1);

  const genderCategories = df.column('gender').categories();
  expect(genderCategories.join()).toBe('f,m');
});

test('parse perfect data', () => {
  const df = DataFrame.parse(csv, ',');
  expect(df.dimensions().columns).toEqual(5);
  expect(df.dimensions().rows).toEqual(3);
});

test('parse csv missing data', () => {
  const df = DataFrame.parseCSV(csvWithMissing);
  expect(df.dimensions().columns).toEqual(5);
  expect(df.dimensions().rows).toEqual(3);
  expect(columnAsString(df, 'name')).toEqual('fred,wilma,barney');
  expect(columnAsString(df, 'gender')).toEqual('m,f,m');
  expect(columnAsString(df, 'height')).toEqual('72,65,70');
  expect(columnAsString(df, 'weight')).toEqual('195,,190');
});

test('parse provided header', () => {
  const df = DataFrame.parse(csvNoHeader, ',', {
    columnNames: ['Name', 'Gender', 'Height', 'Weight', 'DOB'],
    columns: { DOB: { dateFormat: 'YYYY-MM-DD' } },
  });
  expect(df.dimensions().columns).toEqual(5);
  expect(df.dimensions().rows).toEqual(3);
  expect(columnAsString(df, 'Name')).toEqual('fred,wilma,barney');
  expect(df.column('Name').categories().length).toBe(3);
  expect(df.column('Height').mean()).toBe((72 + 65 + 70) / 3);
  expect(df.column('Weight').mean()).toBe((195 + 190) / 2);

  const barneysBirthday = df.column('DOB').values()[2] as Date;
  expect(barneysBirthday.getFullYear()).toBe(1955);
  expect(barneysBirthday.getMonth()).toBe(3);
  expect(barneysBirthday.getDate()).toBe(1);
});

test('parse force text column', () => {
  const df = DataFrame.parseCSV(csv, {
    columns: { name: { type: Type.Text } },
  });
  expect(df.dimensions().columns).toEqual(5);
  expect(df.dimensions().rows).toEqual(3);
  expect(columnAsString(df, 'name')).toEqual('fred,wilma,barney');
  expect(columnAsString(df, 'gender')).toEqual('m,f,m');
  expect(columnAsString(df, 'height')).toEqual('72,65,70');
  expect(columnAsString(df, 'weight')).toEqual('195,110,190');
  expect(() => df.column('name').categories()).toThrow(Error);
});

test('parse rename headers', () => {
  const df = DataFrame.parse(csv, ',', {
    replacementNames: ['Name', 'Gender', 'Height', 'Weight', 'Birth Date'],
  });
  expect(df.dimensions().columns).toEqual(5);
  expect(df.dimensions().rows).toEqual(3);
  expect(columnAsString(df, 'Name')).toEqual('fred,wilma,barney');
  expect(df.column('Name').categories().length).toBe(3);
  expect(df.column('Height').mean()).toBe((72 + 65 + 70) / 3);
  expect(df.column('Weight').mean()).toBe((195 + 110 + 190) / 3);
});
