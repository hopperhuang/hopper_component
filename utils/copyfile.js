const fs = require('fs');

function copyFile(source, target) {
  const rd = fs.createReadStream(source);
  const wr = fs.createWriteStream(target);
  return new Promise(((resolve, reject) => {
    rd.on('error', reject);
    wr.on('error', reject);
    wr.on('finish', resolve);
    rd.pipe(wr);
  })).catch((error) => {
    rd.destroy();
    wr.end();
    throw error;
  });
}

function copyFiles(files, callback) {
  const tasks = files.map((file) => {
    const { src, dist } = file;
    return copyFile(src, dist);
  });
  Promise.all(tasks).then(() => {
    if (callback && typeof callback === 'function') {
      callback();
    }
  });
}

// copyFiles([
//   {
//     src: '../src/header.css',
//     dist: '../dist/header.css',
//   },
//   {
//     src: '../src/footer.css',
//     dist: '../dist/footer.css',
//   },
// ]);

module.exports = {
  copyFile,
  copyFiles,
};
