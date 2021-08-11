const fs = require('fs');
const glob = require('glob');
const path = require('path');

const themeDir = 'theme';
const sourceDir = 'src';

describe('files', () => {
  const moduleDirs = ['layout', 'snippets', 'sections', 'templates'];

  async function matchFiles(pattern) {
    return new Promise((resolve, reject) => {
      glob(pattern, null, (error, files) => {
        if (error) reject(error);
        resolve(files);
      });
    });
  }

  async function checkLiquidFiles(extension) {
    const patterns = moduleDirs.map((folder) => path.join(sourceDir, folder, `**/*.${extension}`));

    for (const pattern of patterns) {
      const files = await matchFiles(pattern);

      const liquidFiles = files.map((file) => {
        return themeDir + file.replace(sourceDir, '').replace(`.${extension}`, '.liquid');
      });

      files.forEach((file, index) => {
        const liquidFile = liquidFiles[index];
        const isNotExisting = !fs.existsSync(liquidFile);
        const isNotIndex = path.basename(file).indexOf('index.') < 0;

        if (isNotExisting && isNotIndex) {
          throw Error(`The ${file} must have its own ${liquidFile}`);
        }
      });
    }
  }

  test('each style file should have its own liquid file', async () => {
    const extensions = ['css', 'scss'];

    for (const extension of extensions) {
      await checkLiquidFiles(extension);
    }
  });

  test('each script file should have its own liquid file', async () => {
    const extensions = ['js', 'mjs', 'jsx', 'vue'];

    for (const extension of extensions) {
      await checkLiquidFiles(extension);
    }
  });
});
