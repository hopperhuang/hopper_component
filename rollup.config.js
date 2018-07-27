import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
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
