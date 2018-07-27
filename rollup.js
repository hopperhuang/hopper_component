/* eslint-disable */
const rollup = require('rollup');
const config = require('./config');
/* eslint-enable */

const inputOptions = {
  input: config.input,
  external: config.external,
  plugins: config.plugins,
};


// get cjs output cofig when develop
const cjsOption = config.output[0];
const ejsOption = config.output[1];


// build cjs
async function buildCjs() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);

  //   console.log(bundle.imports); // an array of external dependencies
  //   console.log(bundle.exports); // an array of names exported by the entry point
  //   console.log(bundle.modules); // an array of module objects

  // generate code and a sourcemap
  //   const { code, map } = await bundle.generate(outputOptionsDev);

  //   console.log(code);
  //   console.log(map);

  // or write the bundle to disk
  await bundle.write(cjsOption);
}

// build ejs
async function buildEjs() {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(ejsOption);
}

const env = process.env.NODE_ENV;
if (env === 'production') {
  // build files when in production enviroment
  buildCjs().then(() => { buildEjs(); });
} else {
  // build file and watch file
  // just build cjs format
  const outputOptions = cjsOption;
  const watchOptions = {
    ...inputOptions,
    output: [outputOptions],
    watch: {
      include: 'src/**',
      exclude: [
        'node_modules/**',
        'dist/*',
        'example/**',
      ],
      clearScreen: true,
    },
  };

  const watcher = rollup.watch(watchOptions);
  const eventHandler = {
    START: () => { console.log('start watching ...'); },
    BUNDLE_START: () => { console.log('bundle start'); },
    BUNDLE_END: () => { console.log('bundle end'); },
    END: () => { console.log('all bundle task end'); },
    ERROR: () => { console.log('encounter an error when bundle'); },
    FATAL: () => { console.log('unrecoverable error'); },
  };
  watcher.on('event', (event) => {
    // console.log(event);
    // event.code can be one of:
    //   START        — the watcher is (re)starting
    //   BUNDLE_START — building an individual bundle
    //   BUNDLE_END   — finished building a bundle
    //   END          — finished building all bundles
    //   ERROR        — encountered an error while bundling
    //   FATAL        — encountered an unrecoverable error
    const { code } = event;
    eventHandler[code]();
  });
}
