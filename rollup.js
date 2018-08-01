/* eslint-disable */
const webpack = require("webpack");
const rollup = require('rollup');
// const config = require('./config');
const getRollupConfigs = require('./config');
const getWebpackConfigs = require('./webpack.config');
const handler = require('serve-handler');
const http = require('http');
const Glob = require('glob');
var bs = require("browser-sync").create();
// const postcss = require('postcss');
// const fs = require('fs');
/* eslint-enable */

const copyUtils = require('./utils/copyfile');
const postcss = require('./postcss');

const env = process.env.NODE_ENV;

// eslint-disable-next-line
const { copyFiles, readFile } = copyUtils;

// rollup build configs

const cjsConfig = getRollupConfigs('cjs');
const cjsInputOptions = {
  input: cjsConfig.input,
  external: cjsConfig.external,
  plugins: cjsConfig.plugins,
};

const ejsConfig = getRollupConfigs('ejs');
const ejsInputOptions = {
  input: ejsConfig.input,
  external: ejsConfig.external,
  plugins: ejsConfig.plugins,
};

// get cjs output cofig when develop
const cjsOption = cjsConfig.output;
const ejsOption = ejsConfig.output;


// build cjs
async function buildCjs() {
  // create a bundle
  const bundle = await rollup.rollup(cjsInputOptions);

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
  const bundle = await rollup.rollup(ejsInputOptions);
  await bundle.write(ejsOption);
}


// server configs to serve example dist file
let server;


function startServer() {
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
        reloadThrottle: 1500,
        // server: ''
      });
      console.log('Running at http://localhost:9000');
    });
  }
}


// webpack configs complie example
const webpackConfig = getWebpackConfigs();
// compile example with webpack
let compiler;
if (env !== 'production') {
  compiler = webpack(webpackConfig);
}
let webpackWatcher;
const compileExample = () => {
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
      console.log('webpack-errror: ', stats.toString({ color: true }));
    } else {
      const logs = stats.toString ? stats.toString({ colors: true }) : 'waiting for watching ....';
      console.log(logs);

      // serve for dist
      startServer();
    }
  });
};

// copy css in src folder to dist folder

// get css files' filenames

function getCssFiles() {
  // const filenames;
  const reg = /^\.\/src\/(.+)\/index.css$/;
  const files = Glob.sync('./src/**/index.css');
  // eslint-disable-next-line
  const _filenames = files.map(file => reg.exec(file));
  const filenames = _filenames.map(file => [file[1], file[0]]);
  const cssfiles = filenames.map(file => ({
    src: file[1],
    dist: `./dist/${file[0]}.css`,
  }));
  return cssfiles;
}

// use postcss to compile css files and move it to the dist folder

const { postcssComplieFile } = postcss;

const postcssAndCopyFiles = () => {
  const cssfiles = getCssFiles();
  const tasks = cssfiles.map((file) => {
    const { src, dist } = file;
    return readFile(src).then(content => postcssComplieFile(content, src, dist));
  });
  return Promise.all(tasks).catch((err) => { console.log(err); });
};


// rollup compile process
if (env === 'production') {
  const buildTask = async () => {
    await buildCjs();
    await buildEjs();
    await postcssAndCopyFiles();
    // copyCssFilesToDist();
  };
  buildTask();
} else {
  // rollup configs for compile

  // build file and watch file
  // just build cjs format
  const outputOptions = cjsOption;
  const watchOptions = {
    ...cjsInputOptions,
    output: [outputOptions],
    watch: {
      chokidar: {
        atomic: 2000,
      },
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
      // postcss compile csss and move them to dist
      postcssAndCopyFiles().then(() => compileExample());
    },
    ERROR: (event) => { console.log('encounter an error when bundle'); console.log(event); },
    FATAL: (event) => { console.log('unrecoverable error'); console.log(event); },
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
    if (webpackWatcher) {
      webpackWatcher.close();
    }
    if (server) {
      // exit browser sync
      bs.exit();
      // close server
      server.close(() => {
      // console.log('close server......');
      });
      console.log('close server ......');
    }

    console.log('exit ......');
  });
}
