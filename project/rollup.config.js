import typescript from 'rollup-plugin-typescript';

import pkg from './package.json';

export default {
  input: './src/data-frame.ts',
  output: [
    {
      file: 'dist/data-frame.js',
      format: 'cjs',
    },
    {
      file: 'dist/data-frame.es.js',
      format: 'es',
    },
    {
      file: 'dist/data-frame.vanilla.js',
      format: 'iife',
      name: 'DataFrame', // the global which can be used in a browser
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
  ],
};
