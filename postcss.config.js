const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');
const modules = require('postcss-modules');
const autoprefixer = require('autoprefixer');

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
      globalModulePaths: ['node_modules', 'global'],
      generateScopedName: (name, filename) => {
        const prefix = createPrefix(filename);
        const ruleset = name === 'host' ? '' : name;

        return prefix + ruleset;
      },
      getJSON: (filename, json) => {
        const cssFileName = createPrefix(filename);
        const cssModulesJsonFolder = path.resolve('.cache/others/css-modules');
        const jsonFileName = path.join(cssModulesJsonFolder, `${cssFileName}.json`);

        fs.mkdirSync(cssModulesJsonFolder, { recursive: true });
        fs.writeFileSync(jsonFileName, JSON.stringify(json));
      },
    }),
  ],
};
