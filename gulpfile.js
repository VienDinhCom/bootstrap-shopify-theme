const fs = require('fs');
const gulp = require('gulp');
const yaml = require('yaml');
const path = require('path');
const browserSync = require('browser-sync');
const themeKit = require('@shopify/themekit');
const plugins = require('gulp-load-plugins')();

const Bundler = require('parcel-bundler');

const entryFile = path.join(__dirname, 'src/main.js');
const outDir = path.join(__dirname, 'dist/assets');

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const config = yaml.parse(fs.readFileSync('config.yml', 'utf-8')).development;

gulp.task('folders', () => {
  return gulp
    .src([
      'src/config',
      'src/locales',
      'src/layout',
      'src/snippets',
      'src/sections',
      'src/templates',
    ])
    .pipe(gulp.dest('dist'));
});

gulp.task('liquid', () => {
  return gulp.src('src/**/*.liquid').pipe(gulp.dest('dist'));
});

gulp.task('bundle', () => {
  return new Bundler(entryFile, {
    outDir,
    watch: isDev,
    minify: isProd,
    sourceMaps: false,
  }).bundle();
});

gulp.task('assets', () => {
  return gulp.src('src/assets/*.*').pipe(gulp.dest('dist/assets'));
});

gulp.task('clean', () => {
  return gulp.src(['dist/*', '.cache/*']).pipe(plugins.clean({ force: true }));
});

gulp.task('config', () => {
  return gulp.src('src/config/*.json').pipe(gulp.dest('dist/config'));
});

gulp.task('locales', () => {
  return gulp.src('src/locales/*.json').pipe(gulp.dest('dist/locales'));
});

gulp.task('watch', () => {
  gulp.task('bundle')();

  gulp.watch('src/**/*.liquid', gulp.parallel('liquid'));

  themeKit.command('watch', {
    allowLive: true,
    env: 'development',
    notify: path.join(__dirname, '.cache/updated'),
  });
});

gulp.task('serve', () => {
  browserSync({
    port: 8080,
    open: false,
    notify: false,
    reloadDelay: 1000,
    proxy: `https://${config.store}/`,
    files: path.join(__dirname, '.cache/updated'),
    snippetOptions: {
      rule: {
        match: /<\/body>/i,
        fn: (snippet, match) => {
          return snippet + match;
        },
      },
    },
  });
});

const prepare = gulp.series('clean', 'folders');
const copy = gulp.parallel('assets', 'config', 'locales', 'liquid');

gulp.task('build', gulp.series(prepare, gulp.parallel(copy, 'bundle')));

gulp.task('dev', gulp.series(prepare, copy, gulp.parallel('watch', 'serve')));
