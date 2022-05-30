/* eslint-disable @typescript-eslint/promise-function-async */
const gulp = require(`gulp`);
const del = require('del');

exports[`clean-dist`] = function removeIndexHtml () {
  return del([
    `./dist`,
  ]);
};

exports[`copy-build-to-www`] = gulp.series(
  function removeNonStatic () {
    return del([
      `./www/*`,
      `!./www/.gitkeep`,
    ]);
  },
  function extractNonStatic () {
    return gulp.src([
      `./dist/app/**`,
    ])
      .pipe(gulp.dest(`./www`));
  },
);

exports[`copy-apk`] = gulp.series(
  function removeNonStatic () {
    return del([
      `./apk/*`,
    ]);
  },
  function extractNonStatic () {
    return gulp.src([
      `./platforms/android/app/build/outputs/apk/debug/app-debug.apk`,
    ])
      .pipe(gulp.dest(`./apk`));
  },
);

exports[`extract-non-static`] = gulp.series(
  function extractNonStatic () {
    return gulp.src([
      `./dist/static/index.html`,
    ])
      .pipe(gulp.dest(`./dist`));
  },
  function removeNonStatic () {
    return del([
      `./dist/static/index.html`,
    ]);
  },
);
