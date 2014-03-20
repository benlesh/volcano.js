var gulp = require('gulp');
var traceur = require('gulp-traceur');

gulp.task('traceur', function (){
    gulp.src('es6/**/*.js')
        .pipe(traceur({ sourceMap: true, sourceMappingURL: true }))
        .pipe(gulp.dest('js'))
});

gulp.task('default', ['traceur']);