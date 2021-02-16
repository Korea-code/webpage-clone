import gulp from 'gulp';
import del from 'del';
import sass from 'gulp-sass';
import minify from 'gulp-csso';
import autoprefixer from 'gulp-autoprefixer';
import gulp_image from 'gulp-image';
import gulp_ts from 'gulp-typescript';
import ghPages from 'gulp-gh-pages';

sass.compiler = require('node-sass');

const tsProject = gulp_ts.createProject('tsconfig.json');
const routes = {
  css: {
    watch: 'src/scss/**/*',
    src: 'src/scss/**/*.scss',
    dest: 'dist/css',
  },
  img: {
    src: 'src/img/*',
    dest: 'dist/img',
  },
  ts: {
    watch: 'src/ts/**/*.ts',
    src: 'src/ts/**/*.ts',
    dest: 'dist/js',
  },
  html: {
    src: 'src/html/*.html',
    dest: 'dist',
  },
};

const styles = () =>
  gulp
    .src(routes.css.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        flexbox: true,
        grid: 'autoplace',
      })
    )
    .pipe(minify())
    .pipe(gulp.dest(routes.css.dest));

const watch = () => {
  gulp.watch(routes.css.watch, styles);
  gulp.watch(routes.ts.watch, ts);
};

const img = () =>
  gulp.src(routes.img.src).pipe(gulp_image()).pipe(gulp.dest(routes.img.dest));

const ts = () =>
  gulp
    .src(routes.ts.src)
    .pipe(gulp_ts(tsProject()))
    .pipe(gulp.dest(routes.ts.dest));

const html = () => gulp.src(routes.html.src).pipe(gulp.dest(routes.html.dest));

const clean = () => del(['dist/styles.css', '.publish']);

const gulpDeploy = () => gulp.src('dist/**/*').pipe(ghPages());
const prepare = gulp.series([clean, img]);

const assets = gulp.series([html, styles, ts]);

const live = gulp.parallel([watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, gulpDeploy, clean]);
