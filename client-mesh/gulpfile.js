var gulp = require('gulp'),
    prefix = require('gulp-autoprefixer'),
    server = require("gulp-server-livereload"),
    sass = require('gulp-sass'),
    concat = require('gulp-concat');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src([
        'src/scss/index.scss',
    ])
        .pipe(sass())
        .pipe(gulp.dest("src/dist/css"))
});

gulp.task('sass:watch', function () {
    gulp.watch('src/scss/*.scss', ['sass'])
});


// Static Server + watching scss/html files

gulp.task('serve', function () {
    gulp.src('src')
        .pipe(server({
            livereload: true,
            open: true
        }));
});

gulp.task('build', function () {
    gulp.src('src/css/**/*.css')
        .pipe(prefix({
            browsers: ['last 3 versions']
        }))
        .pipe(gulp.dest('build/css'));
    gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('build/js'));
    gulp.src('src/img/**/*')
        .pipe(gulp.dest('build/img'));
    gulp.src('src/assets/**/*')
        .pipe(gulp.dest('build/assets'));
    return gulp.src('src/*.html')
        .pipe(gulp.dest('build'));
});

gulp.task('build:dependencies', function () {
    gulp.src('src/dependencies/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('src/dependencies'))
});


// Move the javascript files into our /src/js folder
gulp.task('js', function () {
    gulp.src(
        [
            'src/dependencies/*.js',
            'src/components/*.js'
        ])
        .pipe(concat('script.js'))
        .pipe(gulp.dest('src/dist'))
});

gulp.task('js:watch', function () {
    gulp.watch(['src/dependencies/*.js', 'src/components/*.js'], ['js'])
});

gulp.task('start', ['js:watch', 'sass:watch', 'serve']);
