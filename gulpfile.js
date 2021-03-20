/*
 [x] Auto format html
 [x] Minify CSS
 [x] JS Babel
 [x] Minify JS
 [x] Theme Kit for Node
 [] Bundle vendor
*/

const gulp = require('gulp');
const themeKit = require('@shopify/themekit');
const plugins = require('gulp-load-plugins')();

function parse(type) {
  return plugins.tap(function (file) {
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
    .pipe(plugins.prettier({ parser: 'html' }))
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
    .src(sources)
    .pipe(parse('style'))
    .pipe(plugins.concat('style.scss'))
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer())
    .pipe(plugins.cssnano())
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('scripts', () => {
  return gulp
    .src(sources)
    .pipe(parse('script'))
    .pipe(plugins.concat('script.js'))
    .pipe(plugins.babel({ presets: ['@babel/env'] }))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('config', () => {
  return gulp.src('src/config/*.json').pipe(gulp.dest('dist/config'));
});

gulp.task('locales', () => {
  return gulp.src('src/locales/*.json').pipe(gulp.dest('dist/locales'));
});

gulp.task('clean', function () {
  return gulp.src('dist/*').pipe(plugins.clean({ force: true }));
});

gulp.task('prepare', function () {
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

const build = gulp.parallel(
  'templates',
  'styles',
  'scripts',
  'config',
  'locales'
);

gulp.task('build', gulp.series('clean', 'prepare', build));

gulp.task('watch', function () {
  gulp.watch([...sources, 'src/**/*.json'], build);
  themeKit.command('watch', { env: 'development', allowLive: true });
});

gulp.task('dev', gulp.series('build', 'watch'));
