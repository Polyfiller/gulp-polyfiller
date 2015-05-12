var gulp = require('gulp');
var polyfiller = require('../gulp-polyfiller');

gulp.task('default', function () {
	polyfiller
		.bundle(['Promise', 'Fetch'])
		.pipe(gulp.dest('cache'));
});
