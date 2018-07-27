import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/indx.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
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
