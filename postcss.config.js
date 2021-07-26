const fs = require('fs');
const os = require('os');
const path = require('path');
const pluralize = require('pluralize');
const modules = require('postcss-modules');
const autoprefixer = require('autoprefixer');

const cssModulesJsonFolder = os.tmpdir();

function createPrefix(filename) {
  const slugs = filename
    .replace(path.join(__dirname, 'src'), '')
    .split(path.sep)
    .filter((item) => item);

  return slugs
    .map((slug, index) => {
      if (slugs.length - 1 === index) {
        return slug.split('.').slice(0, -1).join('.');
      }

      return pluralize.singular(slug);
    })
    .join('-');
}

module.exports = {
  plugins: [
    autoprefixer,
    modules({
      getJSON: (filename, json) => {
        const cssFileName = createPrefix(filename);
        const jsonFileName = path.join(cssModulesJsonFolder, `${cssFileName}.json`);

        fs.writeFileSync(jsonFileName, JSON.stringify(json));
      },
      generateScopedName: (name, filename) => {
        const prefix = createPrefix(filename);
        const ruleset = name === 'host' ? '' : name;

        return prefix + ruleset;
      },
    }),
  ],
};
