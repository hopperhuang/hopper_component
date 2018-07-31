/* eslint-disable */
const simplevars = require('postcss-simple-vars');
const nested = require('postcss-nested');
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');
const postcss = require('postcss');
const fs = require('fs');
/* eslint-enable */

const env = process.env.NODE_ENV;

const plugins = [
  simplevars(),
  nested(),
  cssnext({ }),
  (env === 'production' && cssnano()),
].filter(e => !!e);

function getPostcssPlugins() {
  return plugins;
}

const postcssComplieFile = (content, src, dist) => postcss(plugins)
  .process(content, { from: src, to: dist })
  .then((result) => {
    fs.writeFile(dist, result.css, () => true);
    if (result.map) {
      fs.writeFile(dist, result.map, () => true);
    }
  });

module.exports = {
  getPostcssPlugins,
  postcssComplieFile,
};
