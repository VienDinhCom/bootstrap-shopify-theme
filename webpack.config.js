const path = require('path');
const cp = require('child_process');
const Encore = require('@symfony/webpack-encore');
const postcssPresetEnv = require('postcss-preset-env');

const src = path.resolve('src');
const dest = path.resolve('theme/assets');

Encore
  // sources
  .addEntry('main', path.join(src, 'main.js'))
  .addEntry('vendor', path.join(src, 'vendor/index.js'))

  // destination
  .setOutputPath(dest)
  .setPublicPath('/')

  // features
  .enableSassLoader()
  .autoProvidejQuery()
  .disableSingleRuntimeChunk()
  .enableSourceMaps(Encore.isDev())
  .enablePostCssLoader((options) => {
    options.postcssOptions = {
      plugins: [postcssPresetEnv()],
    };
  })
  .configureBabelPresetEnv((config) => {
    config.useBuiltIns = 'usage';
    config.corejs = 3;
  })
  .configureImageRule({
    filename: '[name].[hash:8][ext]',
  })
  .configureFontRule({
    filename: '[name].[hash:8][ext]',
  })
  .cleanupOutputBeforeBuild([], () => {
    cp.spawnSync('git', ['clean', '-xdf', dest], { stdio: 'inherit' });
  });

module.exports = Encore.getWebpackConfig();
