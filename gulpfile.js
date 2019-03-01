'use-strict'

const path = require('path');

// > Dev dependecies packages
const gulp = require('gulp');
const browsersync = require('browser-sync').create();

const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const copy = require('gulp-copy');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const del = require('del');

// > Tasks

// > browserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: path.join(__dirname, 'dist'),
    }
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function cloneFiles() {
  return gulp
    .src(['./app/src/fonts', './app/src/index.html'])
    .pipe(gulp.dest('./dist'))
    .pipe(browsersync.stream())
}

function cloneAssets() {
  return gulp
    .src('./app/src/assets/*')
    .pipe(gulp.dest('./dist/assets'))
}

function cleanFiles() {
  return del(['./dist/**/*'])
}

function iconSet() {
  return gulp
    .src('./app/src/assets/icons/*.svg')
    .pipe(gulp.dest('./dist/assets/icons'))
}

// Optimize Images
// function images() {
//   return gulp
//     .src("./app/src/assets/**/*")
//     .pipe(newer("./_site/assets/img"))
//     .pipe(
//       imagemin([
//         imagemin.gifsicle({ interlaced: true }),
//         imagemin.jpegtran({ progressive: true }),
//         imagemin.optipng({ optimizationLevel: 5 }),
//         imagemin.svgo({
//           plugins: [
//             {
//               removeViewBox: false,
//               collapseGroups: true
//             }
//           ]
//         })
//       ])
//     )
//     .pipe(gulp.dest("./_site/assets/img"));
// }

function styles() {
  return gulp
    .src(['./app/src/scss/**/*.scss'])
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(concat('styles.css'))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest('./dist'))
    .pipe(browsersync.stream())
}

function scripts() {
  return gulp
    .src(['./app/src/js/**/*.js'])
    .pipe(plumber())
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(browsersync.stream())
}

function watchFiles(done) {
  gulp.watch('./app/src/js/**/*.js', scripts)
  gulp.watch('./app/src/scss/**/*.scss', styles)
  gulp.watch('./app/src/index.html', cloneFiles)
  done();
}

// > define tasks order execution
const build = gulp.series(cleanFiles, gulp.parallel(styles, scripts, cloneFiles, cloneAssets), iconSet)
const watch = gulp.parallel(watchFiles, browserSync)

module.exports = {
  watch,
  build,
  default: build
}