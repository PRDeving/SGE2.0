const gulp = require('gulp');
const uglify = require('gulp-uglify');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const del = require('del');

const SRC_PATH = './src/';
const SRC_DEPS = './src/lib';
const SRC_CORE = './src/core';
const BUILD_PATH = './build/SGE2/';

gulp.task('clean-core',[],()=> del([BUILD_PATH + 'core']));
gulp.task('clean-build',[],()=> del([BUILD_PATH]));

// gulp.task('compile-dependencies',[],()=> {
//     return gulp.src(SRC_DEPS
// });

gulp.task('compile-core',['clean-core'],()=>{
    return gulp.src([
        String(SRC_DEPS+'**/*.js'),
        String(SRC_CORE+'**/*.js'),
    ])
    .pipe(concat('sge.js'))
    // .pipe(uglify())
    // .pipe(minify())
    .pipe(gulp.dest(BUILD_PATH + 'core'))
});

gulp.task('build',['clean-build', 'compile-core'], ()=>{
    
});
