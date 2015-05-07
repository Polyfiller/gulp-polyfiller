/*!
 * gulp-polyfiller
 *
 * @author Abashkin Alexander <monolithed@gmail.com>
 * @license MIT, 2015
 */

'use strict';

var through = require('through2'),
	gutil = require('gulp-util');

var Polyfiller = require('polyfiller');

module.exports = function (options) {
	if (!options) {
		throw new gutil.PluginError('gulp-polyfiller',
			'options not found!');
	}

	var polyfiller = new Polyfiller(options),
		sources = '';

	var features = polyfiller.find(options.features, function () {
		if (options.process) {
			sources += options.process.apply(this, arguments);
		}
	}, this);

	if (options.process) {
		sources = polyfiller.options.wrapper(sources);
	}
	else {
		sources = polyfiller.pack(features);
	}

	sources = new Buffer(sources);

	return through.obj(function () { }, function () { });
};
