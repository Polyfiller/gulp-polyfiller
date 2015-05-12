var Polyfiller  = require("polyfiller"),
	gutil       = require("gulp-util"),
	File        = require("vinyl"),
	stream      = require("stream"),
	Readable    = stream.Readable,
	Transform   = stream.Transform,
	PLUGIN_NAME = "gulp-polyfiller";

function log() {
    var args, sig;

    args = Array.prototype.slice.call(arguments);
    sig = '[' + PLUGIN_NAME + ']';
    args.unshift(sig);

    gutil.log.apply(gutil, args);
};

function bundle(features, options) {
	var polyfiller, source, processor;

	options = options || {};
	options.path = options.path || "polyfills.js";

	if (processor = options.process) {
		source = "";
	}

	polyfiller = new Polyfiller(options);

	polyfills = polyfiller.find(features, function(feature, name) {
		if (processor) {
			source += processor.apply(this, arguments);
		}
	});

	if (processor) {
		source = polyfiller.options.wrapper(source);
	} else {
		source = polyfiller.pack(polyfills);
	}

	log("Successfully compiled polyfills");

	return new File({
		path: options.path,
		contents: new Buffer(source)
	});
}

module.exports = function(features, options) {
	var stream;

	stream = new Transform({ objectMode: true });
	
	stream._transform = function(file, enc, done) {
		// bypass anything
		this.push(file);
		done();
	};

	stream._flush = function(done) {
		// push to stream polyfills
		try {
			this.push(bundle(features, options));
			done();
		} catch (err) {
			done(err);
		}
	};

	return stream;
};

module.exports.bundle = function(features, options) {
	var stream;

	stream = new Readable({ objectMode: true });
	stream._read = function(size) {
		try {
			this.push(bundle(features, options));
		} catch (err) {
			this.emit("error", new gutil.PluginError(PLUGIN_NAME, err));
		}
		
		// end anyway	
		this.push(null);
	};

	return stream;
};