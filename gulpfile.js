'use strict';

var gulp = require('gulp'),
  argv = require('yargs').argv,
  gutil = require('gulp-util'),
  filter = require('gulp-filter'),
  eslint = require('gulp-eslint'),
  beautify = require('gulp-jsbeautifier'),
  config = require('./package.json'),
  _ = require('lodash');


// Task: drop-component
// This task copies the non-dev dependencies as well as the source required
// to run the application.
gulp.task('drop-component', function () {
  var jsFilter;

  jsFilter = filter(['**/*.js'], {
    restore: true
  });

  return gulp
    .src(['**/*.+(js|json|sql|yml)',
      '!node_modules/**/*',
      '!test/**/*',
      '!gulpfile.js'
    ])
    .pipe(jsFilter)
    .pipe(jsFilter.restore)
    .pipe(gulp.dest('.'));
});


// Task: lint-and-beautify
// Performs in-place linting & beautification of the *src* files. We perform
// this in-place so that the checked in code is clean and consistent.
gulp.task('lint-and-beautify', function () {
  // Beautify Config: src/.jsbeautifyrc
  // Linting Config: src/.estlintrc
  return gulp
    .src(['index.js', '**/*.js', '!node_modules/**/*.js', '!coverage/**/*'])
    .pipe(beautify({
      config: '.jsbeautifyrc',
      mode: argv['fail-on-beautify'] ? 'VERIFY_ONLY' : 'VERIFY_AND_WRITE'
    }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['lint-and-beautify']);
