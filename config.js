// rollup config

/* eslint-disable */
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const uglify = require('rollup-plugin-uglify').uglify;
/* eslint-enable */

const postcssUtils = require('./postcss');

const postcssPlugins = postcssUtils.getPostcssPlugins();


module.exports = function getRollupConfigs(type) {
  const env = process.env.NODE_ENV;
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
      ((env === 'production' && type === 'cjs') && uglify()),
      postcss({
        extract: type === 'cjs',
        plugins: postcssPlugins,
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
