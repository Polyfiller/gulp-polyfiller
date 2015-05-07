# gulp-polyfiller

[![npm version badge](https://img.shields.io/npm/v/gulp-polyfiller.svg)](https://www.npmjs.org/package/gulp-polyfiller)
[![Build Status](https://travis-ci.org/Polyfiller/gulp-polyfiller.png)](https://travis-ci.org/Polyfiller/gulp-polyfiller)
[![Donate](https://img.shields.io/gratipay/polyfiller.corp.svg)](https://gratipay.com/polyfiller.corp)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE.txt)


> Gulp task for [Polyfiller](https://github.com/Polyfiller/polyfiller) 


## Getting Started
If you haven't used [Gulp](http://gulpjs.com/) before, be sure to check out the [Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/README.md) guide, as it explains how to create a `gulpfile` as well as install and use Gulp plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install --save-dev gulp-polyfiller
```


### Usage Example

```js
var gulp = require('gulp');
var polyfiller = require('gulp-polyfiller');

gulp.task('default', function () {
	gulp.dest('polyfills.js')
		.pipe(polyfiller({ features: ['Promise', 'Fetch'] }))
});
```


### Options

#### catalog
Type: `Array` <br />
Default: `[trunk/catalog]`

Have custom polyfills? Add paths to their location here.

```js
var path = require('path');

....
{
	catalog: [ 
		path.resolve(__dirname, '../your/catalog') 
	]
}
....
```

#### exclude

Type: `Array` <br />
Default: `[]`

Some polyfills have dependencies that you can exclude here.

```js
....
{
	exclude: ['setImmediate']
}
....
```

#### verbose

Type: `Boolean` <br />
Default: `false`

Verbose mode is an option that provides additional details as to what the package is doing.

```js
....
{
	verbose: true
}
....
```

#### wrapper

Type: `Function` <br />
Default: `None`

A custom wrapper for your environment

```js
....
{
	wrapper: function (source) {
		return ';(function () {' + source + '}.call(self));'
	}
}
....
```

#### process

Type: `Function(Object:feature, String:name, Array:features)` <br />

This option as an advanced way to control the file contents that are created.

```js
....
{
	process: function (feature, name, features) {
		return feature.source;
	}
}
....
```

For more details see the [Polyfiller](https://github.com/Polyfiller/polyfiller) documentation

### Tests

```
gulp test
```


### License

MIT

Task submitted by [Alexander Abashkin](https://github.com/monolithed)
