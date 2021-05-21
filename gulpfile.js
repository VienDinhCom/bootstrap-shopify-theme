const os = require('os');
const gulp = require('gulp');
const path = require('path');
const { exec } = require('child_process');
const readYaml = require('read-yaml-file');
const browserSync = require('browser-sync');
const themekit = require('@shopify/themekit');
const plugins = require('gulp-load-plugins')();

const Bundler = require('parcel-bundler');

const entryFile = path.join(__dirname, 'src/main.js');
const outDir = path.join(__dirname, 'dist/assets');

const { NODE_ENV } = process.env;
const isProd = NODE_ENV === 'production';

const config = readYaml.sync('config.yml')[NODE_ENV];
const watch = path.join(os.tmpdir(), `${config.theme_id}.theme`);

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

gulp.task('bundle', (options) => {
  return new Bundler(entryFile, {
    outDir,
    hmr: false,
    watch: false,
    minify: isProd,
    sourceMaps: false,
    ...options,
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
  gulp.task('bundle')({ watch: true });

  gulp.watch('src/assets/*.*', gulp.parallel('assets'));
  gulp.watch('src/**/*.liquid', gulp.parallel('liquid'));

  gulp.watch('src/config/*.json', gulp.parallel('config'));
  gulp.watch('src/config/*.json', gulp.parallel('config'));

  themekit.command('watch', {
    dir: 'dist',
    env: NODE_ENV,
    allowLive: true,
    notify: watch,
  });
});

gulp.task('serve', () => {
  browserSync({
    port: 8080,
    open: false,
    https: true,
    notify: false,
    reloadDelay: 1500,
    proxy: `https://${config.store}/`,
    files: watch,
    snippetOptions: {
      rule: {
        match: /<\/body>/i,
        fn: (snippet, match) => snippet + match,
      },
    },
  });
});

const prepare = gulp.series('clean', 'folders');
const copy = gulp.parallel('assets', 'config', 'locales', 'liquid');

gulp.task('build', gulp.series(prepare, gulp.parallel(copy, 'bundle')));

gulp.task(
  'test',
  gulp.series('build', function proceeding(callback) {
    exec('theme-check dist', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      callback(err);
    });
  })
);

gulp.task(
  'deploy',
  gulp.series('build', function proceeding() {
    return themekit.command('deploy', {
      dir: 'dist',
      env: NODE_ENV,
      allowLive: true,
    });
  })
);

gulp.task('dev', gulp.series('deploy', gulp.parallel('watch', 'serve')));
