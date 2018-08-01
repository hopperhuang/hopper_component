const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Glob = require('glob');

function getFiles() {
  const reg = /^\.\/example\/src\/pages\/(.+)\/index.js$/;
  const files = Glob.sync('./example/src/pages/**/index.js');
  // eslint-disable-next-line
  const _filenames = files.map(file => reg.exec(file));
  const filenames = _filenames.map(file => [file[1], file[0]]);
  return filenames;
}

function getComponentEntrys() {
  const fileEntrys = {};
  const files = getFiles();
  files.forEach((file) => {
    const entryName = file[0];
    const entryPath = file[1];
    fileEntrys[entryName] = entryPath;
  });
  return fileEntrys;
}

// eslint-disable-next-line
function getComponentHtmlPlugins() {
  const files = getFiles();
  const htmlPlugins = files.map(file => new HtmlWebpackPlugin({ // html webpack plugin 配置
    filename: `./${file[0]}/index.html`, // 生成的html存放路径，相对于path
    // template: `./src/pages/${file[0]}/index.ejs`,
    template: `./example/src/pages/${file[0]}/index.html`,
    inject: 'body', // js插入的位置，true/'head'/'body'/false
    hash: false, // 为静态资源生成hash值
    chunks: [file[0]], // 需要引入的chunk，不配置就会引入所有页面的资源
    // links: [
    //   // 加入reset.css
    //   '/assets/css/reset.css',
    // ],
    // scripts: [
    //   // 引入flex
    //   '/assets/js/flex.js',
    // ],
  }));
  return htmlPlugins;
}


function getEntrys() {
  const componentEntry = getComponentEntrys();
  const indexEntry = './example/src/index.js';
  const entry = { index: indexEntry, ...componentEntry };
  return entry;
}

function getHtmlPlugins() {
  const componentHtmlPlugins = getComponentHtmlPlugins();
  const indexHtmlPlugin = new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './example/src/index.html',
    chunks: ['index'],
  });
  const htmlPlugins = [indexHtmlPlugin, ...componentHtmlPlugins];
  return htmlPlugins;
}


// const entry = getEntrys();
//   const htmlPlugins = getHtmlPlugins();

function getWebpackConfigs() {
  const entry = getEntrys();
  const htmlPlugins = getHtmlPlugins();
  return {
    mode: 'production',
    entry,
    output: {
      path: path.resolve(__dirname, 'example/dist'),
      filename: '[name].js',
      publicPath: '/',
    },
    resolve: {
      alias: {
        dist: path.resolve(__dirname, 'dist/'),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(['example/dist']),
      ...htmlPlugins,
    ],
  };
}

module.exports = getWebpackConfigs;

// module.exports = {
//   mode: 'production',
//   entry,
//   output: {
//     path: path.resolve(__dirname, 'example/dist'),
//     filename: '[name].js',
//     publicPath: '/',
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         loader: 'babel-loader',
//       },
//       {
//         test: /\.css$/,
//         use: ['style-loader', 'css-loader'],
//       },
//     ],
//   },
//   plugins: [
//     new CleanWebpackPlugin(['example/dist']),
//     ...htmlPlugins,
//   ],
// };
