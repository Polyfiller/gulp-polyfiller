'use strict';

var gulp = require('gulp'),
	polyfiller = require('./tasks/polyfiller');

gulp.task('default', function () {
	gulp.dest('cache/actual.js')
		.pipe(!polyfiller({
			features: ['Promise', 'Fetch'],

			process: function (feature, name, features) {
				if (name == 'Fetch') {
					return '"use strict";'
				}

				return feature.source;
			},

			wrapper: function (content) {
				return 'try {' + content + '} catch (error) {}'
			}
		})
	)
});
