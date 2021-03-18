const gulp = require('gulp');
const cheerio = require('cheerio');
const plugins = require('gulp-load-plugins')();

function parse(type) {
  return plugins.tap(function (file) {
    const $ = cheerio.load(file.contents?.toString() || '');

    let contents = '';

    switch (type) {
      case 'template':
        contents = $('template[code]').html() || '';
        break;

      case 'style':
        contents = $('style[code]').html() || '';
        break;

      case 'script':
        contents = $('script[code]').html() || '';
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
  'src/templates/*.liquid',
];

gulp.task('templates', () => {
  return gulp.src(sources).pipe(parse('template')).pipe(gulp.dest('dist'));
});

gulp.task('styles', () => {
  return gulp
    .src(sources)
    .pipe(parse('style'))
    .pipe(plugins.concat('style.scss'))
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer())
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('scripts', () => {
  return gulp
    .src(sources)
    .pipe(parse('script'))
    .pipe(plugins.concat('script.js'))
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('clean', function () {
  return gulp.src('dist/*').pipe(plugins.clean({ force: true }));
});

gulp.task(
  'build',
  gulp.series('clean', gulp.parallel('templates', 'styles', 'scripts'))
);

gulp.task('watch', function () {
  plugins.watch(sources, gulp.parallel('templates', 'styles', 'scripts'));
});

gulp.task('default', gulp.series('build', 'watch'));
