var gulp = require('gulp'),
    gutil = require('gulp-util'),
    chalk = require('chalk'),
    order = require('gulp-order'),
    rename = require('gulp-rename'),
    merge = require('merge-stream'),
    concat = require('gulp-concat'),

    sass = require('gulp-sass'),
    prefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),

    nodemon = require('gulp-nodemon'),
    browserSync = require('browser-sync').create();

var jsOrders = [
    'helpers.js',
    'main.js'
];

var paths = {
    styles: ['./app/styles/main.scss'],
    scripts: ['./app/scripts/**/*.js']
};

function mapError(err) {
    if (err.fileName) {
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.fileName.replace(__dirname, ''))
            + ': '
            + 'Line '
            + chalk.magenta(err.lineNumber)
            + ' & '
            + 'Column '
            + chalk.magenta(err.columnNumber || err.column)
            + ': '
            + chalk.blue(err.description))
    } else {
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.blue(err.messageFormatted || err.message))
    }

    this.emit('end');
}

gulp.task('sass-bundle', function() {
    gulp.src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(sass()).on('error', mapError)
        .pipe(prefixer())
        .pipe(sourcemaps.write())
        .pipe(rename('bundle.css'))
        .pipe(gulp.dest('./www'))
});

gulp.task('js-bundle', function() {
    gulp.src(paths.scripts)
        .pipe(order(jsOrders))
        .pipe(sourcemaps.init())
        //.pipe(babel({presets: ['es2015']}))
        .pipe(concat("bundle.js"))
        .pipe(sourcemaps.write({sourceRoot: '/app'}))
        .pipe(gulp.dest('./www'))
});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        port: 2015,
        proxy: "http://localhost:7016",
        files: ["./www/**/*.*"],
        open: false
    });

    gulp.watch("./app/**/*.js", ['js-bundle']);
    gulp.watch("./app/styles/**/*.scss", ['sass-bundle']);
});

gulp.task('nodemon', function (callback) {
    var started = false;
    nodemon({script: 'server.js'}).on('start', function () {
        if (!started) {
            callback(); started = true;
        }
    });
});

gulp.task('default', ['js-bundle', 'sass-bundle', 'browser-sync']);