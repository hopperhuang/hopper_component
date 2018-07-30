/* eslint-disable */
const webpack = require("webpack");
const rollup = require('rollup');
const config = require('./config');
const webpackConfig = require('./webpack.config');
const handler = require('serve-handler');
const http = require('http');
var bs = require("browser-sync").create();
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

// console.log(process.pid);
// process.on('SIGINT', (code) => {
//   console.log(code);
//   process.exit(0);
// });


const env = process.env.NODE_ENV;
if (env === 'production') {
  // build files when in production enviroment
  buildCjs().then(() => { buildEjs(); });
} else {
  // webpack configs complie example

  // compile example with webpack
  const compiler = webpack(webpackConfig);
  let webpackWatcher;
  const compileExample = () => {
    // webpack(webpackConfig, (err, stats) => {
    //   if (err || stats.hasErrors()) {
    //     // handle errors
    //     console.log('error: ', err);
    //   } else {
    //     // notify browsers to refresh
    //     console.log('examples is compiled .....');
    //     // log webpack details
    //     console.log(stats.toString({
    //       colors: true,
    //     }));
    //   }
    // });
    // close exist watcher
    if (webpackWatcher) {
      webpackWatcher.close();
    }
    // make a new watcher
    webpackWatcher = compiler.watch({
      // watch /example/src files
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: undefined,
    }, (err, stats) => {
      // logger
      if (err || stats.hasErrors()) {
        console.log('error: ', err);
      } else {
        const logs = stats.toString ? stats.toString({ colors: true }) : 'waiting for watching ....';
        console.log(logs);
      }
    });
  };


  // server configs to serve example dist file
  let server;


  const startServer = () => {
    // if sever is not start, start sever
    if (!server) {
      const options = {
        cleanUrls: true,
        public: './example/dist',
      };
      server = http.createServer((request, response) => handler(request, response, options));
      // listen to 3000 prot
      server.listen(3000, () => {
        bs.init({
          open: true,
          ui: false,
          files: 'example/dist',
          notify: false,
          watch: true,
          proxy: 'localhost:3000',
          port: 9000,
          // server: ''
        });
        console.log('Running at http://localhost:9000');
      });
    }
  };


  // rollup configs for compile

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
  // compile src files
  const watcher = rollup.watch(watchOptions);
  const eventHandler = {
    START: () => { console.log('start watching ...'); },
    BUNDLE_START: () => { console.log('bundle start'); },
    BUNDLE_END: () => { console.log('bundle end'); },
    END: () => {
      console.log('all bundle task end');
      // use webpack compile example
      compileExample();
      // serve dist file
      startServer();
    },
    ERROR: (event) => { console.log('encounter an error when bundle'); console.log(event); },
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
    eventHandler[code](event);
  });

  // listen on exit signal clean watcher

  process.on('SIGINT', () => {
    // clean wepback watcher
    webpackWatcher.close();
    // exit browser sync
    bs.exit();
    // close server
    server.close(() => {
      // console.log('close server......');
    });
    console.log('close server ......');
    console.log('exit ......');
  });
}
