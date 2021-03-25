const fs = require('fs');
const gulp = require('gulp');
const yaml = require('yaml');
const path = require('path');
const cssnano = require('cssnano');
const merge = require('merge-stream');
const browserSync = require('browser-sync');
const autoprefixer = require('autoprefixer');
const themeKit = require('@shopify/themekit');
const plugins = require('gulp-load-plugins')();

const isDev = process.env.NODE_ENV === 'development';
const config = yaml.parse(fs.readFileSync('config.yml', 'utf-8')).development;

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
        content: contents.substring(contentStart, contentEnd).trim(),
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
        contents = style.content.length ? `(() => {${script.content}})();` : '';
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
    .src(['src/global/global.scss', ...sources])
    .pipe(plugins.if((file) => path.extname(file.path) === '.liquid', parse('style')))
    .pipe(plugins.concat('main.scss'))
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(
      plugins.if(
        () => isDev,
        plugins.postcss([autoprefixer()]),
        plugins.postcss([autoprefixer(), cssnano()])
      )
    )
    .pipe(plugins.if(() => isDev, plugins.prettier()))
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('scripts', () => {
  return gulp
    .src(['src/global/global.js', ...sources])
    .pipe(plugins.if((file) => path.extname(file.path) === '.liquid', parse('script')))
    .pipe(plugins.concat('main.js'))
    .pipe(plugins.babel({ presets: ['@babel/env'] }))
    .pipe(plugins.if(() => isDev, plugins.prettier(), plugins.uglify()))
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('vendors', () => {
  const styles = gulp
    .src('src/vendors/vendor.scss')
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

  const scriptSource = JSON.parse(fs.readFileSync('src/vendors/vendor.json', 'utf-8')).map(
    (path) => `src/vendors/${path}`
  );

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
gulp.task('clean', () => {
  return gulp.src('dist/*').pipe(plugins.clean({ force: true }));
});

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

const buildAssets = gulp.parallel('assets');
const buildVendors = gulp.parallel('vendors');
const buildSettings = gulp.parallel('config', 'locales');
const buildLiquid = gulp.parallel('templates', 'styles', 'scripts');

gulp.task(
  'build',
  gulp.series('clean', 'folders', buildAssets, buildSettings, buildVendors, buildLiquid)
);

gulp.task('watch', () => {
  gulp.watch('src/assets/*.*', buildAssets);
  gulp.watch('src/vendors/**/*.*', buildVendors);
  gulp.watch([...sources, 'src/global/**/*.*'], buildLiquid);
  gulp.watch(['src/config/*.json', 'src/locales/*.json'], buildSettings);

  themeKit.command('watch', {
    allowLive: true,
    env: 'development',
    notify: path.join(__dirname, '.updated'),
  });
});

gulp.task('serve', () => {
  browserSync({
    port: 8080,
    open: false,
    notify: false,
    reloadDelay: 1500,
    proxy: `https://${config.store}/`,
    files: path.join(__dirname, '.updated'),
    snippetOptions: {
      rule: {
        match: /<\/body>/i,
        fn: function (snippet, match) {
          return snippet + match;
        },
      },
    },
  });
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
