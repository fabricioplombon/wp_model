'use strict';

// Load plugins
var gulp = require('gulp'),
sass = require('gulp-sass'),
notify = require("gulp-notify"),
uglify = require('gulp-uglify'),
rename = require('gulp-rename'),
concat = require('gulp-concat'),
bower = require('gulp-bower'),
imagemin = require('gulp-imagemin'),
minifyCss = require('gulp-minify-css'),
sourcemaps = require('gulp-sourcemaps'),
gulpSequence = require('gulp-sequence'),
cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();

// Paths
var config = {
    wp: './public/wp-content/themes/modelo/',
    bowerDir: './bower_components',    
    styles: './resources/scss/',
    images: './resources/img/',    
    html: './*.{html,php}',
    scripts: [
      // jQuery
      './bower_components/jquery/dist/jquery.min.js',
      // SmoothScroll
      './bower_components/smoothscroll/src/smoothscroll.js',
      // Slick Slider
      './bower_components/slick-carousel/slick/slick.min.js',   
      // Vendor Scripts
      './resources/js/vendor/**/*.js',
      // App Scripts
      './resources/js/app/**/*.js'
    ]
}

// Bower
gulp.task('bower', function() {
    return bower()
    .pipe(gulp.dest(config.bowerDir))
});

// CSS
gulp.task('css', function () {
 return gulp.src(config.styles + '/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))  
  .pipe(rename({ suffix: '.min' }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest( config.wp + 'assets/css/' ))  
  .pipe(browserSync.stream())
  .pipe(notify({ message: 'CSS task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src(config.scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))    
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest( config.wp +  'assets/js/'))    
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('html', function() {
    return gulp.src(config.html)
      .pipe(gulp.dest(''))
      .pipe(browserSync.stream())
      .pipe(notify({ message: 'HTML task complete' }));
});

// HTML
gulp.task('images', function() {
  return gulp.src(config.images +  '/**/*.{gif,jpg,png,svg}')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true }))
    .pipe(gulp.dest(config.wp + 'assets/img/'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['css'], function() {

    browserSync.init({
      proxy: "localhost/_modelo/public/",
      online: true 
    });

     // Styles
    gulp.watch(config.styles + '/**/*.scss', ['css']);
    // Watch .js files
    gulp.watch(config.scripts, ['scripts']);
    // HTML/PHP
    gulp.watch(config.html).on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['serve'], gulpSequence(['scripts'], 'css', 'html'));

// Watch Files For Changes
gulp.task('watch', function() {

    // Styles
    gulp.watch(config.styles + '/**/*.scss', ['css']);

    // Watch .js files
    gulp.watch(config.scripts, ['scripts']);

    // Watch html files
    gulp.watch(config.html, ['html']);

});
