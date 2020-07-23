var gulp = require('gulp');
var sourcemaps= require('gulp-sourcemaps');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var pug = require('gulp-pug');
var del = require('del');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber')




//////СТИЛИ


gulp.task('sass', function(){
  return gulp.src('./src/style/*.scss')
  .pipe(plumber({
    errorHandler:notify.onError(function(err){
      return {
          title: 'Styles',
          message: err.message
      }
  })
  }))
  .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat('style.css'))
    .on('error',notify.onError({
      title: 'Style '
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: [
       'last 2 versions',
       'opera 12.1',
        '> 1%',
        'ie 9',
        'ie 8'],
            cascade: false
  }))
    .pipe(csso())
  .pipe(sourcemaps.write())
   .pipe(gulp.dest('build/css'));
});


/////// СКРИПТЫ

gulp.task('scripts', function(){
  return gulp.src('src/scripts/**/*js')
  .pipe(concat('all.js'))
  .pipe(uglify({
    toplevel: true
  }))
  .pipe(gulp.dest('build/js'))
  .pipe(browserSync.stream()); 
});


///////ПАГ

gulp.task('pug', function(){
  return gulp.src('./src/pug/**/*.pug')
  .pipe(pug({pretty: true}))
  .on('error',notify.onError(function(error){
    return {
      title: 'Pug',
      message: error.message
    }
  }))
  .pipe(gulp.dest('./build/'))
});

/////УДАЛЕНИЕ  Build

gulp.task('clean', function(){
  return del([
    'build'
  ]);
});


//////ЛАЙФ-РЕЛОАД


gulp.task('serve', function(){
  browserSync.init({
    // open:false,
    server: './build'
  });
  browserSync.watch('build', browserSync.reload);
  
});


////WATCHер


gulp.task('watch', function(){
  gulp.watch('./src/style/*.scss', gulp.series('sass'));
  gulp.watch('./src/pug/*.pug', gulp.series('pug'));
  gulp.watch('src/scripts/**/*js', gulp.series('scripts'))
});


/////TASCK ДЛЯ ЗАПУСКА ВСЕХ ТАСКОВ


gulp.task('default', gulp.series(
  'clean',
  gulp.parallel(
    'sass',
    'pug',
    'scripts'
  ),
  gulp.parallel(
    'watch',
    'serve'
  )
));