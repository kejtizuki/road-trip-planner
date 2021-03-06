var gulp = require('gulp');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var clean = require('gulp-clean');
var server = require('gulp-express');


var bases = {
    dist: 'dist/'
};

gulp.task('lint', function () {
    return gulp.src('app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task('clean', function () {
    return gulp.src(bases.dist)
        .pipe(clean());
});


gulp.task('sass', function () {
    return gulp.src('assets/css/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(bases.dist + 'css'));
});


gulp.task('libMinify', function () {
    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/angular/angular.js',
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/angular-route/angular-route.min.js',
        'bower_components/lodash/dist/lodash.min.js',
        'bower_components/google-maps/lib/Google.min.js',
        'bower_components/angular-simple-logger/dist/angular-simple-logger.min.js',
        'bower_components/angular-google-places-autocomplete/src/autocomplete.js',
        'bower_components/angular-google-maps/dist/angular-google-maps.min.js',
        'bower_components/leaflet/dist/leaflet.js',
        'bower_components/leaflet-routeboxer/src/leaflet-routeboxer.js'
    ])
        .pipe(concat('dependency.js'))
        .pipe(rename('dependency.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(bases.dist + 'js'));
});


// Concatenate & Minify JS
gulp.task('scripts', function () {
    return gulp.src([
        'app/*.js',
        'app/modules/**/*.js',
        'app/modules/*.js',
        'app/components/*.js',
        'app/components/**/*.js'
    ])
        .pipe(concat('all.js'))
        // .pipe(gulp.dest('dist'))
        // .pipe(rename('all.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest(bases.dist + 'js'));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch('index.html');
    gulp.watch('app/**/*.html');
    gulp.watch('app/**/*.js', ['lint', 'scripts']);
    gulp.watch('assets/css/**/*.scss', ['sass']);
    gulp.watch('server.js');
});


gulp.task('server', function () {
    // Start the server at the beginning of the task
    server.run(['server.js']);

});

gulp.task('images', function () {
    return gulp.src('assets/img/**/*.jpg')
        .pipe(gulp.dest('dist/img'))
});


gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
gulp.task('run', ['lint', 'sass', 'scripts', 'server', 'libMinify', 'watch', 'images']);
