var Polyfiller = require('polyfiller'),
	gutil      = require('gulp-util'),
	File       = require('vinyl'),
	stream     = require('stream'),
	Readable   = stream.Readable,
	Transform  = stream.Transform,
	log        = require('./utils/logger');

var PLUGIN_NAME = 'gulp-polyfiller';

log.name = PLUGIN_NAME

function bundle (features, options) {
	var polyfiller, source, processor;

	options = options || {};
	options.path = options.path || 'polyfills.js';

	if (processor = options.process) {
		source = '';
	}

	polyfiller = new Polyfiller(options);

	polyfills = polyfiller.find(features, function (feature, name) {
		if (processor) {
			source += processor.apply(this, arguments);
		}
	});

	if (processor) {
		source = polyfiller.options.wrapper(source);
	}
	else {
		source = polyfiller.pack(polyfills);
	}

	log.info('File "' + options.path + '" created.');

	return new File({
		path    : options.path,
		contents: new Buffer(source)
	});
}

module.exports = function (features, options) {
	var stream = new Transform({ objectMode: true });

	stream._transform = function (file, enc, done) {
		this.push(file);
		done();
	};

	stream._flush = function (done) {
		try {
			this.push(bundle(features, options));
			done();
		}
		catch (error) {
			done(error);
		}
	};

	return stream;
};

module.exports.bundle = function (features, options) {
	var stream = new Readable({ objectMode: true });

	stream._read = function (size) {
		try {
			this.push(bundle(features, options));
		}
		catch (error) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, error));
		}

		this.push(null);
	};

	return stream;
};
