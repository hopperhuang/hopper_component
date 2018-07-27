/* eslint-disable */
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
/* eslint-enable */

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
    }, {
      file: 'dist/index.es.js',
      format: 'es',
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    nodeResolve({
      jsnext: true,
      main: true,
    }),
    commonjs({
    }),
  ],
  external: [
    'react',
    'react-dom',
  ],
};
