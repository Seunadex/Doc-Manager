import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import babel from 'gulp-babel';
import jasmine from 'gulp-jasmine';
import istanbul from 'gulp-istanbul';
import injectModules from 'gulp-inject-modules';
import exit from 'gulp-exit';

process.env.NODE_ENV = 'devtest';

gulp.task('nodemon', () => {
  nodemon({
    script: 'build/server.js',
    ext: 'js',
    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
    watch: ['server']
  });
});

gulp.task('dev', () => gulp.src('server/**/*.js')
  .pipe(babel({
    presets: ['es2015', 'stage-2']
  }))
  .pipe(gulp.dest('build')));

gulp.task('test', () => {
  gulp.src('./server/tests/**/*.js')
    .pipe(babel())
    .pipe(jasmine())
    .pipe(exit());
});

gulp.task('coverage', ['dev'], (cb) => {
  gulp.src('build/**/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src('./server/tests/**/*.js')
        .pipe(babel())
        .pipe(injectModules())
        .pipe(jasmine({
          verbose: true
        }))
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 10 } }))
        .on('end', cb)
        .pipe(exit());
    });
});

gulp.task('default', ['dev', 'nodemon'], () => {
  gulp.watch('server/**/*.js', ['dev']);
});
