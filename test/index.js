var proxyquire = require("proxyquire"),
	File       = require("vinyl"),
	sinon      = require("sinon"),
	stream     = require("stream"),
	_		   = require("lodash"),
	through    = require("through2"),
	chance     = require("chance")(),
	path 	   = require("path"),
	chai 	   = require("chai"),
	expect;

expect = chai.expect;
chai.config.includeStack = true;

function stubPolyfiller(polyfills, stubs) {
	
}

describe("gulp-polyfiller", function() {
	var polyfiller, stub, ctor, polyfills, source;

	beforeEach(function() {
		var ctor;

		source = chance.word();

		stub = {
			find: sinon.spy(function(features, callback, context) {
				features.forEach(function(name) {
					callback && callback.call(context, { source: "", config: {} }, name);
				});

				return polyfills;
			}),
			pack: sinon.stub().returns(source),
			options: {
				wrapper: sinon.stub()
			}
		};

		ctor = sinon.spy(function(options) {
			return stub;
		});


		proxyquire("../index.js", {
			"polyfiller": ctor,
			"gulp-util": {
				log: function() {
					//
				}
			}
		});
		
		polyfiller = require("../index.js");
	});

	afterEach(function() {
		delete require.cache[path.resolve(__dirname, "../index.js")];
	});

	describe("#main", function() {
		var file;

		beforeEach(function() {
			file = new File({ path: chance.word(), contents: new Buffer(chance.word()) })
		});

		it("should return Transform stream", function() {
			expect(polyfiller()).to.be.instanceOf(stream.Transform);
		});

		it("should bypass files", function(done) {
			var streaming, features, handler, path, process;

			streaming = polyfiller( (features = [ chance.word() ]), { path: (path = chance.word()) } );
			streaming.write(file);
			streaming.end();

			process = new stream.Writable({ objectMode: true });
			process._write = handler = sinon.spy(function(file, enc, cb) {
				cb(null, file);
			});

			streaming.pipe(process);

			process.on('finish', function() {
				expect(handler.callCount).equal(2);
				expect(handler.firstCall.calledWith(file)).to.be.true;
				expect(handler.secondCall.args[0].path).equal(path);
				done();
			});

			process.on('error', function(err) {
				done(err);
			});
		});

	});

	describe("#bundle", function() {

		it("should return Readable stream", function() {
			expect(polyfiller.bundle([])).to.be.instanceOf(stream.Readable);
		});

		it("should write polyfills file", function(done) {
			var features, source;

			features = [ chance.word() ];
			source = chance.word();

			stub.pack.returns(source);

			polyfiller.bundle(features)
				.pipe(through.obj(function(file, enc, cb) {
					try {
						expect(stub.find.callCount).equal(1);
						expect(stub.find.firstCall.calledWith(features)).to.be.true;

						expect(stub.pack.callCount).equal(1);
						expect(stub.pack.firstCall.calledWithExactly(polyfills)).to.be.true;

						expect(file).to.be.instanceOf(File);
						expect(file.contents.toString()).equal(source);

					} catch(err) {
						return done(err);
					}

					done();
					cb(null);
				}));
		});

		it("should write polyfills with process&wrapper", function(done) {
			var features, source, options, path, wrapped;

			features = [ chance.word() ];
			source = features.join("");

			stub.options.wrapper.returns( (wrapped = chance.word()) );

			options = {
				process: sinon.spy(function(feature, name) {
					return name;
				}),
				path: (path = chance.word())
			};

			polyfiller.bundle(features, options)
				.pipe(through.obj(function(file, enc, cb) {
					try {
						expect(stub.find.callCount).equal(1);
						expect(stub.find.firstCall.calledWith(features)).to.be.true;

						expect(stub.options.wrapper.callCount).equal(1);
						expect(stub.options.wrapper.firstCall.calledWithExactly(source)).to.be.true;

						expect(file).to.be.instanceOf(File);
						expect(file.path).equal(path);
						expect(file.contents.toString()).equal(wrapped);
					} catch(err) {
						return done(err);
					}

					done();
					cb(null);
				}));
		});

	});

});