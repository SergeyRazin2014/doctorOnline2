const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');

//SCSS
gulp.task('scss', () => {
    console.log('TASK SCSS***************');
    return gulp
        .src('static/source/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(
            ["last 15 versions", "> 1%", "ie 8", "ie 7"], {
                cascade: true
            }
        ))
        .pipe(gulp.dest('static/dest/styles'))
})

//QUIZ
gulp.task('selectQuiz', () => {
    console.log('**********selectQuiz.js****************');
    gulp.src([
        'static/source/js/quizzingSelect/**/*.js',
    ])
        //.pipe(babel())
        .pipe(concat('selectQuiz.js'))
        .pipe(gulp.dest('static/dest/javascripts/quizzing/'))
});

gulp.task('quizEdit', () => {
    console.log('**********quizEdit.js****************');
    gulp.src([
        'static/source/js/quizEditing/**/*.js',
    ])
        .pipe(concat('quizEdit.js'))
        .pipe(gulp.dest('static/dest/javascripts/quizEditing/'))
})

gulp.task('runQuiz', () => {
    console.log('**********quizzingRun****************');
    gulp.src([
        'static/source/js/quizzingRun/**/*.js',
    ])
        .pipe(concat('quizzingRun.js'))
        .pipe(gulp.dest('static/dest/javascripts/quizzing/'))
});

//СТАТЬИ
gulp.task('eidtArticle', () => {
    console.log('**********eidtArticle.js****************');
    gulp.src([
        'static/source/js/articles/editArticle/*.js',
    ]).pipe(concat('editArticle.js'))
        .pipe(gulp.dest('static/dest/javascripts/editArticle/'))
});

gulp.task('deleteArticle', () => {
    console.log('**********deleteArticle.js****************');
    gulp.src([
        'static/source/js/articles/deleteArticle/*.js',
    ]).pipe(concat('deleteArticle.js'))
        .pipe(gulp.dest('static/dest/javascripts/deleteArticle/'))
})

gulp.task('imgUploader', () => {
    console.log('**********imgUploader.js****************');
    gulp.src(['static/source/js/common/imgUploader.js'])
        .pipe(gulp.dest('static/dest/javascripts/common'))
})

//DEFAULT
gulp.task('default', ['scss', 'selectQuiz', 'quizEdit', 'runQuiz', 'eidtArticle', 'deleteArticle', 'imgUploader' ], () => {
    console.log('******************default********************');
    gulp.watch('static/source/scss/**/*.scss', ['scss']);
    gulp.watch('static/source/js/quizzing/**/*.js', ['selectQuiz']);
    gulp.watch('static/source/js/quizEditing/**/*.js', ['quizEdit']);
    gulp.watch('static/source/js/quizzingRun/**/*.js', ['runQuiz']);
    gulp.watch('static/source/js/articles/editArticle/*.js', ['eidtArticle']);
    gulp.watch('static/source/js/articles/deleteArticle/*.js', ['deleteArticle']);
    gulp.watch('static/source/js/common/*.js',['imgUploader']);
})