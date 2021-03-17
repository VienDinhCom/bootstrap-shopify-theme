import * as gulp from 'gulp';
import cheerio from 'cheerio';

import sass from 'gulp-sass';
import concat from 'gulp-concat';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import tap from 'gulp-tap';

function parse(type: 'template' | 'style' | 'script') {
  return tap(function (file) {
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
    }

    file.contents = Buffer.from(contents.trim(), 'utf-8');
  });
}

gulp.task('template', () => {
  return gulp
    .src('src/**/*.liquid')
    .pipe(parse('template'))
    .pipe(gulp.dest('dist'));
});

gulp.task('style', () => {
  return gulp
    .src('src/**/*.liquid')
    .pipe(parse('style'))
    .pipe(concat('style.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('script', () => {
  return gulp
    .src('src/**/*.liquid')
    .pipe(parse('script'))
    .pipe(concat('script.js', { newLine: '\n' }))
    .pipe(gulp.dest('dist/assets'));
});
