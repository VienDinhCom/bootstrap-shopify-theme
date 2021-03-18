/*
 [] Auto format
 [] Minify
 [] Bundle vendor
*/

const gulp = require('gulp');
const cheerio = require('cheerio');
const plugins = require('gulp-load-plugins')();

function parse(type) {
  return plugins.tap(function (file) {
    const html = file.contents?.toString() || '';
    const $ = cheerio.load(html);

    const str = file.contents?.toString() || '';

    let contents = '';

    switch (type) {
      case 'template':
        if (
          html.indexOf('<html') > 0 &&
          html.indexOf('<head') > 0 &&
          html.indexOf('<body') > 0
        ) {
          contents = str.substring(
            str.indexOf('<template code>') + 15,
            str.lastIndexOf('</template>')
          );
        } else {
          contents = $('template[code]').html() || '';
        }
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
  plugins.watch([...sources, 'src/**/*.json'], build);
});

gulp.task('default', gulp.series('build', 'watch'));
