// rollup config

/* eslint-disable */
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const uglify = require('rollup-plugin-uglify').uglify;
/* eslint-enable */


module.exports = function getRollupConfigs(type) {
  return {
    input: 'src/index.js',
    output: type === 'cjs'
      ? {
        file: 'dist/index.js',
        format: 'cjs',
      } : {
        file: 'dist/index.es.js',
        format: 'es',
      },
    plugins: [
      ((process.env.NODE_ENV === 'production' && type === 'cjs') && uglify()),
      postcss({
        extract: type === 'cjs',
      }),
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
};
