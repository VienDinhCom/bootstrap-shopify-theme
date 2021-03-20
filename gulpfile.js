/*
 [x] Auto format html
 [x] Minify CSS
 [x] JS Babel
 [x] Minify JS
 [x] Theme Kit for Node
 [x] Bundle CSS Vendors
 [x] Bundle JS Vendors
 [x] Copy Assets
 [] Wrap JS
 [] Wrap CSS
*/

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const themeKit = require('@shopify/themekit');
const plugins = require('gulp-load-plugins')();
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const merge = require('merge-stream');

function parse(type) {
  return plugins.tap((file) => {
    let contents = file.contents?.toString() || '';

    function getTag(tag) {
      const tagStart = contents.indexOf(`<${tag} code>`);
      const contentStart = tagStart + tag.length + 7;
      const contentEnd = contents.indexOf(`</${tag}>`, contentStart);
      const tagEnd = contentEnd + tag.length + 3;

      return {
        tag: contents.substring(tagStart, tagEnd),
        content: contents.substring(contentStart, contentEnd),
      };
    }

    const style = getTag('style');
    const script = getTag('script');

    switch (type) {
      case 'template':
        contents = contents.replace(style.tag, '');
        contents = contents.replace(script.tag, '');
        break;

      case 'style':
        contents = style.content;
        break;

      case 'script':
        contents = script.content;
        break;

      default:
        throw new Error('Could not parse!');
    }

    file.contents = Buffer.from(contents.trim(), 'utf-8');
  });
}

const sources = [
  'src/layout/*.liquid',
  'src/snippets/*.liquid',
  'src/sections/*.liquid',
  'src/templates/**/*.liquid',
];

gulp.task('templates', () => {
  return gulp
    .src(sources)
    .pipe(parse('template'))
    .pipe(
      plugins.if(
        ({ path }) => path.indexOf('/src/layout/') > 0,
        gulp.dest('dist/layout'),
        plugins.if(
          ({ path }) => path.indexOf('/src/snippets/') > 0,
          gulp.dest('dist/snippets'),
          plugins.if(
            ({ path }) => path.indexOf('/src/sections/') > 0,
            gulp.dest('dist/sections'),
            plugins.if(
              ({ path }) => path.indexOf('/src/templates/') > 0,
              gulp.dest('dist/templates')
            )
          )
        )
      )
    );
});

gulp.task('styles', () => {
  return gulp
    .src(['src/assets/global/global.scss', ...sources])
    .pipe(
      plugins.if(
        (file) => path.extname(file.path) === '.liquid',
        parse('style')
      )
    )
    .pipe(plugins.concat('main.scss'))
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(
      plugins.postcss([
        require('postcss-import'),
        require('postcss-copy')({ dest: 'dist/assets' }),
        autoprefixer(),
        cssnano(),
      ])
    )
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('scripts', () => {
  return gulp
    .src(['src/assets/global/global.js', ...sources])
    .pipe(
      plugins.if(
        (file) => path.extname(file.path) === '.liquid',
        parse('script')
      )
    )
    .pipe(plugins.concat('main.js'))
    .pipe(plugins.babel({ presets: ['@babel/env'] }))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('vendors', () => {
  const styles = gulp
    .src('src/assets/vendors/vendor.scss')
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(
      plugins.postcss([
        require('postcss-import'),
        require('postcss-copy')({ dest: 'dist/assets' }),
        autoprefixer(),
        cssnano(),
      ])
    )
    .pipe(gulp.dest('dist/assets'));

  const scriptSource = JSON.parse(
    fs.readFileSync('src/assets/vendors/vendor.json', 'utf-8')
  ).map((path) => `src/assets/vendors/${path}`);

  const scripts = gulp
    .src(scriptSource)
    .pipe(plugins.concat('vendor.js'))
    .pipe(plugins.babel({ presets: ['@babel/env'] }))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist/assets'));

  return merge(styles, scripts);
});

gulp.task('config', () => {
  return gulp.src('src/config/*.json').pipe(gulp.dest('dist/config'));
});

gulp.task('locales', () => {
  return gulp.src('src/locales/*.json').pipe(gulp.dest('dist/locales'));
});

gulp.task('assets', () => {
  return gulp.src('src/assets/*.*').pipe(gulp.dest('dist/assets'));
});

gulp.task('prepare', () => {
  const clean = gulp.src('dist/*').pipe(plugins.clean({ force: true }));

  const folders = gulp
    .src([
      'src/config',
      'src/locales',
      'src/layout',
      'src/snippets',
      'src/sections',
      'src/templates',
    ])
    .pipe(gulp.dest('dist'));

  return merge(clean, folders);
});

const buildAssets = gulp.parallel('assets');
const buildVendors = gulp.parallel('vendors');
const buildJson = gulp.parallel('config', 'locales');
const buildLiquid = gulp.parallel('templates', 'styles', 'scripts');

gulp.task(
  'build',
  gulp.series('prepare', buildAssets, buildJson, buildVendors, buildLiquid)
);

gulp.task('watch', () => {
  gulp.watch(sources, buildLiquid);
  gulp.watch('src/assets/*.*', buildAssets);
  gulp.watch('src/assets/vendors/**/*.*', buildVendors);
  gulp.watch(['src/config/*.json', 'src/locales/*.json'], buildJson);
  themeKit.command('watch', { env: 'development', allowLive: true });
});

gulp.task('dev', gulp.series('build', 'watch'));
