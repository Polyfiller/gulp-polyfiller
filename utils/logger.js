'use strict';

var util = require('util'),
	winston = require('winston'),
	winston_config = require('winston/lib/winston/config');

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			formatter: function (options) {
				var prefix = winston_config.colorize(options.level, '>>');

				return util.format('%s [%s] %s', prefix,
					logger.name, options.message);
			}
		})
	]
});

logger.on('logging', function (transport, level) {
	if (level === 'error') {
		process.exit(-1);
	}
});

module.exports = logger;
