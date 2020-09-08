const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var less = require('gulp-less');
// gulp-uncss - delete unused CSS or gulp-purgecss
// const purgecss = require('gulp-purgecss');

// gulp-group-css-media-queries concat media queries
var gcmq = require('gulp-group-css-media-queries');

const babel = require('gulp-babel');
var uglify = require('gulp-uglify');

var smartgrid = require('smart-grid');

const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;

console.log(process.argv.indexOf('--dev') !== -1);

/*let cssFiles = [
    './node_modules/normalize-css/normalize.css',
    './src/css/base.css',
    './src/css/main.css',
];*/

let jsFiles = [
    './src/js/main.js'
];

function clear() {
    return del('build/*');
}

function styles() {
    return gulp.src('./src/css/style.less')
        .pipe(gulpif(isDev, sourcemaps.init()))
        // .pipe(concat('styles.css'))
        .pipe(less({
            // paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulpif(isProd, cleanCSS({
            level: 2
        })))
        /*.pipe(purgecss({
            content: ['src/!**!/!*.html']
        }))*/
        .pipe(gcmq())
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

function img() {
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./build/img'));
}

function html() {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src(jsFiles)
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(concat('script.js'))
        /*.pipe(babel({
            presets: ['@babel/env']
        }))*/
        // error output in console
        .on('error', console.error.bind(console))
        .pipe(gulpif(isProd, uglify({
            toplevel: true
        })))
        .pipe(gulpif(isDev, sourcemaps.write('.')))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });

    gulp.watch('./src/css/**/*.css', styles);
    gulp.watch('./src/css/**/*.less', styles);
    gulp.watch('./src/*.html', html);
    gulp.watch('./src/js/**/*.js', scripts);
}

function grid(done){
    let settings = {
        columns: 24,
        offset: "10px",
        breakPoints: {
           /* lg: {
                width: "1200px"
            },*/
            md: {
                width: "992px",
                fields: "15px"
            },
            sm: {
                width: "720px"
            },
            xs: {
                width: "576px"
            },
            xxs: {
                width: "420px"
            }
        },
        container: {
            maxWidth: "950px",
            fields: "30px"  // Min half of offset
        },
    };

    smartgrid( './src/css' , settings);
    done();
}

let build = gulp.series(clear,
    gulp.parallel(styles, img, html, scripts)
);

gulp.task('grid', grid);
gulp.task('build', build);
gulp.task('watch', gulp.series(build, watch));

/*
gulp.task('css', styles);
gulp.task('img', img);
gulp.task('html', html);
gulp.task('clear', clear);*/
